import { Suspense } from "react";

import BALPrice from "#/app/apr/(components)/BALPrice";
import { PoolCard } from "#/app/apr/round/(components)/PoolsCards";
import { Pool } from "#/lib/balancer/gauges";

export default function Page({
  params,
}: {
  params: { poolId: string; network: string };
}) {
  const { poolId } = params;

  return (
    <>
      <Suspense fallback={"Loading..."}>
        <BALPrice />
      </Suspense>
      <Suspense fallback={"Loading..."}>
        <PoolCard data={{ symbol: new Pool(poolId).gauge?.address }} />
      </Suspense>
    </>
  );
}
