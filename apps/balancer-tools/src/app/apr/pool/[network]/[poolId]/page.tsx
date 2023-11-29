import { Pool } from "@bleu-fi/balancer-apr/src/lib/balancer/gauges";
import { SECONDS_IN_DAY } from "@bleu-fi/utils/date";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import ChartSkelton from "#/app/apr/(components)/(skeleton)/ChartSkelton";
import KpisSkeleton from "#/app/apr/(components)/(skeleton)/KpisSkeleton";
import Breadcrumb from "#/app/apr/(components)/Breadcrumb";
import { fetchDataForPoolIdDateRange } from "#/app/apr/(utils)/fetchDataForPoolIdDateRange";
import { generatePoolPageLink } from "#/app/apr/(utils)/getFilteredApiUrl";
import { QueryParamsPagesSchema } from "#/app/apr/(utils)/validate";
import { SearchParams } from "#/app/apr/page";

import HistoricalCharts from "../../(components)/HistoricalCharts";
import PoolOverviewCards from "../../(components)/PoolOverviewCards";

export const revalidate = SECONDS_IN_DAY;
export default async function Page({
  params: { poolId, network },
  searchParams,
}: {
  searchParams: SearchParams;
  params: { poolId: string; network: string };
}) {
  const parsedParams = QueryParamsPagesSchema.safeParse(searchParams);
  if (!parsedParams.success) {
    const oneDayAgoFormated = new Date(
      new Date().getTime() - SECONDS_IN_DAY * 1000,
    );
    const threeDaysAgoDateFormated = new Date(
      new Date().getTime() - 3 * SECONDS_IN_DAY * 1000,
    );
    return redirect(
      generatePoolPageLink(
        threeDaysAgoDateFormated,
        oneDayAgoFormated,
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

  const poolData = await fetchDataForPoolIdDateRange(
    poolId,
    startAtDate,
    endAtDate,
  );

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
        <HistoricalCharts results={poolData} />
      </Suspense>
    </div>
  );
}
