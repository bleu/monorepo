import { fetcher } from "#/utils/fetcher";

import OverviewCards, {
  getRoundDetails,
} from "../../(components)/OverviewCards";
import { formatAPR, formatTVL } from "../../(utils)/formatPoolStats";
import { BASE_URL } from "../../(utils)/types";
import { PoolStatsResults } from "../../api/route";

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
  roundId,
  poolId,
}: {
  roundId?: string;
  poolId: string;
}) {
  const cardsDetails: {
    title: string;
    content: JSX.Element | string;
    tooltip?: string;
  }[] = [];
  if (roundId) {
    const results: PoolStatsResults = await fetcher(
      `${BASE_URL}/apr/api/?poolId=${poolId}&sort=roundId`,
    );

    cardsDetails.push(
      ...[
        { title: "TVL", content: formatTVL(results.average.tvl) },
        {
          title: "veBAL APR",
          content: formatAPR(results.average.apr.breakdown.veBAL),
        },
        ...getRoundDetails(roundId),
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
