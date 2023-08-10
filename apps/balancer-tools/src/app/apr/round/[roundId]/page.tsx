import { Suspense } from "react";

import Loading from "#/app/metadata/[network]/pool/[poolId]/loading";

import PoolsCards from "../(components)/PoolsCards";

export default function Page({
  params: { roundId },
}: {
  params: { roundId: string };
}) {
  return (
    <Suspense
      fallback={
        <div className="flex h-full w-full flex-col justify-center rounded-3xl">
          <Loading />
        </div>
      }
    >
      <PoolsCards roundId={roundId} />
    </Suspense>
  );
}
