import { Suspense } from "react";

import { Spinner } from "#/components/Spinner";

import Breadcrumb from "../(components)/Breadcrumb";
import PoolTableWrapper from "../(components)/PoolTableWrapper";
import RoundOverviewCards from "../(components)/RoundOverviewCards";
import TopPoolsChart from "../(components)/TopPoolsChart";

export default function Page({
  params: { roundId, network, poolId },
}: {
  params: { roundId: string; poolId: string; network: string };
}) {
  return (
    <div className="flex flex-1 flex-col gap-y-3">
      <Breadcrumb network={network} poolId={poolId} roundId={roundId} />
      <Suspense fallback={<Spinner />}>
        <RoundOverviewCards roundId={roundId} />
      </Suspense>
      <Suspense fallback={<Spinner />}>
        <TopPoolsChart roundId={roundId} />
      </Suspense>
      <Suspense fallback={<Spinner />}>
        <PoolTableWrapper roundId={roundId} />
      </Suspense>
    </div>
  );
}
