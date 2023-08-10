import { Suspense } from "react";

import BALPrice from "#/app/apr/(components)/BALPrice";
import PoolPctVotesInRound from "#/app/apr/(components)/PoolPctVotesInRound";

export default async function Page({
  params,
}: {
  params: { poolId: string; network: string; roundId: string };
}) {
  const { network, poolId, roundId } = params;

  return (
    <div className="flex h-full w-full flex-col justify-center rounded-3xl text-white">
      hello from pool {poolId} in network {network} for round {roundId}. Pool share in round {roundId} is

      <Suspense fallback={"Loading..."}>
        <PoolPctVotesInRound poolId={poolId} roundId={roundId} />
      </Suspense>
      <Suspense fallback={"Loading..."}>
        <BALPrice roundId={roundId} />
      </Suspense>
    </div>
  );
}
