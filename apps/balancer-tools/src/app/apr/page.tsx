import { redirect } from "next/navigation";
import { Suspense } from "react";

import ChartSkelton from "./(components)/(skeleton)/ChartSkelton";
import KpisSkeleton from "./(components)/(skeleton)/KpisSkeleton";
import TableSkeleton from "./(components)/(skeleton)/TableSkeleton";
import getFilteredDateApiUrl from "./(utils)/getFilteredApiUrl";
import { formatDateToMMDDYYYY, SECONDS_IN_DAY } from "./api/(utils)/date";
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

export default function Page({ searchParams }: { searchParams: SearchParams }) {
  const parsedParams = QueryParamsPagesSchema.safeParse(searchParams);
  if (!parsedParams.success) {
    const currentDateFormated = formatDateToMMDDYYYY(new Date());
    const threeDaysAgoDateFormated = formatDateToMMDDYYYY(
      new Date(new Date().getTime() - 3 * SECONDS_IN_DAY * 1000),
    );
    return redirect(
      `/apr/?startAt=${threeDaysAgoDateFormated}&endAt=${currentDateFormated}&`,
    );
  }
  const { startAt: startAtDate, endAt: endAtDate } = parsedParams.data;
  if (!startAtDate || !endAtDate) {
    return redirect("/apr/");
  }

  const url = getFilteredDateApiUrl(startAtDate, endAtDate, searchParams);

  return (
    <div className="flex flex-1 flex-col gap-y-3">
      <Breadcrumb />
      <Suspense fallback={<KpisSkeleton />}>
        <RoundOverviewCards startAt={startAtDate} endAt={endAtDate} />
      </Suspense>

      <Suspense fallback={<ChartSkelton />}>
        <TopPoolsChartWrapper
          startAt={startAtDate}
          endAt={endAtDate}
          url={url}
        />
      </Suspense>
      <Suspense fallback={<TableSkeleton colNumbers={10} />}>
        <PoolTableWrapper startAt={startAtDate} endAt={endAtDate} url={url} />
      </Suspense>
    </div>
  );
}
