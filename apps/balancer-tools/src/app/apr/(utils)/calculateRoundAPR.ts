import * as balEmissions from "#/lib/balancer/emissions";

import { Round } from "./rounds";

export default function calculateRoundAPR(
  round: Round,
  votingShare: number,
  tvl: number,
  balPriceUSD: number,
) {
  const emissions = balEmissions.weekly(round.endDate.getTime() / 1000);

  return (emissions * votingShare * 52 * balPriceUSD) / tvl;
}
