import * as balEmissions from "#/lib/balancer/emissions";
import { formatNumber } from "#/utils/formatNumber";

import OverviewCards, {
  getRoundDetails,
} from "../../(components)/OverviewCards";
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
    { title: "BAL Price", content: balInUSD },
    {
      title: "BAL Emissions",
      content: formatNumber(
        balEmissions.weekly(round.endDate.getTime() / 1000),
      ),
    },
    ...getRoundDetails(roundId),
  ];
  return <OverviewCards cardsDetails={cardsDetails} />;
}
