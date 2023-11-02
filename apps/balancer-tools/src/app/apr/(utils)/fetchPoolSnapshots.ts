import { PoolSnapshotInRangeQuery } from "@bleu-fi/gql/src/balancer/__generated__/Ethereum.server";
import { dateToEpoch, generateDateRange } from "@bleu-fi/utils/date";

import { pools, poolsWithCache } from "#/lib/gql/server";

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

  return res;
}
