import { Suspense } from "react";

import { Spinner } from "#/components/Spinner";

import getFilteredApiUrl from "../../(utils)/getFilteredApiUrl";
import Breadcrumb from "../(components)/Breadcrumb";
import PoolTableWrapper from "../(components)/PoolTableWrapper";
import RoundOverviewCards from "../(components)/RoundOverviewCards";
import TopPoolsChart from "../(components)/TopPoolsChart";

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
  const filteredApiUrl = getFilteredApiUrl(searchParams);
  return (
    <div className="flex flex-1 flex-col gap-y-3">
      <Breadcrumb />
      <Suspense fallback={<Spinner />}>
        <RoundOverviewCards roundId={roundId} />
      </Suspense>
      <Suspense fallback={<Spinner />}>
        <TopPoolsChart roundId={roundId} filteredApiUrl={filteredApiUrl} />
      </Suspense>
      <Suspense fallback={<Spinner />}>
        <PoolTableWrapper roundId={roundId} filteredApiUrl={filteredApiUrl} />
      </Suspense>
    </div>
  );
}
