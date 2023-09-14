import { Suspense } from "react";

import ChartSkelton from "#/app/apr/(components)/(skeleton)/ChartSkelton";
import KpisSkeleton from "#/app/apr/(components)/(skeleton)/KpisSkeleton";
import TableSkeleton from "#/app/apr/(components)/(skeleton)/TableSkeleton";
import PoolOverviewCards from "#/app/apr/pool/(components)/PoolOverviewCards";
import Breadcrumb from "#/app/apr/round/(components)/Breadcrumb";

import HistoricalCharts from "../../(components)/HistoricalCharts";
import PoolTokens from "../../(components)/PoolTokens";
import { YieldWarning } from "../../(components)/YieldWarning";

export default async function Page({
  params: { poolId },
}: {
  params: { poolId: string };
}) {
  return (
    <div className="flex flex-1 h-full w-full flex-col justify-start rounded-3xl text-white gap-y-3">
      <Breadcrumb />
      <Suspense fallback={<KpisSkeleton />}>
        <PoolOverviewCards poolId={poolId} />
      </Suspense>
      <YieldWarning />
      <Suspense fallback={<ChartSkelton />}>
        <HistoricalCharts poolId={poolId} />
      </Suspense>
      <Suspense fallback={<TableSkeleton colNumbers={2} />}>
        <PoolTokens poolId={poolId} />
      </Suspense>
    </div>
  );
}
