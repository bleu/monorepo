/* eslint-disable no-console */

import { db } from "@bleu-fi/balancer-apr/src/db";
import {
  pools,
  poolSnapshots,
  poolTokens,
  swapFeeApr,
  tokens,
  vebalApr,
} from "@bleu-fi/balancer-apr/src/db/schema";
import { and, asc, between, desc, eq, ne, sql } from "drizzle-orm";

import { PoolTypeEnum } from "../../(utils)/types";

interface FetchDataOptions {
  startDate: Date;
  endDate: Date;
  minTvl?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
  maxTvl?: number;
}

export async function fetchDataForDateRange({
  startDate,
  endDate,
  minTvl = 10_000,
  limit = 10,
  sortBy = "apr",
  order = "desc",
  maxTvl = 10_000_000_000,
}: FetchDataOptions) {
  const poolAprForDate = db
    .select({
      poolExternalId: swapFeeApr.poolExternalId,
      avgApr:
        sql<number>`cast(avg(${swapFeeApr.value} + ${vebalApr.value}) as decimal)`.as(
          "avgApr",
        ),
      avgFeeApr: sql<number>`cast(avg(${swapFeeApr.value}) as decimal)`.as(
        "avgFeeApr",
      ),
      avgVebalApr: sql<number>`cast(avg(${vebalApr.value}) as decimal)`.as(
        "avgVebalApr",
      ),
      avgVolume:
        sql<number>`cast(avg(${poolSnapshots.swapVolume}) as decimal)`.as(
          "avgVolume",
        ),
      avgLiquidity:
        sql<number>`cast(avg(${poolSnapshots.liquidity}) as decimal)`.as(
          "avgLiquidity",
        ),
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
    .groupBy(swapFeeApr.poolExternalId)
    .as("poolAprForDate");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sortFieldMapping: Record<string, any> = {
    apr: poolAprForDate.avgApr,
  };
  const sortField = sortFieldMapping[sortBy];

  const orderBy = order === "desc" ? desc(sortField) : asc(sortField);

  const orderedPoolAprForDate = await db
    .select()
    .from(poolAprForDate)
    .orderBy(orderBy)
    .where(ne(poolAprForDate.avgApr, 0))
    .limit(limit);

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

  const returnData = orderedPoolAprForDate.map((pool) => {
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
          tokens: {
            total: 0,
            breakdown: [],
          },
          rewards: {
            total: 0,
            breakdown: [],
          },
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
      type: poolData.find((p) => p.poolExternalId === pool.poolExternalId)
        ?.type as PoolTypeEnum,
    };
  });

  return {
    poolAverage: returnData,
  };
}
