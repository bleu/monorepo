/* eslint-disable no-console */

import { db } from "@bleu-fi/balancer-apr/src/db";
import {
  pools,
  poolSnapshots,
  poolTokens,
  swapFeeApr,
  tokens as tokensTable,
  vebalApr,
  yieldTokenApr,
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
      poolExternalId: poolSnapshots.poolExternalId,
      network: pools.networkSlug,
      type: pools.poolType,
      symbol: pools.symbol,
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
    .from(poolSnapshots)
    .fullJoin(
      swapFeeApr,
      and(
        eq(poolSnapshots.poolExternalId, swapFeeApr.poolExternalId),
        eq(poolSnapshots.timestamp, swapFeeApr.timestamp),
      ),
    )
    .fullJoin(
      vebalApr,
      and(
        eq(vebalApr.poolExternalId, poolSnapshots.poolExternalId),
        eq(vebalApr.timestamp, poolSnapshots.timestamp),
      ),
    )
    .fullJoin(
      yieldAprSum,
      and(
        eq(yieldAprSum.poolExternalId, poolSnapshots.poolExternalId),
        eq(yieldAprSum.timestamp, poolSnapshots.timestamp),
      ),
    )
    .leftJoin(pools, eq(pools.externalId, poolSnapshots.poolExternalId))
    .leftJoin(poolTokens, eq(poolTokens.poolExternalId, pools.externalId))
    .leftJoin(tokensTable, eq(tokensTable.address, poolTokens.tokenAddress))
    .where(
      and(
        between(poolSnapshots.timestamp, startDate, endDate),
        between(poolSnapshots.liquidity, minTvl, maxTvl),
        (networks ? inArray(pools.networkSlug, networks) : true) as SQLWrapper,
        (tokens ? inArray(tokensTable.symbol, tokens) : true) as SQLWrapper,
        (typesArray ? inArray(pools.poolType, typesArray) : true) as SQLWrapper,
      ),
    )
    .groupBy(
      poolSnapshots.poolExternalId,
      pools.networkSlug,
      pools.symbol,
      pools.poolType,
    )
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

  const poolsTokens = await db
    .select({
      poolExternalId: poolTokens.poolExternalId,
      address: poolTokens.tokenAddress,
      weight: poolTokens.weight,
      symbol: tokensTable.symbol,
    })
    .from(poolTokens)
    .leftJoin(tokensTable, eq(tokensTable.address, poolTokens.tokenAddress))
    .where(
      inArray(
        poolTokens.poolExternalId,
        orderedPoolAprForDate.map((p) => p.poolExternalId as string),
      ),
    );

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
          rewards: 0,
        },
      },
      tvl: Number(pool.avgLiquidity),
      tokens: tokensForPool,
      volume: Number(pool.avgVolume),
      symbol: pool.symbol || "",
      network: pool.network || "",
      type: pool.type as PoolTypeEnum,
    };
  });

  return {
    poolAverage: returnData,
  };
}
