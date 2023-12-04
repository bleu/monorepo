/* eslint-disable no-console */

import { db } from "@bleu-fi/balancer-apr/src/db";
import {
  pools,
  poolSnapshots,
  poolTokens,
  swapFeeApr,
  tokens,
  vebalApr,
  yieldTokenApr,
} from "@bleu-fi/balancer-apr/src/db/schema";
import { and, asc, between, desc, eq, ne, sql } from "drizzle-orm";

import { PoolTypeEnum } from "./types";

interface FetchDataOptions {
  startDate: Date;
  endDate: Date;
  minTvl?: string;
  limit?: string;
  sort?: string;
  order?: "asc" | "desc";
  maxTvl?: string;
  filteredTokens?: string[];
}

export async function fetchDataForDateRange({
  startDate,
  endDate,
  minTvl = "10000",
  limit = "10",
  sort = "apr",
  order = "desc",
  maxTvl = "10000000000",
}: FetchDataOptions) {
  const yieldAprSum = db
    .select({
      poolExternalId: yieldTokenApr.poolExternalId,
      timestamp: yieldTokenApr.timestamp,
      valueSum: sql<number>`sum(${yieldTokenApr.value})`.as("valueSum"),
    })
    .from(yieldTokenApr)
    .groupBy(yieldTokenApr.poolExternalId, yieldTokenApr.timestamp)
    .as("yieldTokenAprSum");

  const poolAprForDate = db
    .select({
      poolExternalId: swapFeeApr.poolExternalId,
      avgApr:
        sql<number>`cast(sum(coalesce(${swapFeeApr.value},0) + coalesce(${vebalApr.value},0) + coalesce(${yieldAprSum.valueSum},0)) / count(${poolSnapshots.timestamp}) as decimal)`.as(
          "avgApr",
        ),
      avgFeeApr:
        sql<number>`cast(sum(${swapFeeApr.value}) /  count(${poolSnapshots.timestamp})  as decimal)`.as(
          "avgFeeApr",
        ),
      avgVebalApr:
        sql<number>`cast(sum(${vebalApr.value}) /  count(${poolSnapshots.timestamp})  as decimal)`.as(
          "avgVebalApr",
        ),
      avgVolume:
        sql<number>`cast(sum(${poolSnapshots.swapVolume}) /  count(${poolSnapshots.timestamp})  as decimal)`.as(
          "avgVolume",
        ),
      avgLiquidity:
        sql<number>`cast(sum(${poolSnapshots.liquidity}) /  count(${poolSnapshots.timestamp})  as decimal)`.as(
          "avgLiquidity",
        ),
      avgYieldTokenApr:
        sql<number>`cast(sum(coalesce(${yieldAprSum.valueSum},0)) /  count(${poolSnapshots.timestamp}) as decimal)`.as(
          "avgYieldTokenApr",
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
    .fullJoin(
      yieldAprSum,
      and(
        eq(yieldAprSum.poolExternalId, swapFeeApr.poolExternalId),
        eq(yieldAprSum.timestamp, swapFeeApr.timestamp),
      ),
    )
    .leftJoin(pools, eq(pools.externalId, swapFeeApr.poolExternalId))
    .where(
      and(
        between(swapFeeApr.timestamp, startDate, endDate),
        between(poolSnapshots.liquidity, minTvl, maxTvl),
      ),
    )
    .groupBy(swapFeeApr.poolExternalId)
    .as("poolAprForDate");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sortFieldMapping: Record<string, any> = {
    apr: poolAprForDate.avgApr,
    tvl: poolAprForDate.avgLiquidity,
  };
  const sortField = sortFieldMapping[sort];

  const orderBy = order === "desc" ? desc(sortField) : asc(sortField);

  const orderedPoolAprForDate = await db
    .select()
    .from(poolAprForDate)
    .orderBy(orderBy)
    .where(ne(poolAprForDate.avgApr, 0))
    .limit(Number(limit));

  const poolData = await db
    .select({
      poolExternalId: pools.externalId,
      network: pools.networkSlug,
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
          tokens: Number(pool.avgYieldTokenApr),
          rewards: {
            total: 0,
          },
        },
      },
      tvl: Number(pool.avgLiquidity),
      tokens: tokensForPool,
      volume: Number(pool.avgVolume),
      votingShare: 0,
      symbol:
        poolData.find((p) => p.poolExternalId === pool.poolExternalId)
          ?.symbol || "",
      network:
        poolData.find((p) => p.poolExternalId === pool.poolExternalId)
          ?.network || "",
      type: poolData.find((p) => p.poolExternalId === pool.poolExternalId)
        ?.type as PoolTypeEnum,
    };
  });

  return {
    poolAverage: returnData,
  };
}
