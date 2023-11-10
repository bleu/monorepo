import { PublicClient, encodePacked, isAddress, keccak256 } from "viem";
import { z } from "zod";
import { dynamicSlippagePriceCheckerAbi } from "./abis/dynamicSlippagePriceChecker";
import { Address } from "@bleu-fi/utils";

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

const dummyBytes = ("0x" + "0".repeat(128)) as Address;

const priceCheckerRevertedMessage =
  "The price checker reverted. Please select another one.";

export const orderOverviewSchema = z
  .object({
    tokenSell: baseTokenAddress,
    tokenSellAmount: z.coerce.number().positive(),
    tokenBuy: baseTokenAddress,
    receiverAddress: basicAddressSchema,
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

const getBasicDynamicSlippageSchema = ({
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
              encodePacked(
                ["uint256", "bytes"],
                [bigIntAllowedSlippageInBps, dummyBytes],
              ),
            ],
          });
          return true;
        } catch (e) {
          console.log(e);
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
              BigInt(1), // we're just interested in call revert or not, so this value is not important
              tokenSellAddress,
              tokenBuyAddress,
              BigInt(0), // this value isn't used by this price checker
              BigInt(0), // this value will depend on the order, so it's not important here
              encodePacked(
                ["uint256", "bytes"],
                [BigInt(data.minOut), dummyBytes],
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

export const getUniV2Schema = getBasicDynamicSlippageSchema;
export const getSushiSwapSchema = getBasicDynamicSlippageSchema;

export const basicDynamicSlippageSchema = basicPriceCheckerSchema.extend({
  allowedSlippageInBps: z.coerce.number().positive(),
});

export const fixedMinOutSchema = basicPriceCheckerSchema.extend({
  minOut: z.coerce.number().positive(),
});

export const uniV2Schema = basicDynamicSlippageSchema;
export const sushiSwapSchema = basicDynamicSlippageSchema;
