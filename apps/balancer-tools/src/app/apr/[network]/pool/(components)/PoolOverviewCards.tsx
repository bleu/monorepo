import { formatDate } from "@bleu-balancer-tools/utils";

import OverviewCards from "#/app/apr/(components)/OverviewCards";
import { calculatePoolStats } from "#/app/apr/(utils)/calculatePoolStats";
import { Round } from "#/app/apr/(utils)/rounds";
import { formatNumber } from "#/utils/formatNumber";

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
