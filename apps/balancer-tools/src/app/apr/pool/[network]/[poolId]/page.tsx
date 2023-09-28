import { redirect } from "next/navigation";
import { Suspense } from "react";

import ChartSkelton from "#/app/apr/(components)/(skeleton)/ChartSkelton";
import KpisSkeleton from "#/app/apr/(components)/(skeleton)/KpisSkeleton";
import { formatDateToMMDDYYYY } from "#/app/apr/api/(utils)/date";
import { QueryParamsPagesSchema } from "#/app/apr/api/(utils)/validate";
import { SearchParams } from "#/app/apr/page";
import Breadcrumb from "#/app/apr/round/(components)/Breadcrumb";
import { Pool } from "#/lib/balancer/gauges";

import HistoricalCharts from "../../(components)/HistoricalCharts";
import PoolOverviewCards from "../../(components)/PoolOverviewCards";

export default async function Page({
  params: { poolId, network },
  searchParams,
}: {
  searchParams: SearchParams;
  params: { poolId: string; network: string };
}) {
  const parsedParams = QueryParamsPagesSchema.safeParse(searchParams);
  if (!parsedParams.success) {
    const currentDateFormated = formatDateToMMDDYYYY(new Date());
    const OneWeekAgoDateFormated = formatDateToMMDDYYYY(
      new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
    );
    return redirect(
      `/apr/?startAt=${currentDateFormated}&endAt=${OneWeekAgoDateFormated}&`,
    );
  }
  const { startAt: startAtDate, endAt: endAtDate } = parsedParams.data;
  if (!startAtDate || !endAtDate) {
    return redirect("/apr/");
  }
  if (startAtDate < new Date(new Pool(poolId).gauge.addedTimestamp * 1000)) {
    const paramsObject = Object.fromEntries(
      Object.entries(searchParams).map(
        ([key, value]) => [key, String(value)] as [string, string],
      ),
    );
    const params = new URLSearchParams(paramsObject).toString();

    return redirect(`/apr/pool/${network}/${poolId}/error?${params}&`);
  }
  return (
    <div className="flex flex-1 h-full w-full flex-col justify-start rounded-3xl text-white gap-y-3 mb-4">
      <Breadcrumb />
      <Suspense fallback={<KpisSkeleton />}>
        <PoolOverviewCards
          startAt={startAtDate}
          endAt={endAtDate}
          poolId={poolId}
        />
      </Suspense>
      <Suspense fallback={<ChartSkelton />}>
        <HistoricalCharts
          poolId={poolId}
          startAt={startAtDate}
          endAt={endAtDate}
        />
      </Suspense>
    </div>
  );
}
