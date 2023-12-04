import { SECONDS_IN_DAY } from "@bleu-fi/utils/date";
import { redirect } from "next/navigation";

import Breadcrumb from "./(components)/Breadcrumb";
import HomeOverviewCards from "./(components)/HomeOverviewCards";
import { PoolListTable } from "./(components)/PoolListTable";
import TopPoolsChart from "./(components)/TopPoolsChart";
import { fetchDataForDateRange } from "./(utils)/fetchForDateRange";
import { generatePoolPageLink } from "./(utils)/getFilteredUrl";
import { QueryParamsPagesSchema } from "./(utils)/validate";

export interface SearchParams {
  minTvl?: string;
  maxTvl?: string;
  minApr?: string;
  maxApr?: string;
  tokens?: string;
  type?: string;
  network?: string;
}

export const maxDuration = 300;

export const revalidate = SECONDS_IN_DAY;
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

  const { poolAverage: poolAvgForTable } = await fetchDataForDateRange({
    startDate,
    endDate,
    ...searchParams,
    filteredTokens: searchParams.tokens?.split(","),
  });

  const { poolAverage: poolAvgForChart } = await fetchDataForDateRange({
    startDate,
    endDate,
  });

  return (
    <div className="flex flex-1 flex-col gap-y-3">
      <Breadcrumb />
      <HomeOverviewCards startAt={startDate} endAt={endDate} />
      <TopPoolsChart
        startAt={startDate}
        endAt={endDate}
        poolsData={poolAvgForChart}
      />
      <PoolListTable
        startAt={startDate}
        endAt={endDate}
        initialData={poolAvgForTable}
      />
    </div>
  );
}
