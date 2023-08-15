import { Suspense } from "react";

import Loading from "#/app/metadata/[network]/pool/[poolId]/loading";

import PoolsCards from "../(components)/PoolsCards";
import RoundOverviewCards from "../(components)/RoundDetailCards";

export default function Page({
  params: { roundId },
}: {
  params: { roundId: string };
}) {
  return (
    <>
      <RoundOverviewCards roundId={roundId} />
      <Suspense
        fallback={
          <div className="flex h-full w-full flex-col justify-center rounded-3xl">
            <Loading />
          </div>
        }
      >
        <PoolsCards roundId={roundId} />
      </Suspense>
    </>
  );
}
