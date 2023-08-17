import * as balEmissions from "#/lib/balancer/emissions";
import { Pool } from "#/lib/balancer/gauges";

import BalancerAPI from "./balancerAPI";
import { getBALPriceByRound } from "./getBALPriceByRound";
import { getPoolRelativeWeight } from "./getRelativeWeight";
import { Round } from "./rounds";

const WEEKS_IN_YEAR = 52;

export async function calculateAPRForPool({
  roundId,
  poolId,
}: {
  roundId: string;
  poolId: string;
}) {
  const round = Round.getRoundByNumber(roundId);

  const pool = new Pool(poolId);

  const [balPriceUSD, tvl, votingShare] = await Promise.all([
    getBALPriceByRound(round),
    // TODO: must select the correct network
    //TODO: BAL-648 TVL from the selected round
    BalancerAPI.getPoolTotalLiquidityUSD(pool.gauge?.network || 1, pool.id),
    getPoolRelativeWeight(poolId, round.endDate.getTime() / 1000),
  ]);

  const apr = calculateRoundAPR(round, votingShare, tvl, balPriceUSD) * 100;

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
