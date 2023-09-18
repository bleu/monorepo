import * as balEmissions from "#/lib/balancer/emissions";
import { formatNumber } from "#/utils/formatNumber";

import OverviewCards, {
  getDatesDetails,
} from "../../(components)/OverviewCards";
import { getBALPriceByRound } from "../../(utils)/getBALPriceByRound";
import { Round } from "../../(utils)/rounds";

export default async function RoundOverviewCards({
  startAt,
  endAt,
}: {
  startAt: Date;
  endAt: Date;
}) {
  const balInUSD = (await getBALPriceByRound(startAt, endAt)).toLocaleString(
    "en-US",
    {
      style: "currency",
      currency: "USD",
    },
  );
  const cardsDetails = [
    { title: "BAL Price", content: balInUSD },
    {
      title: "BAL Emissions",
      content: formatNumber(balEmissions.weekly(endAt.getTime() / 1000)),
    },
    ...getDatesDetails(startAt, endAt),
  ];
  return <OverviewCards cardsDetails={cardsDetails} />;
}
