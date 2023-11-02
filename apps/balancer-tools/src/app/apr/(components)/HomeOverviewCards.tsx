import { formatNumber } from "@bleu-fi/utils/formatNumber";

import * as balEmissions from "#/lib/balancer/emissions";

import { getBALPriceForDateRange } from "../(utils)/getBALPriceForDateRange";
import { dateToEpoch } from "../api/(utils)/date";
import OverviewCards, { getDatesDetails } from "./OverviewCards";

export default async function HomeOverviewCards({
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
