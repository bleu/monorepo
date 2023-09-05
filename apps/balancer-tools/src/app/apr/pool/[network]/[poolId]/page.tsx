import { Suspense } from "react";

import PoolOverviewCards from "#/app/apr/pool/(components)/PoolOverviewCards";
import Breadcrumb from "#/app/apr/round/(components)/Breadcrumb";
import { Spinner } from "#/components/Spinner";

import HistoricalCharts from "../../(components)/HistoricalCharts";
import PoolTokens from "../../(components)/PoolTokens";

export default async function Page({
  params: { poolId },
}: {
  params: { poolId: string };
}) {
  return (
    <div className="flex flex-1 h-full w-full flex-col justify-start rounded-3xl text-white gap-y-3">
      <Breadcrumb />
      <Suspense fallback={<Spinner />}>
        <PoolOverviewCards poolId={poolId} />
      </Suspense>
      <HistoricalCharts poolId={poolId} />
      <Suspense fallback={<Spinner />}>
        <PoolTokens poolId={poolId} />
      </Suspense>
    </div>
  );
}
