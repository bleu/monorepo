import { Network } from "@bleu-balancer-tools/utils";
import { Suspense } from "react";

import { Spinner } from "#/components/Spinner";

import { PoolListTable } from "../(components)/PoolListTable";
import RoundOverviewCards from "../(components)/RoundOverviewCards";
import TopPoolsChart from "../(components)/TopPoolsChart";

export default function Page({
  params: { roundId, network },
}: {
  params: { roundId: string; network: Network };
}) {
  return (
    <div className="flex flex-col gap-y-3">
      <Suspense fallback={<Spinner />}>
        <RoundOverviewCards roundId={roundId} />
      </Suspense>
      <Suspense fallback={<Spinner />}>
        <TopPoolsChart roundId={roundId} />
      </Suspense>
      <PoolListTable roundId={roundId} network={network} />
    </div>
  );
}
