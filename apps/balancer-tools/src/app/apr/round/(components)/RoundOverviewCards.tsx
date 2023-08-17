import { formatDate } from "@bleu-balancer-tools/utils";

import * as balEmissions from "#/lib/balancer/emissions";
import { formatNumber } from "#/utils/formatNumber";

import OverviewCards from "../../(components)/OverviewCards";
import { getBALPriceByRound } from "../../(utils)/getBALPriceByRound";
import { Round } from "../../(utils)/rounds";

export default async function RoundOverviewCards({
  roundId,
}: {
  roundId: string;
}) {
  const round = Round.getRoundByNumber(roundId);
  const balInUSD = (await getBALPriceByRound(round)).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
  const cardsDetails = [
    // TODO: [BAL-640] Total votes -> get this data from the subgraph
    { title: "Total votes", content: "8.751k" },
    { title: "BAL Price", content: balInUSD },
    {
      title: "BAL Emissions",
      content: formatNumber(
        balEmissions.weekly(round.endDate.getTime() / 1000),
      ),
    },
    { title: "Round Number", content: roundId },
    { title: "Round Ended", content: formatDate(round.endDate) },
  ];
  return <OverviewCards cardsDetails={cardsDetails} />;
}
