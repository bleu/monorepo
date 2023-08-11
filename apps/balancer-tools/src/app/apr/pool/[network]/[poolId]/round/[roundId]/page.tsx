import { Suspense } from "react";

import BALPrice from "#/app/apr/(components)/BALPrice";
import { PoolCard } from "#/app/apr/round/(components)/PoolsCards";
import { Pool } from "#/lib/balancer/gauges";

export default async function Page({
  params,
}: {
  params: { poolId: string; network: string; roundId: string };
}) {
  const { poolId, roundId } = params;

  return (
    <div className="flex h-full w-full flex-col justify-center rounded-3xl text-white">
      <Suspense fallback={"Loading..."}>
        <BALPrice />
      </Suspense>
      <Suspense fallback={"Loading..."}>
        <PoolCard
          roundId={roundId}
          data={{ symbol: new Pool(poolId).gauge?.address }}
        />
      </Suspense>
    </div>
  );
}
