import { capitalize } from "@bleu/utils";
import { Address, encodeAbiParameters, formatUnits, isAddress } from "viem";
import { z } from "zod";

import { PRICE_ORACLES } from "#/lib/types";
import { ChainId, publicClientsFromIds } from "#/utils/chainsPublicClients";

import { ConstantProductFactoryABI } from "./abis/ConstantProductFactory";
import { erc20ABI } from "./abis/erc20";
import { minimalPriceOracleAbi } from "./abis/minimalPriceOracle";
import { COW_CONSTANT_PRODUCT_FACTORY } from "./contracts";
import { getPriceOracleAddress } from "./encodePriceOracleData";
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

export const balancerPriceOracleSchema = z
  .object({
    chainId: z.number().int(),
    priceOracle: z.literal(PRICE_ORACLES.BALANCER),
    poolId: bytes32Schema,
  })
  .transform((data) => {
    return {
      priceOracleAddress: getPriceOracleAddress({
        chainId: data.chainId as ChainId,
        priceOracle: PRICE_ORACLES.BALANCER,
      }),
      priceOracleData: encodeAbiParameters(
        [{ name: "poolId", type: "bytes32" }],
        [data.poolId as `0x${string}`]
      ),
    };
  });

export const uniswapV2PriceOracleSchema = z
  .object({
    chainId: z.number().int(),
    priceOracle: z.literal(PRICE_ORACLES.UNI),
    pairAddress: basicAddressSchema,
  })
  .transform((data) => {
    return {
      priceOracleAddress: getPriceOracleAddress({
        chainId: data.chainId as ChainId,
        priceOracle: PRICE_ORACLES.UNI,
      }),
      priceOracleData: encodeAbiParameters(
        [{ name: "pairAddress", type: "address" }],
        [data.pairAddress as Address]
      ),
    };
  });

export const sushiV2PriceOracleSchema = z
  .object({
    chainId: z.number().int(),
    priceOracle: z.literal(PRICE_ORACLES.SUSHI),
    pairAddress: basicAddressSchema,
  })
  .transform((data) => {
    return {
      priceOracleAddress: getPriceOracleAddress({
        chainId: data.chainId as ChainId,
        priceOracle: PRICE_ORACLES.SUSHI,
      }),
      priceOracleData: encodeAbiParameters(
        [{ name: "pairAddress", type: "address" }],
        [data.pairAddress as Address]
      ),
    };
  });

export const chainlinkPriceOracleSchema = z
  .object({
    chainId: z.number().int(),
    priceOracle: z.literal(PRICE_ORACLES.CHAINLINK),
    feed0: basicAddressSchema,
    feed1: basicAddressSchema,
    timeThresholdInHours: z.number().int().positive(),
  })
  .transform((data) => {
    return {
      priceOracleAddress: getPriceOracleAddress({
        chainId: data.chainId as ChainId,
        priceOracle: PRICE_ORACLES.CHAINLINK,
      }),
      priceOracleData: encodeAbiParameters(
        [
          { name: "feed0", type: "address" },
          { name: "feed1", type: "address" },
          { name: "timeThresholdInHours", type: "uint256" },
          { name: "backoff", type: "uint256" },
        ],
        [
          data.feed0 as Address,
          data.feed1 as Address,
          BigInt((data.timeThresholdInHours * 3600).toFixed()),
          BigInt(1),
        ]
      ),
    };
  });

export const customPriceOracleSchema = z
  .object({
    chainId: z.number().int(),
    priceOracle: z.literal(PRICE_ORACLES.CUSTOM),
    address: basicAddressSchema,
    data: bytesSchema,
  })
  .transform((data) => {
    return {
      priceOracleAddress: data.address,
      priceOracleData: data.data,
    };
  });

export const priceOracleSchema = z.union([
  balancerPriceOracleSchema,
  uniswapV2PriceOracleSchema,
  sushiV2PriceOracleSchema,
  chainlinkPriceOracleSchema,
  customPriceOracleSchema,
]);
export const ammFormSchema = z
  .object({
    token0: baseTokenSchema,
    token1: baseTokenSchema,
    minTradedToken0: z.coerce.number().positive(),
    safeAddress: basicAddressSchema,
    amount0: z.coerce.number().positive(),
    amount1: z.coerce.number().positive(),
    priceOracleSchema: priceOracleSchema,
    chainId: z.number().int(),
  })
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
    }
  )
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
      })
    );
    return !path.length;
  })
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
  .superRefine(async (data, ctx) => {
    // validate if price oracle is working
    try {
      const publicClient = publicClientsFromIds[data.chainId as ChainId];
      await publicClient.readContract({
        abi: minimalPriceOracleAbi,
        address: data.priceOracleSchema.priceOracleAddress as Address,
        functionName: "getPrice",
        args: [
          data.token0.address as Address,
          data.token1.address as Address,
          data.priceOracleSchema.priceOracleData as `0x${string}`,
        ],
      });
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Price oracle error`,
        path: ["priceOracleSchema.priceOracle"],
      });
    }
  })
  .superRefine(async (data, ctx) => {
    // validate if cow amm doesn't exist
    try {
      const publicClient = publicClientsFromIds[data.chainId as ChainId];
      const cowAmmAddress = await publicClient.readContract({
        abi: ConstantProductFactoryABI,
        address: COW_CONSTANT_PRODUCT_FACTORY[data.chainId as ChainId],
        functionName: "ammDeterministicAddress",
        args: [
          data.safeAddress as Address,
          data.token0.address as Address,
          data.token1.address as Address,
        ],
      });
      const contractByteCode = await publicClient.getBytecode({
        address: cowAmmAddress,
      });
      if (contractByteCode) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Cow AMM already exists`,
          path: ["token0"],
        });
      }
    } catch {
      // eslint-disable-next-line no-console
      console.error("Error while checking if Cow AMM exists");
    }
  });

export const ammEditSchema = z
  .object({
    token0: baseTokenSchema,
    token1: baseTokenSchema,
    minTradedToken0: z.coerce.number().positive(),
    safeAddress: basicAddressSchema,
    priceOracleSchema: priceOracleSchema,
    chainId: z.number().int(),
  })
  .superRefine(async (data, ctx) => {
    // validate if price oracle is working
    try {
      const publicClient = publicClientsFromIds[data.chainId as ChainId];
      await publicClient.readContract({
        abi: minimalPriceOracleAbi,
        address: data.priceOracleSchema.priceOracleAddress as Address,
        functionName: "getPrice",
        args: [
          data.token0.address as Address,
          data.token1.address as Address,
          data.priceOracleSchema.priceOracleData as Address,
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

export const ammWithdrawSchema = z.object({
  withdrawPct: z.coerce.number().positive().lte(100),
});

export const getDepositSchema = (
  walletAmount0: number,
  walletAmount1: number
) =>
  z
    .object({
      amount0: z.coerce
        .number()
        .nonnegative()
        .lte(walletAmount0, "Insufficient balance"),
      amount1: z.coerce
        .number()
        .nonnegative()
        .lte(walletAmount1, "Insufficient balance"),
    })
    .refine(
      (data) => {
        const bothAmountsAreZero = data.amount0 === 0 && data.amount1 === 0;
        return !bothAmountsAreZero;
      },
      {
        message: "At least one of the amounts must be greater than 0",
        path: ["bothAmountsAreZero"],
      }
    );
