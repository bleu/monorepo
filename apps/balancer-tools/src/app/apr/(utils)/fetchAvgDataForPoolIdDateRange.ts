import { db } from "@bleu/balancer-apr/src/db";
import {
  poolSnapshots,
  rewardsTokenApr,
  swapFeeApr,
  vebalApr,
  yieldTokenApr,
} from "@bleu/balancer-apr/src/db/schema";
import { and, between, eq, sql } from "drizzle-orm";

export async function fetchAvgDataForPoolIdDateRange(
  poolId: string,
  startDate: Date,
  endDate: Date
) {
  const yieldAprSum = db
    .select({
      poolExternalId: yieldTokenApr.poolExternalId,
      timestamp: yieldTokenApr.timestamp,
      yieldValueSum: sql<number>`sum(${yieldTokenApr.value})`.as(
        "yieldValueSum"
      ),
    })
    .from(yieldTokenApr)
    .groupBy(yieldTokenApr.poolExternalId, yieldTokenApr.timestamp)
    .as("yieldAprSum");

  const rewardAprSum = db
    .select({
      poolExternalId: rewardsTokenApr.poolExternalId,
      timestamp: rewardsTokenApr.timestamp,
      rewardValueSum: sql<number>`sum(${rewardsTokenApr.value})`.as(
        "rewardValueSum"
      ),
    })
    .from(rewardsTokenApr)
    .groupBy(rewardsTokenApr.poolExternalId, rewardsTokenApr.timestamp)
    .as("rewardAprSum");
  const poolStatsData = await db
    .select({
      poolExternalId: poolSnapshots.poolExternalId,
      avgApr:
        sql<number>`cast(sum(coalesce(${swapFeeApr.value},0) + coalesce(${vebalApr.value},0) + coalesce(${yieldAprSum.yieldValueSum},0) + coalesce(${rewardAprSum.rewardValueSum},0)) / count(${poolSnapshots.timestamp}) as decimal)`.as(
          "avgApr"
        ),
      avgLiquidity:
        sql<number>`cast(sum(${poolSnapshots.liquidity}) / count(${poolSnapshots.timestamp}) as decimal)`.as(
          "avgLiquidity"
        ),
    })
    .from(poolSnapshots)
    .fullJoin(
      swapFeeApr,
      and(
        eq(poolSnapshots.poolExternalId, swapFeeApr.poolExternalId),
        eq(poolSnapshots.timestamp, swapFeeApr.timestamp)
      )
    )
    .fullJoin(
      vebalApr,
      and(
        eq(vebalApr.poolExternalId, poolSnapshots.poolExternalId),
        eq(vebalApr.timestamp, poolSnapshots.timestamp)
      )
    )
    .fullJoin(
      yieldAprSum,
      and(
        eq(yieldAprSum.poolExternalId, poolSnapshots.poolExternalId),
        eq(yieldAprSum.timestamp, poolSnapshots.timestamp)
      )
    )
    .fullJoin(
      rewardAprSum,
      and(
        eq(rewardAprSum.poolExternalId, poolSnapshots.poolExternalId),
        eq(rewardAprSum.timestamp, poolSnapshots.timestamp)
      )
    )
    .where(
      and(
        between(poolSnapshots.timestamp, startDate, endDate),
        eq(poolSnapshots.poolExternalId, poolId)
      )
    )
    .groupBy(poolSnapshots.poolExternalId);

  const returnData = poolStatsData.map((pool) => {
    return {
      poolId: pool.poolExternalId,
      avgApr: Number(pool.avgApr),
      avgTvl: Number(pool.avgLiquidity),
    };
  });

  return {
    poolAverage: returnData[0],
  };
}
