import { Suspense } from "react";

import ChartSkelton from "../../(components)/(skeleton)/ChartSkelton";
import KpisSkeleton from "../../(components)/(skeleton)/KpisSkeleton";
import TableSkeleton from "../../(components)/(skeleton)/TableSkeleton";
import getFilteredRoundApiUrl from "../../(utils)/getFilteredApiUrl";
import Breadcrumb from "../(components)/Breadcrumb";
import PoolTableWrapper from "../(components)/PoolTableWrapper";
import RoundOverviewCards from "../(components)/RoundOverviewCards";
import TopPoolsChartWrapper from "../(components)/TopPoolsChartWrapper";

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
  params: { roundId },
  searchParams,
}: {
  params: { roundId: string };
  searchParams: SearchParams;
}) {
  return (
    <div className="flex flex-1 flex-col gap-y-3">
      <Breadcrumb />
      <Suspense fallback={<KpisSkeleton />}>
        <RoundOverviewCards roundId={roundId} />
      </Suspense>
      <Suspense fallback={<ChartSkelton />}>
        <TopPoolsChartWrapper roundId={roundId} />
      </Suspense>
      <Suspense fallback={<TableSkeleton colNumbers={10} />}>
        <PoolTableWrapper
          roundId={roundId}
          url={getFilteredRoundApiUrl(searchParams, roundId)}
        />
      </Suspense>
    </div>
  );
}
