import { fetcher } from "#/utils/fetcher";

import { PoolStatsResults } from "../../api/route";
import { PoolListTable } from "./PoolListTable";

export default async function PoolTableWrapper({
  roundId,
  filteredApiUrl,
}: {
  roundId: string;
  filteredApiUrl: string;
}) {
  const initialData = await fetcher<PoolStatsResults>(filteredApiUrl);
  return <PoolListTable roundId={roundId} initialData={initialData.perRound} />;
}
