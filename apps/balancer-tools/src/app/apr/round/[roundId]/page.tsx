"use client";

import { Suspense } from "react";

import Loading from "#/app/metadata/[network]/pool/[poolId]/loading";
import { useSelectedPoolRoundContext } from "#/contexts/SelectedPoolRound";
import { fetcher } from "#/utils/fetcher";

import PoolsCards from "../(components)/PoolsCards";

export default function Page({
  params: { roundId },
}: {
  params: { roundId: string };
}) {
  const { setSelectedPool } = useSelectedPoolRoundContext();

  function onClick(poolId: string) {
    setSelectedPool(poolId);
  }

  return (
    <Suspense
      fallback={
        <div className="flex h-full w-full flex-col justify-center rounded-3xl">
          <Loading />
        </div>
      }
    >
      <PoolsCards onClick={onClick} data={fetcher(`/apr/rounds/${roundId}`)} />
    </Suspense>
  );
}
