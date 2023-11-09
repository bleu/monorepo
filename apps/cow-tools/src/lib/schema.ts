import { encodePacked, isAddress } from "viem";
import { z } from "zod";
import { dynamicSlippagePriceCheckerAbi } from "./abis/dynamicSlippagePriceChecker";
import { readContract } from "@wagmi/core";
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
    }
  );

const basicPriceCheckerSchema = z.object({
  priceChecker: z.coerce.string(),
  priceCheckerAddress: basicAddressSchema,
});

const getBasicDynamicSlippageSchema = ({
  tokenSellAddress,
  tokenBuyAddress,
}: {
  tokenSellAddress: Address;
  tokenBuyAddress: Address;
}) => {
  return basicPriceCheckerSchema
    .extend({
      allowedSlippageInBps: z.coerce.number().positive(),
    })
    .refine(
      async (data) => {
        const bigIntAllowedSlippageInBps = BigInt(
          data.allowedSlippageInBps * 100
        );
        try {
          console.log(data);
          console.log(tokenBuyAddress);
          console.log(tokenSellAddress);
          console.log(bigIntAllowedSlippageInBps);
          const priceCheckerData = encodePacked(
            ["uint256", "bytes"],
            [bigIntAllowedSlippageInBps, "0x0"]
          );
          console.log(priceCheckerData);
          await readContract({
            address: data.priceCheckerAddress as Address,
            abi: dynamicSlippagePriceCheckerAbi,
            functionName: "checkPrice",
            args: [
              BigInt(1), // we're just interested in call revert or not, so this value is not important
              tokenSellAddress,
              tokenBuyAddress,
              BigInt(0), // this value isn't used by this price checker
              BigInt(0), // this value will depend on the order, so it's not important here
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
        message:
          "The price checker reverted. Usually, this means that the price checker doesn't support the trade that you are trying to make.",
      }
    );
};

export const getFixedMinOutSchema = ({
  tokenSellAddress,
  tokenBuyAddress,
}: {
  tokenSellAddress: Address;
  tokenBuyAddress: Address;
}) => {
  return basicPriceCheckerSchema
    .extend({
      minOut: z.coerce.number().positive(),
    })
    .refine(
      async (data) => {
        try {
          await readContract({
            address: data.priceCheckerAddress as Address,
            abi: dynamicSlippagePriceCheckerAbi,
            functionName: "checkPrice",
            args: [
              BigInt(1), // we're just interested in call revert or not, so this value is not important
              tokenSellAddress,
              tokenBuyAddress,
              BigInt(0), // this value isn't used by this price checker
              BigInt(0), // this value will depend on the order, so it's not important here
              encodePacked(["uint256"], [BigInt(data.minOut)]),
            ],
          });
          return true;
        } catch (e) {
          return false;
        }
      },
      {
        path: ["priceChecker"],
        message:
          "The price checker reverted. Usually, this means that the price checker doesn't support the trade that you are trying to make.",
      }
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
