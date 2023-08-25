import { fetcher } from "#/utils/fetcher";

import { PoolStatsResults } from "../../api/route";
import { PoolListTable } from "./PoolListTable";

export default async function PoolTableWrapper({
  roundId,
}: {
  roundId: string;
}) {
  const initialData = await fetcher<PoolStatsResults>(
    `${process.env.NEXT_PUBLIC_SITE_URL}/apr/api/?roundid=${roundId}&sort=apr&limit=10&order=desc&minTvl=1000`,
  );
  return <PoolListTable roundId={roundId} initialData={initialData} />;
}
