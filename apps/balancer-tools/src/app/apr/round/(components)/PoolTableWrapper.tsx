import { fetcher } from "#/utils/fetcher";

import { PoolStatsResults } from "../../api/route";
import { PoolListTable } from "./PoolListTable";

export default async function PoolTableWrapper({
  roundId,
  url,
}: {
  roundId: string;
  url: string;
}) {
  const initialData = await fetcher<PoolStatsResults>(url);

  return <PoolListTable roundId={roundId} initialData={initialData.perRound} />;
}
