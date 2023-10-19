import { PoolSnapshotInRangeQuery } from "@bleu-balancer-tools/gql/src/balancer/__generated__/Ethereum.server";

import { pools, poolsWithoutCache } from "#/lib/gql/server";

import { dateToEpoch, generateDateRange } from "../api/(utils)/date";

export async function fetchPoolSnapshots(
  to: number,
  extendedFrom: number,
  network: string,
  poolId: string,
): Promise<PoolSnapshotInRangeQuery> {
  let res: PoolSnapshotInRangeQuery;

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

  if (to === currentDateUTC) {
    res = await poolsWithoutCache.gql(network).poolSnapshotInRange({
      poolId,
      timestamp: generateDateRange(extendedFrom, to),
    });
  } else {
    res = await pools.gql(network).poolSnapshotInRange({
      poolId,
      timestamp: generateDateRange(extendedFrom, to),
    });
  }

  return res;
}
