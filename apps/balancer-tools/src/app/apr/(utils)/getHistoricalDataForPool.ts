import pThrottle from "p-throttle";

import { calculatePoolStats } from "./calculateRoundAPR";
import { Round } from "./rounds";

export interface HistoricalDataEntry {
  apr: number;
  balPriceUSD: number;
  tvl: number;
  votingShare: number;
  roundId: number;
}

const throttle = pThrottle({
  limit: 2,
  interval: 500,
});

async function calculateAndPushStats(
  poolId: string,
  roundId: number,
): Promise<HistoricalDataEntry> {
  const throttledFn = throttle(async () => {
    return await calculatePoolStats({ poolId, roundId });
  });

  const { apr, balPriceUSD, tvl, votingShare } = await throttledFn();
  return { apr, balPriceUSD, tvl, votingShare, roundId: roundId };
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
