import { Suspense } from "react";
import Breadcrumb from "./round/(components)/Breadcrumb";
import KpisSkeleton from "./(components)/(skeleton)/KpisSkeleton";
import RoundOverviewCards from "./round/(components)/RoundOverviewCards";
import ChartSkelton from "./(components)/(skeleton)/ChartSkelton";
import TopPoolsChartWrapper from "./round/(components)/TopPoolsChartWrapper";
import TableSkeleton from "./(components)/(skeleton)/TableSkeleton";
import PoolTableWrapper from "./round/(components)/PoolTableWrapper";
import getFilteredRoundApiUrl from "./(utils)/getFilteredApiUrl";
import { parseParamToDate } from "./api/route";

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
  searchParams: SearchParams;
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
      {/*
      <Suspense fallback={<TableSkeleton colNumbers={10} />}>
        <PoolTableWrapper
          roundId={roundId}
          url={getFilteredRoundApiUrl(searchParams, roundId)}
        />
      </Suspense> */}
    </div>
  );
}
