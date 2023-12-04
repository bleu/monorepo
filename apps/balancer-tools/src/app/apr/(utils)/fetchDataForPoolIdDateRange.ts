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
import { dateToEpoch, formatDateToMMDDYYYY } from "@bleu-fi/utils/date";
import { and, between, eq, sql } from "drizzle-orm";

import { PoolStatsResults } from "./fetchDataTypes";
import { PoolTypeEnum } from "./types";

export async function fetchDataForPoolIdDateRange(
  poolId: string,
  startDate: Date,
  endDate: Date,
): Promise<PoolStatsResults> {
  const yieldAprSum = db
    .select({
      poolExternalId: yieldTokenApr.poolExternalId,
      timestamp: yieldTokenApr.timestamp,
      valueSum: sql<number>`sum(${yieldTokenApr.value})`.as("valueSum"),
    })
    .from(yieldTokenApr)
    .groupBy(yieldTokenApr.poolExternalId, yieldTokenApr.timestamp)
    .as("yieldTokenAprSum");

  const yieldAprToken = db
    .select({
      poolExternalId: yieldTokenApr.poolExternalId,
      timestamp: yieldTokenApr.timestamp,
      value: yieldTokenApr.value,
      tokenAddress: yieldTokenApr.tokenAddress,
      tokenSymbol: tokens.symbol,
    })
    .from(yieldTokenApr)
    .leftJoin(tokens, eq(tokens.address, yieldTokenApr.tokenAddress))
    .as("yieldTokenAprSum");

  const poolStatsData = await db
    .select({
      poolExternalId: swapFeeApr.poolExternalId,
      apr: sql<number>`cast(coalesce(${swapFeeApr.value},0) + coalesce(${vebalApr.value},0) + coalesce(${yieldAprSum.valueSum},0) as decimal)`,
      feeApr: swapFeeApr.value,
      vebalApr: vebalApr.value,
      yieldApr: yieldAprSum.valueSum,
      volume: poolSnapshots.swapVolume,
      liquidity: poolSnapshots.liquidity,
      timestamp: poolSnapshots.timestamp,
      collectedFeesUSD: swapFeeApr.collectedFeesUSD,
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
    .where(
      and(
        between(swapFeeApr.timestamp, startDate, endDate),
        eq(swapFeeApr.poolExternalId, poolId),
      ),
    );

  const poolData = await db
    .select({
      poolExternalId: pools.externalId,
      network: pools.networkSlug,
      type: pools.poolType,
      symbol: pools.symbol,
    })
    .from(pools)
    .fullJoin(swapFeeApr, and(eq(swapFeeApr.poolExternalId, pools.externalId)))
    .where(
      and(
        between(swapFeeApr.timestamp, startDate, endDate),
        eq(pools.externalId, poolId),
      ),
    );

  const yieldAprByToken = await db
    .select({
      poolExternalId: yieldAprToken.poolExternalId,
      timestamp: yieldAprToken.timestamp,
      value: yieldAprToken.value,
      tokenAddress: yieldAprToken.tokenAddress,
      tokenSymbol: yieldAprToken.tokenSymbol,
    })
    .from(yieldAprToken)
    .leftJoin(
      poolSnapshots,
      and(
        eq(poolSnapshots.poolExternalId, yieldAprSum.poolExternalId),
        eq(poolSnapshots.timestamp, yieldAprSum.timestamp),
      ),
    )
    .where(
      and(
        between(yieldAprSum.timestamp, startDate, endDate),
        eq(poolSnapshots.poolExternalId, poolId),
      ),
    );

  const poolsTokens = await db
    .select({
      poolExternalId: poolTokens.poolExternalId,
      address: poolTokens.tokenAddress,
      weight: poolTokens.weight,
      symbol: tokens.symbol,
    })
    .from(poolTokens)
    .leftJoin(tokens, eq(tokens.address, poolTokens.tokenAddress))
    .where(eq(poolTokens.poolExternalId, poolId));

  const returnData = poolStatsData.map((pool) => {
    if (!pool.timestamp) {
      return {};
    }

    const tokensForPool = poolsTokens
      .filter((poolToken) => poolToken.poolExternalId === pool.poolExternalId)
      .map((poolToken) => ({
        address: poolToken.address,
        symbol: poolToken.symbol,
        weight: Number(poolToken.weight),
      }));

    const yieldAprByDate = yieldAprByToken.filter(
      (yieldApr) =>
        dateToEpoch(yieldApr.timestamp) === dateToEpoch(pool.timestamp),
    );

    return {
      [formatDateToMMDDYYYY(pool.timestamp)]: {
        poolId: pool.poolExternalId,
        apr: {
          total: Number(pool.apr),
          breakdown: {
            veBAL: Number(pool.vebalApr),
            swapFee: Number(pool.feeApr),
            tokens: {
              total: Number(pool.yieldApr),
              breakdown: yieldAprByDate.map((yieldApr) => ({
                address: yieldApr.tokenAddress as string,
                symbol: yieldApr.tokenSymbol as string,
                yield: Number(yieldApr.value),
              })),
            },
            rewards: {
              total: 0,
              breakdown: [],
            },
          },
        },
        collectedFeesUSD: Number(pool.collectedFeesUSD),
        tvl: Number(pool.liquidity),
        tokens: tokensForPool,
        volume: Number(pool.volume),
        votingShare: 0,
        symbol:
          poolData.find((p) => p.poolExternalId === pool.poolExternalId)
            ?.symbol || "",
        network:
          poolData.find((p) => p.poolExternalId === pool.poolExternalId)
            ?.network || "",
        type: poolData.find((p) => p.poolExternalId === pool.poolExternalId)
          ?.type as PoolTypeEnum,
      },
    };
  });

  return {
    perDay: returnData,
  };
}
