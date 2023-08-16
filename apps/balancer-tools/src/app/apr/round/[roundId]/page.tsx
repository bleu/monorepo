import { Suspense } from "react";

import Loading from "#/app/metadata/[network]/pool/[poolId]/loading";

import PoolListTable from "../(components)/PoolListTable";

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
      <PoolListTable roundId={roundId} />
    </Suspense>
  );
}
