import { fetcher } from "#/utils/fetcher";

import OverviewCards, {
  getDatesDetails,
} from "../../(components)/OverviewCards";
import { formatAPR, formatTVL } from "../../(utils)/formatPoolStats";
import { BASE_URL, PoolStatsResults } from "../../api/route";

export default async function PoolOverviewCards({
  startAt,
  endAt,
  poolId,
}: {
  startAt: Date;
  endAt: Date;
  poolId: string;
}) {
  const cardsDetails: {
    title: string;
    content: JSX.Element | string;
    tooltip?: string;
  }[] = [];
  const results: PoolStatsResults = await fetcher(
    `${BASE_URL}/apr/api/?poolId=${poolId}&startAt${startAt}&endAt=${endAt}`,
  );

  cardsDetails.push(
    ...[
      { title: "Avg. TVL", content: formatTVL(results.average.tvl) },
      {
        title: "Avg. veBAL APR",
        content: formatAPR(results.average.apr.breakdown.veBAL),
      },
      ...getDatesDetails(startAt, endAt),
    ],
  );

  return <OverviewCards cardsDetails={cardsDetails} />;
}
