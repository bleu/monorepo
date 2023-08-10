import { Suspense } from "react";

import BALPrice from "#/app/apr/(components)/BALPrice";

export default function Page({
  params,
}: {
  params: { poolId: string; network: string };
}) {
  const { network, poolId } = params;

  return (
    <>
      <div className="flex h-full w-full flex-col justify-center rounded-3xl">
        hello from pool {poolId} in network {network}
      </div>
      <Suspense fallback={"Loading..."}>
        <BALPrice />
      </Suspense>
    </>
  );
}
