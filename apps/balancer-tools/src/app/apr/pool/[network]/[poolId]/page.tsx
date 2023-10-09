import { redirect } from "next/navigation";
import { Suspense } from "react";

import ChartSkelton from "#/app/apr/(components)/(skeleton)/ChartSkelton";
import KpisSkeleton from "#/app/apr/(components)/(skeleton)/KpisSkeleton";
import { generatePoolPageLink } from "#/app/apr/(utils)/getFilteredApiUrl";
import { SECONDS_IN_DAY } from "#/app/apr/api/(utils)/date";
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
    const currentDateFormated = new Date();
    const threeDaysAgoDateFormated = new Date(
      new Date().getTime() - 3 * SECONDS_IN_DAY * 1000,
    );
    return redirect(
      generatePoolPageLink(
        threeDaysAgoDateFormated,
        currentDateFormated,
        searchParams,
      ),
    );
  }
  const { startAt: startAtDate, endAt: endAtDate } = parsedParams.data;
  if (!startAtDate || !endAtDate) {
    return redirect("/apr/");
  }
  if (startAtDate < new Date(new Pool(poolId).createdAt * 1000)) {
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
