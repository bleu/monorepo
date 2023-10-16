/* eslint-disable no-console */

import { Pool } from "#/lib/balancer/gauges";
import { pools } from "#/lib/gql/server";

import {
  calculateDaysBetween,
  generateDateRange,
  SECONDS_IN_DAY,
} from "../api/(utils)/date";
import { PoolStatsData, tokenAPR } from "../api/route";
import { calculateAPRForDateRange } from "./calculateApr";
import { getBALPriceForDateRange } from "./getBALPriceForDateRange";
import { PoolTypeEnum } from "./types";

export interface calculatePoolData extends Omit<PoolStatsData, "apr"> {
  apr: {
    total: number;
    breakdown: {
      veBAL: number | null;
      swapFee: number;
      tokens?: {
        total: number;
        breakdown: tokenAPR[];
      };
    };
  };
}

export async function fetchPoolAveragesForDateRange(
  poolId: string,
  network: string,
  from: number,
  to: number,
): Promise<[number, number, string, number]> {
  // Determine if the initial date range is less than 2 days
  const initialRangeInDays = calculateDaysBetween(from, to);
  const extendedFrom = initialRangeInDays < 2 ? from - SECONDS_IN_DAY : from;

  // Fetch snapshots within the (potentially extended) date range
  const res = await pools.gql(network).poolSnapshotInRange({
    poolId,
    timestamp: [extendedFrom],
  });

  let chosenData = res.poolSnapshots[0];

  if (res.poolSnapshots.length == 0) {
    const retryGQL = await pools.gql(network).poolSnapshotInRange({
      poolId,
      timestamp: generateDateRange(from - SECONDS_IN_DAY * 7, to),
    });

    if (retryGQL.poolSnapshots.length === 0) {
      // TODO: Throw error here and handle outside of it.
      return [0, 0, "", 0];
    }
    chosenData = retryGQL.poolSnapshots
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(-1)[0];
  }

  const liquidity = Number(chosenData.liquidity);

  const volume = Number(chosenData.swapVolume);

  const bptPrice =
    Number(chosenData.liquidity) / Number(chosenData.totalShares);

  return [liquidity, volume, chosenData.pool.symbol ?? "", bptPrice];
}

export async function calculatePoolStats({
  startAtTimestamp,
  endAtTimestamp,
  poolId,
}: {
  startAtTimestamp: number;
  endAtTimestamp: number;
  poolId: string;
}): Promise<calculatePoolData> {
  const pool = new Pool(poolId);
  const network = String(pool.network);
  const results = await Promise.allSettled([
    // TODO: what if the pool doesn't exist during that range?
    pools.gql(network).Pool({ poolId }),
    getBALPriceForDateRange(startAtTimestamp, endAtTimestamp),
    fetchPoolAveragesForDateRange(
      poolId,
      network,
      startAtTimestamp,
      endAtTimestamp,
    ),
  ]);

  if (results[0].status === "fulfilled" && !results[0].value?.pool) {
    throw new Error(
      `No pool with ID ${poolId}(${network}) in range ${startAtTimestamp} - ${endAtTimestamp}`,
    );
  }

  if (results.some((p) => p.status === "rejected")) {
    const errors = results
      .filter((p) => p.status === "rejected")
      // @ts-ignore
      .map((p) => p.reason);
    throw new Error(
      `Error fetching data for pool ${poolId}(${network}) in range ${startAtTimestamp} - ${endAtTimestamp}: ${errors}, function ${errors[0]?.stack}}`,
    );
  }

  const [
    _,
    balPriceUSD,
    [tvl, volume, symbol],
    // @ts-ignore
  ] = results.filter((p) => p.status === "fulfilled").map((p) => p.value);

  const { apr, votingShare, collectedFeesUSD } = await calculateAPRForDateRange(
    startAtTimestamp,
    endAtTimestamp,
    tvl,
    balPriceUSD,
    poolId,
    network,
  );

  return {
    poolId,
    apr,
    balPriceUSD,
    tvl,
    tokens: pool.tokens,
    volume,
    votingShare,
    symbol,
    network,
    collectedFeesUSD,
    type: pool.poolType as keyof typeof PoolTypeEnum,
  };
}
