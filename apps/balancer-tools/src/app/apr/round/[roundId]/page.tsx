import { Suspense } from "react";

import Loading from "#/app/metadata/[network]/pool/[poolId]/loading";

import TopPoolsChart from "../(components)/TopPoolsChart";
import PoolsCards from "../(components)/PoolsCards";

export default function Page({
  params: { roundId },
}: {
  params: { roundId: string };
}) {
  return (
    <div className="flex flex-col gap-3">
      <Suspense
        fallback={
          <div className="flex h-full w-full flex-col justify-center rounded-3xl">
            <Loading />
          </div>
        }
      >
        <TopPoolsChart roundId={roundId} />
      </Suspense>
      <Suspense
        fallback={
          <div className="flex h-full w-full flex-col justify-center rounded-3xl">
            <Loading />
          </div>
        }
      >
        <PoolsCards roundId={roundId} />
      </Suspense>
    </div>
  );
}
