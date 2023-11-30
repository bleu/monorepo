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
import { and, asc, between, desc, eq, sql } from "drizzle-orm";

import { PoolTypeEnum } from "./types";

interface FetchDataOptions {
  startDate: Date;
  endDate: Date;
  minTvl?: string;
  maxTvl?: string;
  limit?: string;
  sort?: "apr" | "tvl";
  order?: "asc" | "desc";
}

export async function fetchDataForDateRange({
  startDate,
  endDate,
  minTvl = "10000",
  maxTvl = "10000000000",
  limit = "10",
  sort = "apr",
  order = "desc",
}: FetchDataOptions) {
  const sortOrder = order === "desc" ? desc : asc;
  const sortFieldMapping = {
    apr: sql<number>`avg(coalesce(${swapFeeApr.value},0) + coalesce(${vebalApr.value},0))`.as(
      "avgApr",
    ),
    tvl: sql<number>`avg(${poolSnapshots.liquidity})`.as("avgLiquidity"),
  } as const;

  const poolDataQuery = db
    .select({
      poolExternalId: pools.externalId,
      network: pools.networkSlug,
      type: pools.poolType,
      symbol: pools.symbol,
      avgApr: sortFieldMapping.apr,
      avgFeeApr: sql<number>`avg(${swapFeeApr.value})`.as("avgFeeApr"),
      avgVebalApr: sql<number>`avg(${vebalApr.value})`.as("avgVebalApr"),
      avgVolume: sql<number>`avg(${poolSnapshots.swapVolume})`.as("avgVolume"),
      avgLiquidity: sortFieldMapping.tvl,
    })
    .from(pools)
    .fullJoin(swapFeeApr, eq(swapFeeApr.poolExternalId, pools.externalId))
    .fullJoin(vebalApr, eq(vebalApr.poolExternalId, pools.externalId))
    .fullJoin(poolSnapshots, eq(poolSnapshots.poolExternalId, pools.externalId))
    .where(
      and(
        between(swapFeeApr.timestamp, startDate, endDate),
        between(poolSnapshots.liquidity, minTvl, maxTvl),
      ),
    )
    .groupBy(pools.externalId, pools.networkSlug, pools.poolType, pools.symbol)
    .orderBy(sortOrder(sortFieldMapping[sort]))
    .limit(Number(limit));

  const poolsTokensQuery = db
    .select({
      poolExternalId: poolTokens.poolExternalId,
      address: poolTokens.tokenAddress,
      weight: poolTokens.weight,
      symbol: tokens.symbol,
    })
    .from(poolTokens)
    .leftJoin(tokens, eq(tokens.address, poolTokens.tokenAddress));

  const [orderedPoolAprForDate, poolsTokens] = await Promise.all([
    poolDataQuery,
    poolsTokensQuery,
  ]);

  console.log({
    orderedPoolAprForDate,
    poolsTokens,
  });

  const returnData = orderedPoolAprForDate.map((pool) => {
    const tokensForPool = poolsTokens
      .filter((token) => token.poolExternalId === pool.poolExternalId)
      .map((token) => ({
        address: token.address,
        symbol: token.symbol,
        weight: Number(token.weight),
      }));

    return {
      ...pool,
      tokens: tokensForPool,
      type: pool.type as PoolTypeEnum,
    };
  });

  return { poolAverage: returnData };
}
