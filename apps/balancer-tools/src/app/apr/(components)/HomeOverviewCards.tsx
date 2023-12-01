import * as balEmissions from "@bleu-fi/balancer-apr/src/lib/balancer/emissions";
import { dateToEpoch } from "@bleu-fi/utils/date";
import { formatNumber } from "@bleu-fi/utils/formatNumber";

import { getBALPriceForDateRange } from "../(utils)/getBALPriceForDateRange";
import OverviewCards, { getDatesDetails } from "./OverviewCards";

export default async function HomeOverviewCards({
  startAt,
  endAt,
}: {
  startAt: Date;
  endAt: Date;
}) {
  const balInUSD = await getBALPriceForDateRange(startAt, endAt);
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
