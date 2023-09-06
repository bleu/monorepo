import { Suspense } from "react";

import { Spinner } from "#/components/Spinner";

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
      <Suspense fallback={<Spinner />}>
        <RoundOverviewCards roundId={roundId} />
      </Suspense>
      <Suspense fallback={<Spinner />}>
        <TopPoolsChartWrapper roundId={roundId} />
      </Suspense>
      <Suspense fallback={<Spinner />}>
        <PoolTableWrapper
          roundId={roundId}
          url={getFilteredRoundApiUrl(searchParams, roundId)}
        />
      </Suspense>
    </div>
  );
}
