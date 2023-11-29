import { db } from "@bleu-fi/balancer-apr/src/db";
import {
  poolSnapshots,
  swapFeeApr,
  vebalApr,
} from "@bleu-fi/balancer-apr/src/db/schema";
import { and, between, eq, sql } from "drizzle-orm";

export async function fetchAvgDataForPoolIdDateRange(
  poolId: string,
  startDate: Date,
  endDate: Date,
) {
  const poolStatsData = await db
    .select({
      poolExternalId: swapFeeApr.poolExternalId,
      avgApr: sql<number>`cast(avg(   
        coalesce(${swapFeeApr.value},0) + coalesce(${vebalApr.value},0)
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
