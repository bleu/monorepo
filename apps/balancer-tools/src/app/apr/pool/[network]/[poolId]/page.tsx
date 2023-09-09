import { Suspense } from "react";

import ChartSkelton from "#/app/apr/(components)/(skeleton)/ChartSkelton";
import KpiSkeleton from "#/app/apr/(components)/(skeleton)/KpiSkeleton";
import PoolTableSkeleton from "#/app/apr/(components)/(skeleton)/PoolTableSkeleton";
import HistoricalAPRChart from "#/app/apr/pool/(components)/HistoricalAPRChart";
import PoolOverviewCards from "#/app/apr/pool/(components)/PoolOverviewCards";
import Breadcrumb from "#/app/apr/round/(components)/Breadcrumb";

import PoolTokens from "../../(components)/PoolTokens";

export default async function Page({
  params: { poolId },
}: {
  params: { poolId: string };
}) {
  return (
    <div className="flex flex-1 h-full w-full flex-col justify-start rounded-3xl text-white gap-y-3">
      <Breadcrumb />
      <Suspense fallback={<KpiSkeleton />}>
        <PoolOverviewCards poolId={poolId} />
      </Suspense>
      <Suspense fallback={<ChartSkelton />}>
        <HistoricalAPRChart poolId={poolId} />
      </Suspense>
      <Suspense fallback={<PoolTableSkeleton />}>
        <PoolTokens poolId={poolId} />
      </Suspense>
    </div>
  );
}
