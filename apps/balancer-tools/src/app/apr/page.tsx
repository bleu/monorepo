import { Suspense } from "react";

import ChartSkelton from "./(components)/(skeleton)/ChartSkelton";
import KpisSkeleton from "./(components)/(skeleton)/KpisSkeleton";
import TableSkeleton from "./(components)/(skeleton)/TableSkeleton";
import { parseParamToDate } from "./api/route";
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
  searchParams: { startAt, endAt },
}: {
  params: { roundId: string };
  searchParams: {startAt: string, endAt: string };
}) {
  const startAtDate = parseParamToDate(startAt)
  const endAtDate = parseParamToDate(endAt)
  
  return (
    <div className="flex flex-1 flex-col gap-y-3">
       <Breadcrumb />
      <Suspense fallback={<KpisSkeleton />}>
        <RoundOverviewCards startAt={startAtDate} endAt={endAtDate}/>
      </Suspense>
      
      <Suspense fallback={<ChartSkelton />}>
        <TopPoolsChartWrapper startAt={startAtDate} endAt={endAtDate}/>
      </Suspense>
      <Suspense fallback={<TableSkeleton colNumbers={10} />}>
        <PoolTableWrapper startAt={startAtDate} endAt={endAtDate} />
      </Suspense>
    </div>
  );
}
