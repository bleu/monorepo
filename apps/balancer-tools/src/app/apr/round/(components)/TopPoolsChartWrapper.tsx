import { fetcher } from "#/utils/fetcher";

import getFilteredRoundApiUrl from "../../(utils)/getFilteredApiUrl";
import { PoolStatsResults } from "../../api/route";
import TopPoolsChart from "./TopPoolsChart";

export default async function TopPoolsChartWrapper({
  roundId,
}: {
  roundId: string;
}) {
  const topAprApi = await fetcher<PoolStatsResults>(
    getFilteredRoundApiUrl({}, roundId),
  );

  return <TopPoolsChart roundId={roundId} ApiResult={topAprApi} />;
}
