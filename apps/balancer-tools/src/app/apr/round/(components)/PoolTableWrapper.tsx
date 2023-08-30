import { fetcher } from "#/utils/fetcher";

import { BASE_URL, PoolStatsResults } from "../../api/route";
import { PoolListTable } from "./PoolListTable";

export default async function PoolTableWrapper({
  roundId,
}: {
  roundId: string;
}) {
  const initialData = await fetcher<PoolStatsResults>(
    `${BASE_URL}/apr/api/?roundId=${roundId}&sort=apr&limit=10&order=desc&minTvl=1000`,
  );
  return <PoolListTable roundId={roundId} initialData={initialData} />;
}
