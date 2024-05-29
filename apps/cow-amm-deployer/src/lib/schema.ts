import { capitalize } from "@bleu/utils";
import { Address, formatUnits, isAddress } from "viem";
import { z } from "zod";

import { PRICE_ORACLES } from "#/lib/types";
import { ChainId, publicClientsFromIds } from "#/utils/chainsPublicClients";

import { erc20ABI } from "./abis/erc20";
import { minimalPriceOracleAbi } from "./abis/minimalPriceOracle";
import {
  encodePriceOracleData,
  getPriceOracleAddress,
  IEncodePriceOracleData,
  IGetPriceOracleAddress,
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

const bytesSchema = z.string().refine((value) => value.startsWith("0x"));

export const ammFormSchema = z
  .object({
    token0: baseTokenSchema,
    token1: baseTokenSchema,
    minTradedToken0: z.coerce.number().positive(),
    priceOracle: z.nativeEnum(PRICE_ORACLES),
    safeAddress: basicAddressSchema,
    amount0: z.coerce.number().positive(),
    amount1: z.coerce.number().positive(),
    balancerPoolId: bytes32Schema.optional(),
    uniswapV2Pair: basicAddressSchema.optional(),
    sushiV2Pair: basicAddressSchema.optional(),
    chainlinkPriceFeed0: basicAddressSchema.optional(),
    chainlinkPriceFeed1: basicAddressSchema.optional(),
    chainlinkTimeThresholdInHours: z.coerce
      .number()
      .int()
      .positive()
      .optional(),
    chainId: z.number().int(),
    customPriceOracleAddress: basicAddressSchema.optional(),
    customPriceOracleData: bytesSchema.optional(),
  })
  .refine(
    // validate if balancer Pool ID is required
    (data) => {
      if (data.priceOracle === PRICE_ORACLES.BALANCER) {
        return !!data.balancerPoolId;
      }
      return true;
    },
    {
      message: "Balancer Pool ID is required",
      path: ["balancerPoolId"],
    },
  )
  .refine(
    // validate if uniswap v2 pool address is required
    // @ts-ignore
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
    // validate if sushi v2 pool address is required
    // @ts-ignore
    (data) => {
      if (data.priceOracle === PRICE_ORACLES.SUSHI) {
        return !!data.sushiV2Pair;
      }
      return true;
    },
    {
      message: "Sushi V2 Pool Address is required",
      path: ["sushiV2Pair"],
    },
  )
  .refine(
    // validate if custom price oracle data is required
    // @ts-ignore
    (data) => {
      if (data.priceOracle === PRICE_ORACLES.CUSTOM) {
        return !!data.customPriceOracleData;
      }
      return true;
    },
    {
      message: "Custom price oracle data is required",
      path: ["customPriceOracleData"],
    },
  )
  .refine(
    // validate if chainlink oracle data is required
    // @ts-ignore
    (data) => {
      if (data.priceOracle === PRICE_ORACLES.CHAINLINK) {
        return (
          !!data.chainlinkPriceFeed0 &&
          !!data.chainlinkPriceFeed1 &&
          !!data.chainlinkTimeThresholdInHours
        );
      }
      return true;
    },
    {
      message: "Chainlink price feed addresses are required",
      path: ["chainlinkPriceFeed0", "chainlinkPriceFeed1"],
    },
  )
  .refine(
    // validate if tokens are different
    // @ts-ignore
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
  // @ts-ignore
  .superRefine(async (data, ctx) => {
    // validate if there are balances of tokens
    const publicClient = publicClientsFromIds[data.chainId as ChainId];
    const [token0Amount, token1Amount] = await Promise.all([
      publicClient
        .readContract({
          abi: erc20ABI,
          address: data.token0.address as Address,
          functionName: "balanceOf",
          args: [data.safeAddress as Address],
        })
        .then((res) => Number(formatUnits(res, data.token0.decimals))),
      publicClient
        .readContract({
          abi: erc20ABI,
          address: data.token1.address as Address,
          functionName: "balanceOf",
          args: [data.safeAddress as Address],
        })
        .then((res) => Number(formatUnits(res, data.token0.decimals))),
    ]);

    const path = [
      { id: 0, notEnoughAmount: token0Amount < data.amount0 },
      { id: 1, notEnoughAmount: token1Amount < data.amount1 },
    ]
      .filter((x) => x.notEnoughAmount)
      .map((x) => "amount" + x.id);
    path.forEach((x) =>
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Insufficient balance`,
        path: [x],
      }),
    );
    return !path.length;
  })
  // @ts-ignore
  .superRefine((data, ctx) => {
    // hardcoded value since we're just checking if the route exists or not
    // we're using 100 times the minTradedToken0 to cover high gas price (mainly for mainnet)
    const amountIn = data.minTradedToken0 * 100;
    return fetchCowQuote({
      tokenIn: data.token0,
      tokenOut: data.token1,
      amountIn,
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
  // @ts-ignore
  .superRefine(async (data, ctx) => {
    // validate if price oracle is working
    try {
      const priceOracleData = encodePriceOracleData(
        data as IEncodePriceOracleData,
      );
      const priceOracleAddress = getPriceOracleAddress(
        data as IGetPriceOracleAddress,
      );
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
