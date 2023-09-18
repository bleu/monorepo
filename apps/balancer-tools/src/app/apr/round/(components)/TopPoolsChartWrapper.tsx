import { fetcher } from "#/utils/fetcher";

import getFilteredRoundApiUrl from "../../(utils)/getFilteredApiUrl";
import { PoolStatsResults } from "../../api/route";
import TopPoolsChart from "./TopPoolsChart";

export default async function TopPoolsChartWrapper({
  startAt,
  endAt,
}: {
  startAt: Date;
  endAt: Date;
}) {
  const topAprApi = await fetcher<PoolStatsResults>(
    getFilteredRoundApiUrl({}, startAt, endAt),
  );

  return (
    <TopPoolsChart startAt={startAt} endAt={endAt} ApiResult={topAprApi} />
  );
}
