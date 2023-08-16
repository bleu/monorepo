import { formatDate } from "@bleu-balancer-tools/utils";

import { formatNumber } from "#/utils/formatNumber";

import OverviewCards from "../../(components)/OverviewCards";
import { calculateAPRForPool } from "../../(utils)/calculateRoundAPR";
import { Round } from "../../(utils)/rounds";

export default async function PoolOverviewCards({
  roundId,
  poolId,
}: {
  roundId: string;
  poolId: string;
}) {
  const { apr, tvl } = await calculateAPRForPool({ poolId, roundId });
  const round = Round.getRoundByNumber(roundId);
  const cardsDetails = [
    { title: "TVL", content: formatNumber(tvl) },
    { title: "APR", content: formatNumber(apr) },
    { title: "Round Number", content: roundId },
    { title: "Round Deadline", content: formatDate(round.endDate) },
  ];
  return <OverviewCards cardsDetails={cardsDetails} />;
}
