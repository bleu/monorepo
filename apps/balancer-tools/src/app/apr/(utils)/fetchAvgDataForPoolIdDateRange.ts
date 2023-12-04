import { db } from "@bleu-fi/balancer-apr/src/db";
import {
  poolSnapshots,
  swapFeeApr,
  vebalApr,
  yieldTokenApr,
} from "@bleu-fi/balancer-apr/src/db/schema";
import { and, between, eq, sql } from "drizzle-orm";

export async function fetchAvgDataForPoolIdDateRange(
  poolId: string,
  startDate: Date,
  endDate: Date,
) {
  const yieldAprSum = db
    .select({
      poolExternalId: yieldTokenApr.poolExternalId,
      timestamp: yieldTokenApr.timestamp,
      valueSum: sql<number>`sum(${yieldTokenApr.value})`.as("valueSum"),
    })
    .from(yieldTokenApr)
    .groupBy(yieldTokenApr.poolExternalId, yieldTokenApr.timestamp)
    .as("yieldTokenAprSum");
  const poolStatsData = await db
    .select({
      poolExternalId: swapFeeApr.poolExternalId,
      avgApr: sql<number>`cast(avg(   
        coalesce(${swapFeeApr.value},0) + coalesce(${vebalApr.value},0) +  coalesce(${yieldAprSum.valueSum},0)
      ) as decimal)`,
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
    )
    .groupBy(swapFeeApr.poolExternalId);

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
