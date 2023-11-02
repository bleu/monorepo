/* eslint-disable no-console */

import { calculateDaysBetween, SECONDS_IN_DAY } from "@bleu-fi/utils/date";

import { PoolStatsData, TokenAPR } from "../api/route";
import { calculateAPRForDateRange } from "./calculateApr";
import { fetchPoolSnapshots } from "./fetchPoolSnapshots";

export interface calculatePoolData extends Omit<PoolStatsData, "apr"> {
  apr: {
    total: number;
    breakdown: {
      veBAL: number | null;
      swapFee: number;
      tokens?: {
        total: number;
        breakdown: TokenAPR[];
      };
    };
  };
}

// export async function fetchPoolAveragesForDateRange(
//   poolId: string,
//   network: string,
//   from: number,
//   to: number,
// ): Promise<[number, number, string, number]> {
//   // Determine if the initial date range is less than 2 days
//   const initialRangeInDays = calculateDaysBetween(from, to);
//   const extendedFrom = initialRangeInDays < 2 ? from - SECONDS_IN_DAY : from;

//   // Fetch snapshots within the (potentially extended) date range
//   const res = await fetchPoolSnapshots({
//     to,
//     from: extendedFrom,
//     network,
//     poolId,
//   });

//   let chosenData = res.poolSnapshots[0];

//   if (res.poolSnapshots.length == 0) {
//     const retryGQL = await fetchPoolSnapshots({
//       to: to - SECONDS_IN_DAY,
//       from: from - SECONDS_IN_DAY * 7,
//       network,
//       poolId,
//     });

//     if (retryGQL.poolSnapshots.length === 0) {
//       // TODO: Throw error here and handle outside of it.
//       return [0, 0, "", 0];
//     }
//     chosenData = retryGQL.poolSnapshots
//       .sort((a, b) => a.timestamp - b.timestamp)
//       .slice(-1)[0];

//     // if the retry was needed then the volume on that day is 0
//     chosenData.swapVolume = 0;
//   }

//   const liquidity = Number(chosenData.liquidity);

//   const volume = Number(chosenData.swapVolume);

//   const bptPrice =
//     Number(chosenData.liquidity) / Number(chosenData.totalShares);

//   return [liquidity, volume, chosenData.pool.symbol ?? "", bptPrice];
// }

export async function calculatePoolStats({
  startAtTimestamp,
  endAtTimestamp,
  poolId,
}: {
  startAtTimestamp: number;
  endAtTimestamp: number;
  poolId: string;
}): Promise<calculatePoolData> {
  const { apr, collectedFeesUSD } = await calculateAPRForDateRange(
    startAtTimestamp,
    endAtTimestamp,
    poolId,
  );

  return {
    poolId,
    apr,
    balPriceUSD: 0,
    tvl: 0,
    tokens: [],
    volume: 0,
    votingShare: 0,
    symbol: "",
    network: "",
    collectedFeesUSD,
    type: "WEIGHTED",
  };
}
