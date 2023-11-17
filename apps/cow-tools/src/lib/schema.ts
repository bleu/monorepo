import { Address } from "@bleu-fi/utils";
import { encodeAbiParameters, isAddress, PublicClient } from "viem";
import { z } from "zod";

import { chainlinkPriceFeeAbi } from "./abis/chainlinkPriceFeed";
import { dynamicSlippagePriceCheckerAbi } from "./abis/dynamicSlippagePriceChecker";
import { PRICE_CHECKERS, PriceCheckerArgument } from "./types";
import { encodePriceCheckerData } from "./encode";

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
      return data.tokenSell.address != data.tokenBuy.address;
    },
    {
      path: ["tokenBuy"],
      message: "Tokens sell and buy must be different",
    },
  );

const basicPriceCheckerSchema = z.object({
  priceChecker: z.coerce.string(),
  priceCheckerAddress: basicAddressSchema,
});

export const getBasicDynamicSlippageSchema = ({
  tokenSellAddress,
  tokenBuyAddress,
  publicClient,
}: {
  tokenSellAddress: Address;
  tokenBuyAddress: Address;
  publicClient: PublicClient;
}) => {
  return basicPriceCheckerSchema
    .extend({
      allowedSlippageInBps: z.coerce.number().positive(),
    })
    .refine(
      async (data) => {
        const bigIntAllowedSlippageInBps = BigInt(
          data.allowedSlippageInBps * 100,
        );
        console.log(
          encodeAbiParameters(
            [
              {
                type: "uint256",
                name: "allowedSlippageInBps",
              },
              {
                type: "bytes",
                name: "_data",
              },
            ],
            [bigIntAllowedSlippageInBps, "0x"],
          ),
        );
        try {
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
              encodeAbiParameters(
                [
                  {
                    type: "uint256",
                    name: "allowedSlippageInBps",
                  },
                  {
                    type: "bytes",
                    name: "_data",
                  },
                ],
                [bigIntAllowedSlippageInBps, "0x"],
              ),
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
      },
    );
};

export const getFixedMinOutSchema = ({
  tokenSellAddress,
  tokenBuyAddress,
  publicClient,
}: {
  tokenSellAddress: Address;
  tokenBuyAddress: Address;
  publicClient: PublicClient;
}) => {
  return basicPriceCheckerSchema
    .extend({
      minOut: z.coerce.number().positive(),
    })
    .refine(
      async (data) => {
        try {
          await publicClient.readContract({
            address: data.priceCheckerAddress as Address,
            abi: dynamicSlippagePriceCheckerAbi,
            functionName: "checkPrice",
            args: [
              1, // we're just interested in call revert or not, so this value is not important
              tokenSellAddress,
              tokenBuyAddress,
              0, // this value isn't used by this price checker
              0, // this value will depend on the order, so it's not important here
              encodeAbiParameters(
                [
                  {
                    type: "uint256",
                    name: "allowedSlippageInBps",
                  },
                  {
                    type: "bytes",
                    name: "_data",
                  },
                ],
                [BigInt(data.minOut), "0x"],
              ),
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
      },
    );
};

export const getChainlinkSchema = ({
  tokenSellAddress,
  tokenBuyAddress,
  publicClient,
}: {
  tokenSellAddress: Address;
  tokenBuyAddress: Address;
  publicClient: PublicClient;
}) => {
  return basicPriceCheckerSchema
    .extend({
      allowedSlippageInBps: z.coerce.number().positive(),
      priceFeeds: z
        .array(
          z.object({
            address: basicAddressSchema,
            description: z.string(),
            reversed: z.boolean(),
          }),
        )
        .nonempty(),
      revertPriceFeeds: z.array(z.boolean()).nonempty(),
      addressesPriceFeeds: z.array(basicAddressSchema).nonempty(),
    })
    .refine(
      async (data) => {
        const bigIntAllowedSlippageInBps = BigInt(
          data.allowedSlippageInBps * 100,
        );
        const expectedOutData = encodeAbiParameters(
          [
            {
              type: "address[]",
              name: "priceFeeds",
            },
            {
              type: "bool[]",
              name: "revertPriceFeeds",
            },
          ],
          [data.addressesPriceFeeds as Address[], data.revertPriceFeeds],
        );
        try {
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
              encodeAbiParameters(
                [
                  {
                    type: "uint256",
                    name: "allowedSlippageInBps",
                  },
                  {
                    type: "bytes",
                    name: "_data",
                  },
                ],
                [bigIntAllowedSlippageInBps, expectedOutData],
              ),
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
      },
    );
};

export const getPriceFeedChainlinkSchema = (publicClient: PublicClient) => {
  return z
    .object({
      priceFeedAddress: basicAddressSchema,
      reversed: z.coerce.boolean(),
    })
    .refine(
      async (data) => {
        try {
          const accessController = await publicClient.readContract({
            address: data.priceFeedAddress as Address,
            abi: chainlinkPriceFeeAbi,
            functionName: "accessController",
            args: [],
          });
          return (
            accessController == "0x0000000000000000000000000000000000000000"
          );
        } catch (e) {
          return false;
        }
      },
      {
        path: ["priceFeedAddress"],
        message: "This address isn't a Chainlink price feed",
      },
    );
};

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
    priceFeeds: z
      .array(
        z.object({
          address: basicAddressSchema,
          description: z.string(),
          reversed: z.boolean(),
        }),
      )
      .nonempty(),
    revertPriceFeeds: z.array(z.boolean()).nonempty(),
    addressesPriceFeeds: z.array(basicAddressSchema).nonempty(),
  }),
  [PRICE_CHECKERS.BALANCER]: basicDynamicSlippageSchema,
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
    publicClient,
  }: {
    tokenSellAddress: Address;
    tokenBuyAddress: Address;
    publicClient: PublicClient;
  }) => {
    // @ts-ignore
    return priceCheckerBase.refine(
      // @ts-ignore
      async (data) => {
        const argsToEncode = expectedArgs.map((arg) => {
          // @ts-ignore
          return arg.convertInput(data[arg.name], 18);
        });

        const priceCheckerData = encodePriceCheckerData(
          priceChecker,
          argsToEncode,
        );

        try {
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
      },
    );
  };
};
