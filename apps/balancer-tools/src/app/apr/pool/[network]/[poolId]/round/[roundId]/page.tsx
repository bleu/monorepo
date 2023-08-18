import { Suspense } from "react";

import HistoricalAPRChart from "#/app/apr/pool/(components)/HistoricalAPRChart";
import PoolOverviewCards from "#/app/apr/pool/(components)/PoolOverviewCards";

export default async function Page({
  params,
}: {
  params: { poolId: string; roundId: string };
}) {
  const { roundId, poolId } = params;
  return (
    <div className="flex h-full w-full flex-col justify-start rounded-3xl text-white gap-y-3">
      <Suspense
        fallback={<Spinner />}
      >
        <PoolOverviewCards roundId={roundId} poolId={poolId} />
      </Suspense>
      <Suspense
        fallback={<Spinner />}
      >
        <HistoricalAPRChart roundId={roundId} poolId={poolId} />
      </Suspense>
    </div>
  );
}
