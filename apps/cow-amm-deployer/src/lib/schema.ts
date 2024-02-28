import { capitalize } from "@bleu-fi/utils";
import { erc20ABI } from "@wagmi/core";
import { Address, isAddress } from "viem";
import { z } from "zod";

import { FALLBACK_STATES, PRICE_ORACLES } from "#/lib/types";
import { ChainId, publicClientsFromIds } from "#/utils/chainsPublicClients";

import { minimalPriceOracleAbi } from "./abis/minimalPriceOracle";
import {
  encodePriceOracleData,
  PRICE_ORACLES_ADDRESSES,
} from "./encodePriceOracleData";
import { fetchCowQuote } from "./orderBookApi/fetchCowQuote";

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
    balancerPoolId: z.string().optional(),
    uniswapV2Pair: z.string().optional(),
    chainId: z.number().int(),
  })
  .refine(
    // validate if balancer pool id is required
    (data) => {
      if (data.priceOracle === PRICE_ORACLES.BALANCER) {
        return !!data.balancerPoolId;
      }
      return true;
    },
    {
      message: "Balancer Pool Id is required",
      path: ["balancerPoolId"],
    },
  )
  .refine(
    // validate if uniswap v2 pool address is required
    (data) => {
      if (data.priceOracle === PRICE_ORACLES.UNI) {
        return !!data.uniswapV2Pair;
      }
      return true;
    },
    {
      message: "Uniswap V2 Pool Address is required",
      path: ["uniswapV2Pair"],
    },
  )
  .refine(
    // validate if tokens are different
    (data) => {
      if (data.token0.address === data.token1.address) {
        return false;
      }
      return true;
    },
    {
      message: "Tokens must be different",
      path: ["token0"],
    },
  )
  .superRefine(async (data, ctx) => {
    // validate if there are balances of tokens
    const publicClient = publicClientsFromIds[data.chainId as ChainId];
    const zeroToken0 = await publicClient
      .readContract({
        abi: erc20ABI,
        address: data.token0.address as Address,
        functionName: "balanceOf",
        args: [data.safeAddress as Address],
      })
      .then((res) => !res);
    const zeroToken1 = await publicClient
      .readContract({
        abi: erc20ABI,
        address: data.token1.address as Address,
        functionName: "balanceOf",
        args: [data.safeAddress as Address],
      })
      .then((res) => !res);

    const path = [
      { id: 0, isZero: zeroToken0 },
      { id: 1, isZero: zeroToken1 },
    ]
      .filter((x) => x.isZero)
      .map((x) => "token" + x.id);
    path.forEach((x) =>
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `No balance of token`,
        path: [x],
      }),
    );
    return !path.length;
  })
  .superRefine((data, ctx) => {
    // validate if route exists
    return fetchCowQuote({
      tokenIn: data.token0,
      tokenOut: data.token1,
      amountIn: 1e18, // hardcoded value since we're just checking if the route exists or not
      chainId: data.chainId as ChainId,
      priceQuality: "fast",
    }).then((res) => {
      if (res.errorType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: capitalize(res.description),
          path: ["token0"],
        });
      }
    });
  })
  .superRefine(async (data, ctx) => {
    // validate if price oracle is working
    try {
      const priceOracleData = encodePriceOracleData({
        priceOracle: data.priceOracle,
        balancerPoolId: data.balancerPoolId as `0x${string}`,
        uniswapV2Pair: data.uniswapV2Pair as Address,
      });
      const priceOracleAddress = PRICE_ORACLES_ADDRESSES[data.priceOracle];
      const publicClient = publicClientsFromIds[data.chainId as ChainId];
      await publicClient.readContract({
        abi: minimalPriceOracleAbi,
        address: priceOracleAddress,
        functionName: "getPrice",
        args: [
          data.token0.address as Address,
          data.token1.address as Address,
          priceOracleData,
        ],
      });
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Price oracle error`,
        path: ["priceOracle"],
      });
    }
  });
