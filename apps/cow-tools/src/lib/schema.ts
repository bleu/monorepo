import { Address, capitalize } from "@bleu/utils";
import { isAddress, PublicClient } from "viem";
import { z } from "zod";

import { fetchCowQuote } from "#/lib/cow/fetchCowQuote";
import { ChainId } from "#/utils/chainsPublicClients";

import { dynamicSlippagePriceCheckerAbi } from "./abis/dynamicSlippagePriceChecker";
import { expectedOutCalculatorAbi } from "./abis/expectedOutCalculator";
import { encodeExpectedOutArguments, encodePriceCheckerData } from "./encode";
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

const expectedOutRevertedMessage =
  "This expected out calculator contract reverted for this parameters.";

export const generateOrderOverviewSchema = ({
  chainId,
}: {
  chainId: ChainId;
}) =>
  z
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
    )
    .superRefine((data, ctx) => {
      const amountIn = data.tokenSellAmount * 10 ** data.tokenSell.decimals;
      return fetchCowQuote({
        tokenIn: data.tokenSell,
        tokenOut: data.tokenBuy,
        amountIn,
        chainId,
        priceQuality: "fast",
      }).then((res) => {
        if (res.errorType) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: capitalize(res.description),
            path: ["tokenBuy"],
          });
        }
      });
    });

export const orderTwapSchema = z.object({
  isTwapNeeded: z.coerce.boolean(),
  delay: z.coerce.string().optional(),
  numberOfOrders: z.coerce.number().positive().optional(),
});

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
  [PRICE_CHECKERS.CURVE]: basicDynamicSlippageSchema,
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
  [PRICE_CHECKERS.META]: basicDynamicSlippageSchema.extend({
    swapPath: basicAddressSchema.array().nonempty(),
    expectedOutAddresses: basicAddressSchema.array().nonempty(),
    expectedOutData: z.coerce.string().array().nonempty(),
    expectedOutCalculatorsNotEncodedData: z.any().array(),
  }),
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
    tokenSell,
    tokenBuy,
    sellAmount,
    cowQuotedAmount,
    publicClient,
  }: {
    tokenSell: { address: Address; decimals: number };
    tokenBuy: { address: Address; decimals: number };
    sellAmount: number;
    cowQuotedAmount: number;
    publicClient: PublicClient;
  }) => {
    return (
      priceCheckerBase
        // @ts-ignore
        .superRefine(
          // @ts-ignore
          async (data, ctx) => {
            // Check if the first token is the token sell and the last token is the token buy on Meta Price Checker
            if (priceChecker === PRICE_CHECKERS.META) {
              if (
                data.swapPath[0] === tokenSell.address &&
                data.swapPath.slice(-1)[0] === tokenBuy.address
              ) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message:
                    "The first token must be the token sell and the last token must be the token buy",
                  path: ["priceChecker"],
                });
                return z.NEVER;
              }
            }

            try {
              const argsToEncode = expectedArgs.map((arg) => {
                return (
                  arg.convertInput?.(data[arg.name], tokenBuy.decimals) ||
                  data[arg.name]
                );
              });
              const priceCheckerData = encodePriceCheckerData(
                priceChecker,
                argsToEncode
              );

              const orderWillBeExecuted = await publicClient.readContract({
                address: data.priceCheckerAddress as Address,
                abi: dynamicSlippagePriceCheckerAbi,
                functionName: "checkPrice",
                args: [
                  sellAmount * 10 ** tokenSell.decimals,
                  tokenSell.address,
                  tokenBuy.address,
                  0, // this value isn't used by the price checkers
                  cowQuotedAmount * 10 ** tokenBuy.decimals,
                  priceCheckerData,
                ],
              });
              if (!orderWillBeExecuted) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message:
                    "The quoted CoW value is lower than the expected out.",
                  path: ["priceChecker"],
                });
              }
            } catch (e) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: priceCheckerRevertedMessage,
                path: ["priceChecker"],
              });
              return z.NEVER;
            }
          }
        )
    );
  };
};

const basicExpectedOutCalculatorSchema = z.object({
  fromToken: baseTokenAddress,
  toToken: baseTokenAddress,
  expectedOutCalculator: z.coerce.string(),
  expectedOutCalculatorAddress: basicAddressSchema,
});

export const expectedOutCalculatorSchemaMapping = {
  [PRICE_CHECKERS.FIXED_MIN_OUT]: null,
  [PRICE_CHECKERS.UNI_V2]: basicExpectedOutCalculatorSchema,
  [PRICE_CHECKERS.SUSHI_SWAP]: basicExpectedOutCalculatorSchema,
  [PRICE_CHECKERS.CHAINLINK]: basicExpectedOutCalculatorSchema.extend({
    revertPriceFeeds: z.boolean().array().nonempty(),
    addressesPriceFeeds: basicAddressSchema.array().nonempty(),
  }),
  [PRICE_CHECKERS.BALANCER]: basicExpectedOutCalculatorSchema,
  [PRICE_CHECKERS.CURVE]: basicExpectedOutCalculatorSchema,
  [PRICE_CHECKERS.UNI_V3]: basicExpectedOutCalculatorSchema
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
  [PRICE_CHECKERS.META]: null,
} as const;

export const generateExpectedOutCalculatorSchema = ({
  priceChecker,
  expectedArgs,
}: {
  priceChecker: PRICE_CHECKERS;
  expectedArgs: PriceCheckerArgument[];
}) => {
  const expectedOutBase = expectedOutCalculatorSchemaMapping[priceChecker];
  if (!expectedOutBase) {
    return () => z.null();
  }
  return ({ publicClient }: { publicClient: PublicClient }) => {
    return expectedOutBase.refine(
      async (data) => {
        try {
          const argsToEncode = expectedArgs.map((arg) => {
            // @ts-ignore
            return arg.convertInput(data[arg.name]);
          });
          const expectedOutData = encodeExpectedOutArguments(
            priceChecker,
            argsToEncode
          );
          await publicClient.readContract({
            address: data.expectedOutCalculatorAddress as Address,
            abi: expectedOutCalculatorAbi,
            functionName: "getExpectedOut",
            args: [
              1e18, // we're just interested in call revert or not, so this value is not important
              data.fromToken.address,
              data.toToken.address,
              expectedOutData,
            ],
          });
          return true;
        } catch (e) {
          return false;
        }
      },
      {
        path: ["expectedOutCalculator"],
        message: expectedOutRevertedMessage,
      }
    );
  };
};
