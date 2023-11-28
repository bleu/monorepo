import { fetcher } from "@bleu-fi/utils/fetcher";

import { PoolStatsResults } from "../api/route";
import TopPoolsChart from "./TopPoolsChart";

export default async function TopPoolsChartWrapper({
  url,
  startAt,
  endAt,
}: {
  url: string;
  startAt: Date;
  endAt: Date;
}) {
  const topAprApi = await fetcher<PoolStatsResults>(url);

  return (
    <TopPoolsChart startAt={startAt} endAt={endAt} ApiResult={topAprApi} />
  );
}
