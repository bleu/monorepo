"use client";

import { useParams } from "next/navigation";
import * as React from "react";
import invariant from "tiny-invariant";

import { Header } from "#/components/Header";

import HeaderEndButton from "./(components)/HeaderEndButton";

export default function Layout({ children }: React.PropsWithChildren) {
  const { roundId, poolId, network } = useParams();
  invariant(!Array.isArray(roundId), "roundId cannot be a list");
  invariant(!Array.isArray(poolId), "poolId cannot be a list");
  invariant(!Array.isArray(network), "network cannot be a list");

  return (
    <div className="flex h-full flex-col">
      <Header
        linkUrl={"/apr"}
        title={"Pool Simulator"}
        imageSrc={"/assets/balancer-symbol.svg"}
        endButton={
          <HeaderEndButton
            network={network}
            poolId={poolId}
            roundId={roundId}
          />
        }
      />
      <div className="flex flex-1 gap-x-8 px-4 pt-4 text-white">{children}</div>
    </div>
  );
}
