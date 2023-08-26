import { formatDate } from "@bleu-balancer-tools/utils";

import { fetcher } from "#/utils/fetcher";
import { formatNumber } from "#/utils/formatNumber";

import OverviewCards from "../../(components)/OverviewCards";
import { calculatePoolStats } from "../../(utils)/calculatePoolStats";
import { Round } from "../../(utils)/rounds";
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
  const cardsDetails: { title: string; content: JSX.Element | string }[] = [];
  if (roundId) {
    const { apr, tvl } = await calculatePoolStats({ poolId, roundId });
    const round = Round.getRoundByNumber(roundId);
    cardsDetails.push(
      ...[
        { title: "TVL", content: formatNumber(tvl) },
        { title: "APR", content: formatNumber(apr).concat("%") },
        { title: "Round Number", content: roundId },
        { title: "Round Ended", content: formatDate(round.endDate) },
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
