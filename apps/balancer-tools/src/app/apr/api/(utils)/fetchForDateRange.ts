/* eslint-disable no-console */

import { and, between, eq, sql } from "drizzle-orm";

import { db } from "@bleu-fi/balancer-apr/src/db";
import {
  pools,
  poolSnapshots,
  poolTokens,
  swapFeeApr,
  tokens,
  vebalApr,
} from "@bleu-fi/balancer-apr/src/db/schema";

export async function fetchDataForDateRange(
  startDate: Date,
  endDate: Date,
  maxTvl: number = 10_000_000_000,
  minTvl: number = 10_000,
) {
  const poolAprForDate = await db
    .select({
      poolExternalId: swapFeeApr.poolExternalId,
      avgApr: sql<number>`cast(avg(${swapFeeApr.value} + ${vebalApr.value}) as decimal)`,
      avgFeeApr: sql<number>`cast(avg(${swapFeeApr.value}) as decimal)`,
      avgVebalApr: sql<number>`cast(avg(${vebalApr.value}) as decimal)`,
      avgVolume: sql<number>`cast(avg(${poolSnapshots.swapVolume}) as decimal)`,
      avgLiquidity: sql<number>`cast(avg(${poolSnapshots.liquidity}) as decimal)`,
    })
    .from(swapFeeApr)
    .fullJoin(
      poolSnapshots,
      and(
        eq(poolSnapshots.poolExternalId, swapFeeApr.poolExternalId),
        eq(poolSnapshots.timestamp, swapFeeApr.timestamp),
      ),
    )
    .fullJoin(
      vebalApr,
      and(
        eq(vebalApr.poolExternalId, swapFeeApr.poolExternalId),
        eq(vebalApr.timestamp, swapFeeApr.timestamp),
      ),
    )
    .where(
      and(
        between(swapFeeApr.timestamp, startDate, endDate),
        between(poolSnapshots.liquidity, String(minTvl), String(maxTvl)),
      ),
    )
    .groupBy(swapFeeApr.poolExternalId);

  const poolData = await db
    .select({
      poolExternalId: pools.externalId,
      netwok: pools.networkSlug,
      type: pools.poolType,
      symbol: pools.symbol,
    })
    .from(pools)
    .fullJoin(swapFeeApr, and(eq(swapFeeApr.poolExternalId, pools.externalId)))
    .where(and(between(swapFeeApr.timestamp, startDate, endDate)));

  const poolsTokens = await db
    .select({
      poolExternalId: poolTokens.poolExternalId,
      address: poolTokens.tokenAddress,
      weight: poolTokens.weight,
      symbol: tokens.symbol,
    })
    .from(poolTokens)
    .leftJoin(tokens, eq(tokens.address, poolTokens.tokenAddress));

  const returnData = poolAprForDate.map((pool) => {
    const tokensForPool = poolsTokens
      .filter((poolToken) => poolToken.poolExternalId === pool.poolExternalId)
      .map((poolToken) => ({
        address: poolToken.address,
        symbol: poolToken.symbol,
        weight: Number(poolToken.weight),
      }));

    return {
      poolId: pool.poolExternalId,
      apr: {
        total: Number(pool.avgApr),
        breakdown: {
          veBAL: Number(pool.avgVebalApr),
          swapFee: Number(pool.avgFeeApr),
        },
        tokens: {
          total: 0,
          breakdown: [],
        },
        rewards: {
          total: 0,
          breakdown: [],
        },
      },
      balPriceUSD: 0,
      tvl: Number(pool.avgLiquidity),
      tokens: tokensForPool,
      volume: Number(pool.avgVolume),
      votingShare: 0,
      symbol:
        poolData.find((p) => p.poolExternalId === pool.poolExternalId)
          ?.symbol || "",
      network:
        poolData.find((p) => p.poolExternalId === pool.poolExternalId)
          ?.netwok || "",
      type:
        poolData.find((p) => p.poolExternalId === pool.poolExternalId)?.type ||
        "",
    };
  });

  return {
    average: {
      poolAverage: returnData,
    },
  };
}
