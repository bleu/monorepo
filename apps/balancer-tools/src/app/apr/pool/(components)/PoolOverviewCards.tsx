import { fetcher } from "#/utils/fetcher";

import OverviewCards, {
  getRoundDetails,
} from "../../(components)/OverviewCards";
import { calculatePoolStats } from "../../(utils)/calculatePoolStats";
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
  return <div>{formatAPR(data.average.apr)}</div>;
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
    const { apr, tvl } = await calculatePoolStats({ poolId, roundId });

    cardsDetails.push(
      ...[
        { title: "TVL", content: formatTVL(tvl) },
        { title: "veBAL APR", content: formatAPR(apr) },
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
