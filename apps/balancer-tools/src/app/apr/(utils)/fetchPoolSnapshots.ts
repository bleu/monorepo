import { db } from "@bleu-fi/balancer-apr/src/db";
import { poolSnapshots } from "@bleu-fi/balancer-apr/src/db/schema";
import { dateToEpoch } from "@bleu-fi/utils/date";
import { between, eq } from "drizzle-orm";

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
  // network,
  poolId,
}: {
  to: number;
  from: number;
  // network: string;
  poolId: string;
  // }): Promise<PoolSnapshotInRangeQuery> {
}) {
  return await db
    .select()
    .from(poolSnapshots)
    .where(eq(poolSnapshots.poolExternalId, poolId))
    .where(between(poolSnapshots.timestamp, new Date(from), new Date(to)));

  // const strategy = isTimestampToday(to) ? pools : poolsWithCache;
  // const res = await strategy.gql(network).poolSnapshotInRange({
  //   poolId,
  //   timestamp: generateDateRange(from, to),
  // });

  // if (!res.poolSnapshots.length) {
  //   return res;
  // }

  // const pool = await db.select().from(dbPools).where(eq(dbPools.poolId, poolId));
  // await db.insert(poolSnapshots).values(
  //   res.poolSnapshots.map((poolSnapshot) => ({
  //     poolId: pool[0].id,
  //     timestamp: new Date(poolSnapshot.timestamp * 1000),
  //     liquidity: poolSnapshot.liquidity,
  //     swapVolume: poolSnapshot.swapVolume,
  //     swapFees: poolSnapshot.swapFees,
  //   })),
  // )

  // return res;
}
