import { formatDate } from "@bleu-balancer-tools/utils";

import { formatNumber } from "#/utils/formatNumber";

import OverviewCards from "../../(components)/OverviewCards";
import { calculatePoolStats } from "../../(utils)/calculateRoundAPR";
import { Round } from "../../(utils)/rounds";

export default async function PoolOverviewCards({
  roundId,
  poolId,
}: {
  roundId: string;
  poolId: string;
}) {
  const { apr, tvl } = await calculatePoolStats({ poolId, roundId });
  const round = Round.getRoundByNumber(roundId);
  const cardsDetails = [
    { title: "TVL", content: formatNumber(tvl) },
    { title: "APR", content: formatNumber(apr).concat("%") },
    { title: "Round Number", content: roundId },
    { title: "Round Ended", content: formatDate(round.endDate) },
  ];
  return <OverviewCards cardsDetails={cardsDetails} />;
}
