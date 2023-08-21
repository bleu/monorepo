import { formatDate } from "@bleu-balancer-tools/utils";

import { formatNumber } from "#/utils/formatNumber";

import OverviewCards from "../../(components)/OverviewCards";
import { calculatePoolStats } from "../../(utils)/calculatePoolStats";
import {
  generatePromisesForHistoricalPoolData,
  HistoricalDataEntry,
} from "../../(utils)/getHistoricalDataForPool";
import { Round } from "../../(utils)/rounds";

async function AverageTVLCard({ poolId }: { poolId: string }) {
  const data = await generatePromisesForHistoricalPoolData(poolId);
  const totalTvl = data.reduce(
    (sum: number, entry: HistoricalDataEntry) => sum + entry.tvl,
    0,
  );
  return <div>{formatNumber(totalTvl / data.length)}</div>;
}

async function AverageAPRCard({ poolId }: { poolId: string }) {
  const data = await generatePromisesForHistoricalPoolData(poolId);
  const totalAPR = data.reduce(
    (sum: number, entry: HistoricalDataEntry) => sum + entry.apr,
    0,
  );
  return <div>{formatNumber(totalAPR / data.length).concat("%")}</div>;
}

export default async function PoolOverviewCards({
  roundId,
  poolId,
}: {
  roundId: string;
  poolId: string;
}) {
  const { apr, tvl } = await calculatePoolStats({ poolId, roundId });
  const round = Round.getRoundByNumber(roundId);
  const cardsDetails = [
    { title: "TVL", content: formatNumber(tvl) },
    { title: "APR", content: formatNumber(apr).concat("%") },
    { title: "Round Number", content: roundId },
    { title: "Round Ended", content: formatDate(round.endDate) },
  ];
  return <OverviewCards cardsDetails={cardsDetails} />;
}
