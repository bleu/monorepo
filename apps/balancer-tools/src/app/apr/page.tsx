import { SECONDS_IN_DAY } from "@bleu-fi/utils/date";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import ChartSkelton from "./(components)/(skeleton)/ChartSkelton";
import KpisSkeleton from "./(components)/(skeleton)/KpisSkeleton";
import TableSkeleton from "./(components)/(skeleton)/TableSkeleton";
import Breadcrumb from "./(components)/Breadcrumb";
import HomeOverviewCards from "./(components)/HomeOverviewCards";
import PoolListTableWrapper from "./(components)/PoolListTableWrapper";
import TopPoolsChartWrapper from "./(components)/TopPoolsChartWrapper";
import { generatePoolPageLink } from "./(utils)/getFilteredUrl";
import { QueryParamsPagesSchema } from "./(utils)/validate";

export interface SearchParams {
  minTvl?: string;
  maxTvl?: string;
  minApr?: string;
  maxApr?: string;
  tokens?: string;
  types?: string;
  network?: string;
}

export const revalidate = 86_400;

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const parsedParams = QueryParamsPagesSchema.safeParse(searchParams);
  if (!parsedParams.success) {
    const oneDayAgoFormated = new Date(
      new Date().getTime() - SECONDS_IN_DAY * 1000,
    );
    const fourDaysAgoDateFormated = new Date(
      new Date().getTime() - 4 * SECONDS_IN_DAY * 1000,
    );
    return redirect(
      generatePoolPageLink(
        fourDaysAgoDateFormated,
        oneDayAgoFormated,
        searchParams,
      ),
    );
  }
  const { startAt: startDate, endAt: endDate } = parsedParams.data;
  if (!startDate || !endDate) {
    return redirect("/apr/");
  }

  return (
    <div className="flex flex-1 flex-col gap-y-3">
      <Breadcrumb />
      <Suspense fallback={<KpisSkeleton />}>
        <HomeOverviewCards startDate={startDate} endDate={endDate} />
      </Suspense>
      <Suspense fallback={<ChartSkelton />}>
        <TopPoolsChartWrapper startDate={startDate} endDate={endDate} />
      </Suspense>
      <Suspense fallback={<TableSkeleton />}>
        <PoolListTableWrapper
          startDate={startDate}
          endDate={endDate}
          searchParams={searchParams}
        />
      </Suspense>
    </div>
  );
}
