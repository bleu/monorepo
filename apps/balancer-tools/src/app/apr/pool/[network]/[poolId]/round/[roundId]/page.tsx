import { Suspense } from "react";

import ChartSkelton from "#/app/apr/(components)/(skeleton)/ChartSkelton";
import KpisSkeleton from "#/app/apr/(components)/(skeleton)/KpisSkeleton";
import TableSkeleton from "#/app/apr/(components)/(skeleton)/TableSkeleton";
import HistoricalCharts from "#/app/apr/pool/(components)/HistoricalCharts";
import PoolOverviewCards from "#/app/apr/pool/(components)/PoolOverviewCards";
import PoolTokens from "#/app/apr/pool/(components)/PoolTokens";
import { YieldWarning } from "#/app/apr/pool/(components)/YieldWarning";
import Breadcrumb from "#/app/apr/round/(components)/Breadcrumb";

export default async function Page({
  params: { roundId, poolId },
}: {
  params: { roundId: string; poolId: string };
}) {
  return (
    <div className="flex flex-1 h-full w-full flex-col justify-start rounded-3xl text-white gap-y-3">
      <Breadcrumb />
      <Suspense fallback={<KpisSkeleton />}>
        <PoolOverviewCards roundId={roundId} poolId={poolId} />
      </Suspense>
      <YieldWarning />
      <Suspense fallback={<ChartSkelton />}>
        <HistoricalCharts roundId={roundId} poolId={poolId} />
      </Suspense>
      <Suspense fallback={<TableSkeleton colNumbers={2} />}>
        <PoolTokens poolId={poolId} roundId={roundId} />
      </Suspense>
    </div>
  );
}
