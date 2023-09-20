import { redirect } from "next/navigation";
import { Suspense } from "react";

import ChartSkelton from "#/app/apr/(components)/(skeleton)/ChartSkelton";
import KpisSkeleton from "#/app/apr/(components)/(skeleton)/KpisSkeleton";
import TableSkeleton from "#/app/apr/(components)/(skeleton)/TableSkeleton";
import { QueryParamsPagesSchema } from "#/app/apr/api/(utils)/validate";
import { SearchParams } from "#/app/apr/page";
import Breadcrumb from "#/app/apr/round/(components)/Breadcrumb";

import HistoricalCharts from "../../(components)/HistoricalCharts";
import PoolOverviewCards from "../../(components)/PoolOverviewCards";
import PoolTokens from "../../(components)/PoolTokens";
import { YieldWarning } from "../../(components)/YieldWarning";

export default async function Page({
  params: { poolId },
  searchParams,
}: {
  searchParams: SearchParams;
  params: { poolId: string };
}) {
  const parsedParams = QueryParamsPagesSchema.safeParse(searchParams);
  if (!parsedParams.success) {
    return redirect("/apr/");
  }
  const { startAt: startAtDate, endAt: endAtDate } = parsedParams.data;
  if (!startAtDate || !endAtDate) {
    return redirect("/apr/");
  }

  return (
    <div className="flex flex-1 h-full w-full flex-col justify-start rounded-3xl text-white gap-y-3">
      <Breadcrumb />
      <Suspense fallback={<KpisSkeleton />}>
        <PoolOverviewCards
          startAt={startAtDate}
          endAt={endAtDate}
          poolId={poolId}
        />
      </Suspense>
      <YieldWarning />
      <Suspense fallback={<ChartSkelton />}>
        <HistoricalCharts
          poolId={poolId}
          startAt={startAtDate}
          endAt={endAtDate}
        />
      </Suspense>
      <Suspense fallback={<TableSkeleton colNumbers={2} />}>
        <PoolTokens startAt={startAtDate} endAt={endAtDate} poolId={poolId} />
      </Suspense>
    </div>
  );
}
