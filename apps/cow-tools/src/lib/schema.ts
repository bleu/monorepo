import { Address } from "@bleu-fi/utils";
import { isAddress, PublicClient } from "viem";
import { z } from "zod";

import { dynamicSlippagePriceCheckerAbi } from "./abis/dynamicSlippagePriceChecker";
import { encodePriceCheckerData } from "./encode";
import { PRICE_CHECKERS, PriceCheckerArgument } from "./types";

const basicAddressSchema = z
  .string()
  .min(1)
  .refine((value) => isAddress(value), {
    message: "Provided address is invalid",
  });

const baseTokenAddress = z.object({
  address: basicAddressSchema,
  decimals: z.number().positive(),
  symbol: z.string(),
});

const priceCheckerRevertedMessage =
  "This price checker contract reverted for this parameters.";

export const orderOverviewSchema = z
  .object({
    tokenSell: baseTokenAddress,
    tokenSellAmount: z.coerce.number().positive(),
    tokenBuy: baseTokenAddress,
    receiverAddress: basicAddressSchema,
    isValidFromNeeded: z.coerce.boolean(),
    validFrom: z.coerce.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.isValidFromNeeded) {
        return true;
      }
      return data.validFrom;
    },
    {
      path: ["validFrom"],
      message: "Valid from is needed",
    }
  )
  .refine(
    (data) => {
      return data.tokenSell.address != data.tokenBuy.address;
    },
    {
      path: ["tokenBuy"],
      message: "Tokens sell and buy must be different",
    }
  );

const basicPriceCheckerSchema = z.object({
  priceChecker: z.coerce.string(),
  priceCheckerAddress: basicAddressSchema,
});

export const basicDynamicSlippageSchema = basicPriceCheckerSchema.extend({
  allowedSlippageInBps: z.coerce.number().positive(),
});

export const priceCheckingBaseSchemaMapping = {
  [PRICE_CHECKERS.FIXED_MIN_OUT]: basicPriceCheckerSchema.extend({
    minOut: z.coerce.number().positive(),
  }),
  [PRICE_CHECKERS.UNI_V2]: basicDynamicSlippageSchema,
  [PRICE_CHECKERS.SUSHI_SWAP]: basicDynamicSlippageSchema,
  [PRICE_CHECKERS.CHAINLINK]: basicDynamicSlippageSchema.extend({
    revertPriceFeeds: z.boolean().array().nonempty(),
    addressesPriceFeeds: basicAddressSchema.array().nonempty(),
  }),
  [PRICE_CHECKERS.BALANCER]: basicDynamicSlippageSchema,
  [PRICE_CHECKERS.UNI_V3]: basicDynamicSlippageSchema
    .extend({
      tokenIn: z.array(basicAddressSchema).nonempty(),
      tokenOut: z.array(basicAddressSchema).nonempty(),
      fees: z.array(z.coerce.number().positive()).nonempty(),
    })
    .refine(
      (data) => {
        const previousTokenOutIsNextTokenIn = data.tokenIn.every(
          (token, index) => {
            if (index === 0) {
              return true;
            }
            return token === data.tokenOut[index - 1];
          }
        );
        return previousTokenOutIsNextTokenIn;
      },
      {
        path: ["tokenIn"],
        message: "The token out must be the token in of the next line",
      }
    ),
} as const;

export const generatePriceCheckerSchema = ({
  priceChecker,
  expectedArgs,
}: {
  priceChecker: PRICE_CHECKERS;
  expectedArgs: PriceCheckerArgument[];
}) => {
  const priceCheckerBase = priceCheckingBaseSchemaMapping[priceChecker];
  return ({
    tokenSellAddress,
    tokenBuyAddress,
    tokenBuyDecimals,
    publicClient,
  }: {
    tokenSellAddress: Address;
    tokenBuyAddress: Address;
    tokenBuyDecimals: number;
    publicClient: PublicClient;
  }) => {
    // @ts-ignore
    return priceCheckerBase.refine(
      // @ts-ignore
      async (data) => {
        try {
          const argsToEncode = expectedArgs.map((arg) => {
            return arg.convertInput(data[arg.name], tokenBuyDecimals);
          });
          const priceCheckerData = encodePriceCheckerData(
            priceChecker,
            argsToEncode
          );
          await publicClient.readContract({
            address: data.priceCheckerAddress as Address,
            abi: dynamicSlippagePriceCheckerAbi,
            functionName: "checkPrice",
            args: [
              1, // we're just interested in call revert or not, so this value is not important
              tokenBuyAddress,
              tokenSellAddress,
              0, // this value isn't used by this price checker
              0, // this value will depend on the order, so it's not important here
              priceCheckerData,
            ],
          });
          return true;
        } catch (e) {
          return false;
        }
      },
      {
        path: ["priceChecker"],
        message: priceCheckerRevertedMessage,
      }
    );
  };
};
