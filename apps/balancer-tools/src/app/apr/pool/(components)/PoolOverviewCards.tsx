import { fetcher } from "#/utils/fetcher";
import { formatNumber } from "#/utils/formatNumber";

import OverviewCards, {
  getRoundDetails,
} from "../../(components)/OverviewCards";
import { calculatePoolStats } from "../../(utils)/calculatePoolStats";
import { PoolStatsResults } from "../../api/route";

async function AverageTVLCard({ poolId }: { poolId: string }) {
  const data: PoolStatsResults = await fetcher(
    `${process.env.NEXT_PUBLIC_SITE_URL}/apr/api/?poolId=${poolId}`,
  );
  return <div>{formatNumber(data.average.tvl)}</div>;
}

async function AverageAPRCard({ poolId }: { poolId: string }) {
  const data: PoolStatsResults = await fetcher(
    `${process.env.NEXT_PUBLIC_SITE_URL}/apr/api/?poolId=${poolId}`,
  );
  return <div>{formatNumber(data.average.apr).concat("%")}</div>;
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
        { title: "TVL", content: formatNumber(tvl) },
        { title: "APR", content: formatNumber(apr).concat("%") },
        ...getRoundDetails(roundId),
      ],
    );
  } else {
    cardsDetails.push(
      ...[
        { title: "Avg. TVL", content: <AverageTVLCard poolId={poolId} /> },
        { title: "Avg. APR", content: <AverageAPRCard poolId={poolId} /> },
      ],
    );
  }
  return <OverviewCards cardsDetails={cardsDetails} />;
}
