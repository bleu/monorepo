import { fetcher } from "#/utils/fetcher";

import OverviewCards, {
  getDatesDetails,
} from "../../(components)/OverviewCards";
import { formatAPR, formatTVL } from "../../(utils)/formatPoolStats";
import { BASE_URL, PoolStatsResults } from "../../api/route";

async function AverageTVLCard({ poolId }: { poolId: string }) {
  const data: PoolStatsResults = await fetcher(
    `${BASE_URL}/apr/api/?poolId=${poolId}`,
  );
  return <div>{formatTVL(data.average.tvl)}</div>;
}

async function AverageAPRCard({ poolId }: { poolId: string }) {
  const data: PoolStatsResults = await fetcher(
    `${BASE_URL}/apr/api/?poolId=${poolId}`,
  );
  return <div>{formatAPR(data.average.apr.total)}</div>;
}

export default async function PoolOverviewCards({
  startAt,
  endAt,
  poolId
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
  if (startAt || endAt) {
    const results: PoolStatsResults = await fetcher(
      `${BASE_URL}/apr/api/?poolId=${poolId}&startAt${startAt}&endAt=${endAt}`,
    );

    cardsDetails.push(
      ...[
        { title: "TVL", content: formatTVL(results.average.tvl) },
        {
          title: "veBAL APR",
          content: formatAPR(results.average.apr.breakdown.veBAL),
        },
        ...getDatesDetails(startAt, endAt),
      ],
    );
  } else {
    cardsDetails.push(
      ...[
        { title: "Avg. TVL", content: <AverageTVLCard poolId={poolId} /> },
        {
          title: "Avg. veBAL APR",
          content: <AverageAPRCard poolId={poolId} />,
        },
      ],
    );
  }
  return <OverviewCards cardsDetails={cardsDetails} />;
}
