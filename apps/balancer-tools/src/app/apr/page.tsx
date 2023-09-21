import { redirect } from "next/navigation";
import { Suspense } from "react";

import ChartSkelton from "./(components)/(skeleton)/ChartSkelton";
import KpisSkeleton from "./(components)/(skeleton)/KpisSkeleton";
import TableSkeleton from "./(components)/(skeleton)/TableSkeleton";
import getFilteredRoundApiUrl from "./(utils)/getFilteredApiUrl";
import { formatDateToMMDDYYYY } from "./api/(utils)/date";
import { QueryParamsPagesSchema } from "./api/(utils)/validate";
import Breadcrumb from "./round/(components)/Breadcrumb";
import PoolTableWrapper from "./round/(components)/PoolTableWrapper";
import RoundOverviewCards from "./round/(components)/RoundOverviewCards";
import TopPoolsChartWrapper from "./round/(components)/TopPoolsChartWrapper";

export interface SearchParams {
  minTVL?: string;
  maxTVL?: string;
  minAPR?: string;
  maxAPR?: string;
  tokens?: string;
  type?: string;
  network?: string;
}

export default function Page({
  searchParams,
}: {
  params: { roundId: string };
  searchParams: SearchParams;
}) {
  const parsedParams = QueryParamsPagesSchema.safeParse(searchParams);
  if (!parsedParams.success) {
    const currentDateFormated = formatDateToMMDDYYYY(new Date());
    const OneWeekAgoDateFormated = formatDateToMMDDYYYY(
      new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
    );
    return redirect(
      `/apr/?startAt=${OneWeekAgoDateFormated}&endAt=${currentDateFormated}&`,
    );
  }
  const { startAt: startAtDate, endAt: endAtDate } = parsedParams.data;
  if (!startAtDate || !endAtDate) {
    return redirect("/apr/");
  }

  const url = getFilteredRoundApiUrl(searchParams, startAtDate, endAtDate);

  return (
    <div className="flex flex-1 flex-col gap-y-3">
      <Breadcrumb />
      <Suspense fallback={<KpisSkeleton />}>
        <RoundOverviewCards startAt={startAtDate} endAt={endAtDate} />
      </Suspense>

      <Suspense fallback={<ChartSkelton />}>
        <TopPoolsChartWrapper startAt={startAtDate} endAt={endAtDate} url={url}/>
      </Suspense>
      <Suspense fallback={<TableSkeleton colNumbers={10} />}>
        <PoolTableWrapper startAt={startAtDate} endAt={endAtDate} url={url}/>
      </Suspense>
    </div>
  );
}
