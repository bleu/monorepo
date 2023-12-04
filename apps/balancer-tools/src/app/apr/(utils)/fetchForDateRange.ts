/* eslint-disable no-console */

import { db } from "@bleu-fi/balancer-apr/src/db";
import {
  pools,
  poolSnapshots,
  poolTokens,
  swapFeeApr,
  tokens as tokensTable,
  vebalApr,
} from "@bleu-fi/balancer-apr/src/db/schema";
import {
  and,
  asc,
  between,
  desc,
  eq,
  inArray,
  ne,
  sql,
  SQLWrapper,
} from "drizzle-orm";

import { PoolTypeEnum } from "./types";
import { areSupportedNetwork, areSupportedTypes } from "./validate";

interface FetchDataOptions {
  startDate: Date;
  endDate: Date;
  minTvl?: string;
  limit?: string;
  sort?: string;
  order?: "asc" | "desc";
  maxTvl?: string;
  tokens?: string[];
  network?: string;
  types?: string;
}

export async function fetchDataForDateRange({
  startDate,
  endDate,
  minTvl = "10000",
  limit = "10",
  sort = "apr",
  order = "desc",
  maxTvl = "10000000000",
  network,
  tokens,
  types,
}: FetchDataOptions) {
  if (network !== undefined && !areSupportedNetwork(network)) {
    throw new Error("Invalid network");
  }
  const networks = network?.split(",").map((n) => n.toLowerCase().trim());

  if (types !== undefined && !areSupportedTypes(types)) {
    throw new Error("Invalid type");
  }

  const typesArray = types?.split(",").map((t) => t.trim());

  const poolAprForDate = db
    .select({
      poolExternalId: swapFeeApr.poolExternalId,
      avgApr:
        sql<number>`cast(avg(coalesce(${swapFeeApr.value},0) + coalesce(${vebalApr.value},0)) as decimal)`.as(
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
    .leftJoin(pools, eq(pools.externalId, swapFeeApr.poolExternalId))
    .leftJoin(poolTokens, eq(poolTokens.poolExternalId, pools.externalId))
    .leftJoin(tokensTable, eq(tokensTable.address, poolTokens.tokenAddress))
    .where(
      and(
        between(swapFeeApr.timestamp, startDate, endDate),
        between(poolSnapshots.liquidity, minTvl, maxTvl),
        (networks ? inArray(pools.networkSlug, networks) : true) as SQLWrapper,
        (tokens ? inArray(tokensTable.symbol, tokens) : true) as SQLWrapper,
        (typesArray ? inArray(pools.poolType, typesArray) : true) as SQLWrapper,
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
      symbol: tokensTable.symbol,
    })
    .from(poolTokens)
    .leftJoin(tokensTable, eq(tokensTable.address, poolTokens.tokenAddress));

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
      tvl: Number(pool.avgLiquidity),
      tokens: tokensForPool,
      volume: Number(pool.avgVolume),
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
