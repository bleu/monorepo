import { fetcher } from "@bleu-fi/utils/fetcher";

import { PoolStatsResults } from "../api/route";
import { PoolListTable } from "./PoolListTable";

export default async function PoolTableWrapper({
  startAt,
  endAt,
  url,
}: {
  startAt: Date;
  endAt: Date;
  url: string;
}) {
  const initialData = await fetcher<PoolStatsResults>(url);

  return (
    <PoolListTable
      startAt={startAt}
      endAt={endAt}
      initialData={initialData.average.poolAverage}
    />
  );
}
