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
  const round = Round.getRoundByNumber(roundId);
  const pool = new Pool(poolId);

  const endRoundBlockNumber = await getBlockNumberByTimestamp(
    pool.gauge?.network ?? 1,
    round.activeRound ? round.startDate : round.endDate,
  );

  let balPriceUSD, tvl, votingShare;

  try {
    balPriceUSD = await getBALPriceByRound(round);
  } catch (error) {
    balPriceUSD = 0;
  }

  try {
    tvl = await pools
      .gql(String(pool.gauge?.network) ?? 1)
      .PoolWhereBlockNumber({
        blockNumber: endRoundBlockNumber,
        poolId,
      })
      .then((res) => {
        if (!res.pool?.totalLiquidity) {
          throw new Error("Failed to fetch totalLiquidity.");
        }
        return res.pool?.totalLiquidity;
      });
  } catch (error) {
    tvl = 0;
  }

  try {
    votingShare = await getPoolRelativeWeight(
      poolId,
      round.endDate.getTime() / 1000,
    );
  } catch (error) {
    votingShare = 0;
  }

  let apr = 0;
  if (balPriceUSD !== null && tvl !== null && votingShare !== null) {
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
