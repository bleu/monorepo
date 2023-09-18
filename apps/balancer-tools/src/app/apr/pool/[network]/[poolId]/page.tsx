import { Suspense } from "react";

import KpisSkeleton from "#/app/apr/(components)/(skeleton)/KpisSkeleton";
import { parseParamToDate } from "#/app/apr/api/route";
import Breadcrumb from "#/app/apr/round/(components)/Breadcrumb";

import PoolOverviewCards from "../../(components)/PoolOverviewCards";
import { YieldWarning } from "../../(components)/YieldWarning";
import ChartSkelton from "#/app/apr/(components)/(skeleton)/ChartSkelton";
import HistoricalCharts from "../../(components)/HistoricalCharts";
import TableSkeleton from "#/app/apr/(components)/(skeleton)/TableSkeleton";
import PoolTokens from "../../(components)/PoolTokens";

export default async function Page({
  params: {poolId},
  searchParams: { startAt, endAt },
}: {
  searchParams: { startAt: string; endAt: string };
  params: {poolId: string}
}) {
  const startAtDate = parseParamToDate(startAt);
  const endAtDate = parseParamToDate(endAt);

  return (
    <div className="flex flex-1 h-full w-full flex-col justify-start rounded-3xl text-white gap-y-3">
      <Breadcrumb />
      <Suspense fallback={<KpisSkeleton />}>
        <PoolOverviewCards startAt={startAtDate} endAt={endAtDate} poolId={poolId} />
      </Suspense>
      <YieldWarning />
      <Suspense fallback={<ChartSkelton />}>
        <HistoricalCharts startAt={startAtDate} endAt={endAtDate} />
      </Suspense>
      <Suspense fallback={<TableSkeleton colNumbers={2} />}>
        <PoolTokens startAt={startAtDate} endAt={endAtDate} poolId={poolId} />
      </Suspense>
    </div>
  );
}
