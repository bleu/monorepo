import pThrottle from "p-throttle";

import * as balEmissions from "#/lib/balancer/emissions";
import { Pool } from "#/lib/balancer/gauges";
import { pools } from "#/lib/gql/server";

import { getBALPriceByRound } from "./getBALPriceByRound";
import getBlockNumberByTimestamp from "./getBlockNumberForTime";
import { getPoolRelativeWeight } from "./getRelativeWeight";
import { Round } from "./rounds";

const WEEKS_IN_YEAR = 52;

// Whenever we exceed the subgraph rate limit, it would just stop returning data
// p-throttle is used to limit the number of requests to the subgraph at once
// I got to these numbers by testing and adjusting manually
const throttle = pThrottle({
  limit: 1,
  interval: 400,
});

export async function calculatePoolStats({
  roundId,
  poolId,
}: {
  roundId: string;
  poolId: string;
}) {
  // TODO: BAL-646 aggregate historical pool APR when roundId is not provided
  const round = Round.getRoundByNumber(roundId);
  const pool = new Pool(poolId);
  const throttledFn = throttle(async (network: number, endDate: Date) => {
    return await getBlockNumberByTimestamp(network, endDate);
  });
  const endRoundBlockNumber = await throttledFn(
    pool.network ?? 1,
    round.endDate,
  );
  if (!endRoundBlockNumber) {
    // Normally this shouldn't happen, but if it does, we'd rather return an error than crash
    // eslint-disable-next-line no-console
    console.error(
      `Couldn't fetch block number for pool ${poolId} on round ${roundId}`,
    );
    throw new Error("Couldn't fetch block number");
  }

  const network = pool.network ?? 1;
  let balPriceUSD = 0;
  let symbol = pool.symbol;
  let tvl = 0;
  let votingShare = 0;
  let apr = 0;

  balPriceUSD = await getBALPriceByRound(round);

  [tvl, symbol] = round.activeRound
    ? await pools
        .gql(String(network))
        .Pool({
          poolId,
        })
        .then((res) => {
          return [
            parseFloat(res.pool?.totalLiquidity) ?? 0,
            res.pool?.symbol ?? pool.symbol,
          ];
        })
    : await pools
        .gql(String(network))
        .PoolWhereBlockNumber({
          blockNumber: endRoundBlockNumber,
          poolId,
        })
        .then((res) => {
          return [
            parseFloat(res.pool?.totalLiquidity) ?? 0,
            res.pool?.symbol ?? pool.symbol,
          ];
        });

  votingShare = await getPoolRelativeWeight(
    poolId,
    round.endDate.getTime() / 1000,
  );

  if (balPriceUSD !== 0 && tvl !== 0 && votingShare !== 0) {
    apr = calculateRoundAPR(round, votingShare, tvl, balPriceUSD) * 100;
  }
  return { apr, balPriceUSD, tvl, votingShare, symbol, network };
}

function calculateRoundAPR(
  round: Round,
  votingShare: number,
  tvl: number,
  balPriceUSD: number,
) {
  const emissions = balEmissions.weekly(round.endDate.getTime() / 1000);

  return (WEEKS_IN_YEAR * (emissions * votingShare * balPriceUSD)) / tvl;
}
