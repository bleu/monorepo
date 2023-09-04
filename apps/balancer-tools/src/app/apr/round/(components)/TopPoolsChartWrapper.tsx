import { fetcher } from "#/utils/fetcher";

import { PoolStatsResults } from "../../api/route";
import TopPoolsChart from "./TopPoolsChart";

export default async function TopPoolsChartWrapper({
  roundId,
  filteredApiUrl,
}: {
  roundId: string;
  filteredApiUrl: string;
}) {
  const topAprApi = await fetcher<PoolStatsResults>(filteredApiUrl);

  return <TopPoolsChart roundId={roundId} ApiResult={topAprApi} />;
}
