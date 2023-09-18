import { fetcher } from "#/utils/fetcher";

import getFilteredRoundApiUrl from "../../(utils)/getFilteredApiUrl";
import { PoolStatsResults } from "../../api/route";
import { PoolListTable } from "./PoolListTable";

export default async function PoolTableWrapper({
  startAt,
  endAt,
}: {
  startAt: Date;
  endAt: Date;
}) {
  const initialData = await fetcher<PoolStatsResults>(
    getFilteredRoundApiUrl({}, startAt, endAt),
  );
  
  return <PoolListTable startAt={startAt} endAt={endAt} initialData={initialData.perDay} />;
}
