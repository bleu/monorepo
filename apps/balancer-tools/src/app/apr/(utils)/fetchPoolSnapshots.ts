import { PoolSnapshotInRangeQuery } from "@bleu-balancer-tools/gql/src/balancer/__generated__/Ethereum.server";
import { eq } from "drizzle-orm";

import { db } from "#/db";
import { pools as dbPools, poolSnapshots } from "#/db/schema";
import { pools, poolsWithCache } from "#/lib/gql/server";

import { dateToEpoch, generateDateRange } from "../api/(utils)/date";

export function isTimestampToday(timestamp: number): boolean {
  const now = new Date();
  const utcMidnightTimestampOfCurrentDay = dateToEpoch(
    new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        0,
        0,
        0,
        0,
      ),
    ),
  );

  return timestamp === utcMidnightTimestampOfCurrentDay;
}

export async function fetchPoolSnapshots({
  to,
  from,
  network,
  poolId,
}: {
  to: number;
  from: number;
  network: string;
  poolId: string;
}): Promise<PoolSnapshotInRangeQuery> {
  const strategy = isTimestampToday(to) ? pools : poolsWithCache;
  const res = await strategy.gql(network).poolSnapshotInRange({
    poolId,
    timestamp: generateDateRange(from, to),
  });

  if (!res.poolSnapshots.length) {
    return res;
  }

  const pool = await db
    .select()
    .from(dbPools)
    .where(eq(dbPools.poolId, poolId));
  await db.insert(poolSnapshots).values(
    res.poolSnapshots.map((poolSnapshot) => ({
      poolId: pool[0].id,
      timestamp: new Date(poolSnapshot.timestamp * 1000),
      liquidity: poolSnapshot.liquidity,
      swapVolume: poolSnapshot.swapVolume,
      swapFees: poolSnapshot.swapFees,
    })),
  );

  return res;
}
