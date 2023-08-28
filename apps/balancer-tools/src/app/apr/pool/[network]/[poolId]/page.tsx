import { Suspense } from "react";

import HistoricalAPRChart from "#/app/apr/pool/(components)/HistoricalAPRChart";
import PoolOverviewCards from "#/app/apr/pool/(components)/PoolOverviewCards";
import Breadcrumb from "#/app/apr/round/(components)/Breadcrumb";
import { Spinner } from "#/components/Spinner";

export default async function Page({
  params: { roundId, network, poolId },
}: {
  params: { roundId: string; poolId: string; network: string };
}) {
  return (
    <div className="flex flex-1 h-full w-full flex-col justify-start rounded-3xl text-white gap-y-3">
      <Breadcrumb network={network} poolId={poolId} roundId={roundId} />
      <Suspense fallback={<Spinner />}>
        <PoolOverviewCards poolId={poolId} />
      </Suspense>
      <Suspense fallback={<Spinner />}>
        <HistoricalAPRChart poolId={poolId} />
      </Suspense>
    </div>
  );
}
