import React from "react";

import { fetcher } from "#/utils/fetcher";

import { RoundStatsResults } from "../../api/route";
import { PoolListTable } from "./PoolListTable";

export default async function PoolTableWrapper({
  roundId,
}: {
  roundId: string;
}) {
  const initialData: RoundStatsResults = await fetcher(
    `${process.env.NEXT_PUBLIC_SITE_URL}/apr/api/?roundid=${roundId}&sort=apr&limit=10`,
  );
  return <PoolListTable roundId={roundId} initialData={initialData} />;
}
