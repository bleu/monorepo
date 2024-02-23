import { isAddress } from "viem";
import { z } from "zod";

import { FALLBACK_STATES, PRICE_ORACLES } from "#/lib/types";

const basicAddressSchema = z
  .string()
  .min(1)
  .refine((value) => isAddress(value), {
    message: "Provided address is invalid",
  });

const baseTokenSchema = z.object({
  address: basicAddressSchema,
  decimals: z.number().positive(),
  symbol: z.string(),
});

const bytes32Schema = z
  .string()
  .length(66)
  .refine((value) => value.startsWith("0x"));

export const createAmmSchema = z
  .object({
    token0: baseTokenSchema,
    token1: baseTokenSchema,
    minTradedToken0: z.coerce.number().positive(),
    priceOracle: z.nativeEnum(PRICE_ORACLES),
    fallbackSetupState: z.nativeEnum(FALLBACK_STATES),
    safeAddress: basicAddressSchema,
    domainSeparator: bytes32Schema,
    balancerPoolId: bytes32Schema.optional(),
    uniswapV2Pair: basicAddressSchema.optional(),
  })
  .refine(
    (data) => {
      if (data.priceOracle === PRICE_ORACLES.BALANCER) {
        return !!data.balancerPoolId;
      }
      return true;
    },
    {
      message: "Balancer Pool Id is required",
      path: ["balancerPoolId"],
    }
  )
  .refine(
    (data) => {
      if (data.priceOracle === PRICE_ORACLES.UNI) {
        return !!data.uniswapV2Pair;
      }
      return true;
    },
    {
      message: "Uniswap V2 Pool Address is required",
      path: ["uniswapV2Pair"],
    }
  )
  .refine(
    (data) => {
      if (data.token0.address === data.token1.address) {
        return false;
      }
      return true;
    },
    {
      message: "Tokens must be different",
      path: ["token0"],
    }
  );
