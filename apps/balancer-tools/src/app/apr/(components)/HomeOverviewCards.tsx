import * as balEmissions from "@bleu/balancer-apr/src/lib/balancer/emissions";
import { dateToEpoch } from "@bleu/utils/date";
import { formatNumber } from "@bleu/utils/formatNumber";

import { getBALPriceForDateRange } from "../(utils)/getBALPriceForDateRange";
import OverviewCards, { getDatesDetails } from "./OverviewCards";

export default async function HomeOverviewCards({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}) {
  const balInUSD = await getBALPriceForDateRange(startDate, endDate);
  const cardsDetails = [
    { title: "BAL Price", content: balInUSD },
    {
      title: "BAL Emissions",
      content: formatNumber(balEmissions.weekly(dateToEpoch(endDate))),
    },
    ...getDatesDetails(startDate, endDate),
  ];
  return <OverviewCards cardsDetails={cardsDetails} />;
}
