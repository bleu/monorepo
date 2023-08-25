import { Suspense } from "react";

import HistoricalAPRChart from "#/app/apr/pool/(components)/HistoricalAPRChart";
import PoolOverviewCards from "#/app/apr/pool/(components)/PoolOverviewCards";
import { Spinner } from "#/components/Spinner";

export default async function Page({ params }: { params: { poolId: string } }) {
  const { poolId } = params;
  return (
    <div className="flex h-full w-full flex-col justify-start rounded-3xl text-white gap-y-3">
      <Suspense fallback={<Spinner />}>
        <PoolOverviewCards poolId={poolId} />
      </Suspense>
      <Suspense fallback={<Spinner />}>
        <HistoricalAPRChart poolId={poolId} />
      </Suspense>
    </div>
  );
}
