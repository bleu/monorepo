/* eslint-disable no-console */

import { db } from "@bleu/balancer-apr/src/db";
import {
  pools,
  poolSnapshots,
  poolTokens,
  rewardsTokenApr,
  swapFeeApr,
  tokens as tokensTable,
  vebalApr,
  yieldTokenApr,
} from "@bleu/balancer-apr/src/db/schema";
import {
  and,
  asc,
  between,
  desc,
  eq,
  gt,
  inArray,
  sql,
  SQLWrapper,
  sum,
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
      yieldValueSum: sum(yieldTokenApr.value).as("yieldValueSum"),
    })
    .from(yieldTokenApr)
    .where(between(yieldTokenApr.timestamp, startDate, endDate))
    .groupBy(yieldTokenApr.poolExternalId, yieldTokenApr.timestamp)
    .as("yieldAprSum");

  const rewardAprSum = db
    .select({
      poolExternalId: rewardsTokenApr.poolExternalId,
      timestamp: rewardsTokenApr.timestamp,
      rewardValueSum: sql<number>`sum(${rewardsTokenApr.value})`.as(
        "rewardValueSum",
      ),
    })
    .from(rewardsTokenApr)
    .where(between(rewardsTokenApr.timestamp, startDate, endDate))
    .groupBy(rewardsTokenApr.poolExternalId, rewardsTokenApr.timestamp)
    .as("rewardAprSum");

  const avgApr = sql<number>`cast(sum(coalesce(${swapFeeApr.value},0) + coalesce(${vebalApr.value},0) + coalesce(${yieldAprSum.yieldValueSum},0)+ coalesce(${rewardAprSum.rewardValueSum},0)) / count(${poolSnapshots.id}) as decimal)`;
  const avgLiquidity = sql<number>`cast(sum(${poolSnapshots.liquidity}) /  count(${poolSnapshots.id})  as decimal)`;

  const sortFieldMapping: Record<string, SQLWrapper> = {
    apr: avgApr,
    tvl: avgLiquidity,
  };

  const orderBy =
    order === "desc"
      ? desc(sortFieldMapping[sort])
      : asc(sortFieldMapping[sort]);

  const orderedPoolAprForDate = await db
    .select({
      poolExternalId: poolSnapshots.poolExternalId,
      network: pools.networkSlug,
      type: pools.poolType,
      symbol: pools.symbol,
      avgApr: avgApr.as("avgApr"),
      avgFeeApr:
        sql<number>`cast(sum(${swapFeeApr.value}) /  count(${poolSnapshots.id})  as decimal)`.as(
          "avgFeeApr",
        ),
      avgVebalApr:
        sql<number>`cast(sum(${vebalApr.value}) /  count(${poolSnapshots.id})  as decimal)`.as(
          "avgVebalApr",
        ),
      avgVolume:
        sql<number>`cast(sum(${poolSnapshots.swapVolume}) /  count(${poolSnapshots.id})  as decimal)`.as(
          "avgVolume",
        ),
      avgLiquidity: avgLiquidity.as("avgLiquidity"),
      avgYieldTokenApr:
        sql<number>`cast(sum(coalesce(${yieldAprSum.yieldValueSum},0)) /  count(${poolSnapshots.id}) as decimal)`.as(
          "avgYieldTokenApr",
        ),
      avgRewardTokenApr:
        sql<number>`cast(sum(coalesce(${rewardAprSum.rewardValueSum},0)) /  count(${poolSnapshots.id}) as decimal)`.as(
          "avgRewardTokenApr",
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
    .fullJoin(
      rewardAprSum,
      and(
        eq(rewardAprSum.poolExternalId, poolSnapshots.poolExternalId),
        eq(rewardAprSum.timestamp, poolSnapshots.timestamp),
      ),
    )
    .innerJoin(pools, eq(pools.externalId, poolSnapshots.poolExternalId))
    .innerJoin(
      poolTokens,
      eq(poolTokens.poolExternalId, poolSnapshots.poolExternalId),
    )
    .innerJoin(tokensTable, eq(tokensTable.address, poolTokens.tokenAddress))
    .where(
      and(
        between(poolSnapshots.timestamp, startDate, endDate),
        between(poolSnapshots.liquidity, minTvl, maxTvl),
        (networks?.length
          ? inArray(pools.networkSlug, networks)
          : true) as SQLWrapper,
        (tokens?.length
          ? inArray(tokensTable.symbol, tokens)
          : true) as SQLWrapper,
        (typesArray?.length
          ? inArray(pools.poolType, typesArray)
          : true) as SQLWrapper,
      ),
    )
    .groupBy(
      poolSnapshots.poolExternalId,
      pools.networkSlug,
      pools.symbol,
      pools.poolType,
    )
    .orderBy(orderBy)
    .having(gt(avgApr, 0))
    .limit(Number(limit));

  console.log({ tokens, orderedPoolAprForDate });

  const poolsTokens = await db
    .select({
      poolExternalId: poolTokens.poolExternalId,
      address: poolTokens.tokenAddress,
      weight: poolTokens.weight,
      symbol: tokensTable.symbol,
    })
    .from(poolTokens)
    .leftJoin(
      tokensTable,
      and(
        eq(tokensTable.address, poolTokens.tokenAddress),
        eq(tokensTable.networkSlug, poolTokens.networkSlug),
      ),
    )
    .where(
      // @ts-expect-error
      orderedPoolAprForDate?.length
        ? inArray(
            poolTokens.poolExternalId,
            orderedPoolAprForDate.map((p) => p.poolExternalId as string),
          )
        : true,
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
          rewards: Number(pool.avgRewardTokenApr),
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
