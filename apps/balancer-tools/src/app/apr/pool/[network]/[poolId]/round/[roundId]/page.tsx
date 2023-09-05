import { Suspense } from "react";

import HistoricalCharts from "#/app/apr/pool/(components)/HistoricalCharts";
import PoolOverviewCards from "#/app/apr/pool/(components)/PoolOverviewCards";
import PoolTokens from "#/app/apr/pool/(components)/PoolTokens";
import Breadcrumb from "#/app/apr/round/(components)/Breadcrumb";
import { Spinner } from "#/components/Spinner";

export default async function Page({
  params: { roundId, poolId },
}: {
  params: { roundId: string; poolId: string };
}) {
  return (
    <div className="flex flex-1 h-full w-full flex-col justify-start rounded-3xl text-white gap-y-3">
      <Breadcrumb />
      <Suspense fallback={<Spinner />}>
        <PoolOverviewCards roundId={roundId} poolId={poolId} />
      </Suspense>
      <HistoricalCharts roundId={roundId} poolId={poolId} />
      <Suspense fallback={<Spinner />}>
        <PoolTokens poolId={poolId} roundId={roundId} />
      </Suspense>
    </div>
  );
}
