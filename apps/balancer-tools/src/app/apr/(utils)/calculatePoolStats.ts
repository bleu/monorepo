import * as balEmissions from "#/lib/balancer/emissions";
import { Pool } from "#/lib/balancer/gauges";
import { pools } from "#/lib/gql/server";

import { getBALPriceByRound } from "./getBALPriceByRound";
import getBlockNumberByTimestamp from "./getBlockNumberForTime";
import { getPoolRelativeWeight } from "./getRelativeWeight";
import { Round } from "./rounds";

const WEEKS_IN_YEAR = 52;

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

  const endRoundBlockNumber = await getBlockNumberByTimestamp(
    pool.network ?? 1,
    round.endDate,
  );

  let balPriceUSD = 0;
  let tvl = 0;
  let votingShare = 0;
  let apr = 0;

  balPriceUSD = await getBALPriceByRound(round);

  tvl = round.activeRound
    ? await pools
        .gql(pool.network ?? 1)
        .Pool({
          poolId,
        })
        .then((res) => {
          return res.pool?.totalLiquidity ?? 0;
        })
    : await pools
        .gql(pool.network ?? 1)
        .PoolWhereBlockNumber({
          blockNumber: endRoundBlockNumber,
          poolId,
        })
        .then((res) => {
          return res.pool?.totalLiquidity ?? 0;
        });

  votingShare = await getPoolRelativeWeight(
    poolId,
    round.endDate.getTime() / 1000,
  );

  if (balPriceUSD !== 0 && tvl !== 0 && votingShare !== 0) {
    apr = calculateRoundAPR(round, votingShare, tvl, balPriceUSD) * 100;
  }
  return { apr, balPriceUSD, tvl, votingShare };
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
