import * as balEmissions from "#/lib/balancer/emissions";

import { Round } from "./rounds";

const WEEKS_IN_YEAR = 52;

export default function calculateRoundAPR(
  round: Round,
  votingShare: number,
  tvl: number,
  balPriceUSD: number,
) {
  const emissions = balEmissions.weekly(round.endDate.getTime() / 1000);

  return (WEEKS_IN_YEAR * (emissions * votingShare * balPriceUSD)) / tvl;
}
