import pThrottle from "p-throttle";

import { calculatePoolStats } from "./calculatePoolStats";
import { Round } from "./rounds";

export interface PoolStatsData {
  apr: number;
  balPriceUSD: number;
  tvl: number;
  votingShare: number;
  roundId: number;
  symbol: string;
}

const throttle = pThrottle({
  limit: 2,
  interval: 500,
});

async function calculateAndPushStats(
  poolId: string,
  roundId: number,
): Promise<PoolStatsData> {
  const throttledFn = throttle(async () => {
    return await calculatePoolStats({ poolId, roundId });
  });

  const resultPoolStats = await throttledFn();
  return { roundId, ...resultPoolStats };
}

export async function generatePromisesForHistoricalPoolData(
  poolId: string,
  startRoundId: number = 1,
  endRoundId: number = parseInt(Round.getAllRounds()[0].value),
): Promise<Array<HistoricalDataEntry>> {
  const promises: Promise<HistoricalDataEntry>[] = [];

  for (let index = startRoundId; index < endRoundId; index++) {
    promises.push(calculateAndPushStats(poolId, index));
  }

  const results = await Promise.all(promises);
  return results;
}
