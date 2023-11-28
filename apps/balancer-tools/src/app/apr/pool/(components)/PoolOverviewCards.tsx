import { fetcher } from "@bleu-fi/utils/fetcher";

import OverviewCards, {
  getDatesDetails,
} from "../../(components)/OverviewCards";
import { formatAPR, formatTVL } from "../../(utils)/formatPoolStats";
import { generateApiUrlWithParams } from "../../(utils)/getFilteredApiUrl";
import { PoolStatsResults } from "../../api/route";

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
    generateApiUrlWithParams(startAt, endAt, null, poolId),
  );

  cardsDetails.push(
    ...[
      {
        title: "Avg. TVL",
        content: formatTVL(results.average.poolAverage[0].tvl),
      },
      {
        title: "Avg. Total APR",
        content: formatAPR(results.average.poolAverage[0].apr.total),
      },
      ...getDatesDetails(startAt, endAt),
    ],
  );

  return <OverviewCards cardsDetails={cardsDetails} />;
}
