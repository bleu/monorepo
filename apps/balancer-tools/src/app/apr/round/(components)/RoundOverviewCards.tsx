import * as balEmissions from "#/lib/balancer/emissions";
import { formatNumber } from "#/utils/formatNumber";

import OverviewCards, {
  getDatesDetails,
} from "../../(components)/OverviewCards";
import { getBALPriceForDateRange } from "../../(utils)/getBALPriceForDateRange";
import { dateToEpoch } from "../../api/(utils)/date";

export default async function RoundOverviewCards({
  startAt,
  endAt,
}: {
  startAt: Date;
  endAt: Date;
}) {
  const balInUSD = (
    await getBALPriceForDateRange(dateToEpoch(startAt), dateToEpoch(endAt))
  ).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
  const cardsDetails = [
    { title: "BAL Price", content: balInUSD },
    {
      title: "BAL Emissions",
      content: formatNumber(balEmissions.weekly(dateToEpoch(endAt))),
    },
    ...getDatesDetails(startAt, endAt),
  ];
  return <OverviewCards cardsDetails={cardsDetails} />;
}
