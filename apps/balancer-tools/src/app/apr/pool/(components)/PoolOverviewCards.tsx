import OverviewCards, {
  getDatesDetails,
} from "../../(components)/OverviewCards";
import { formatAPR, formatTVL } from "../../(utils)/formatPoolStats";
import { fetchAvgDataForPoolIdDateRange } from "../../api/(utils)/fetchAvgDataForPoolIdDateRange";

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

  const results = await fetchAvgDataForPoolIdDateRange(poolId, startAt, endAt);

  cardsDetails.push(
    ...[
      {
        title: "Avg. TVL",
        content: formatTVL(results.poolAverage.avgTvl),
      },
      {
        title: "Avg. Total APR",
        content: formatAPR(results.poolAverage.avgApr),
      },
      ...getDatesDetails(startAt, endAt),
    ],
  );

  return <OverviewCards cardsDetails={cardsDetails} />;
}
