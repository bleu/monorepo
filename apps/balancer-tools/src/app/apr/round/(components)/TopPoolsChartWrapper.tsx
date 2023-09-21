import { fetcher } from "#/utils/fetcher";

import { PoolStatsResults } from "../../api/route";
import TopPoolsChart from "./TopPoolsChart";

export default async function TopPoolsChartWrapper({
  roundId,
  url,
}: {
  roundId: string;
  url: string;
}) {
  const topAprApi = await fetcher<PoolStatsResults>(url);

  return <TopPoolsChart roundId={roundId} ApiResult={topAprApi} />;
}
