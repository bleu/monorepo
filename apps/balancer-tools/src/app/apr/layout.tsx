import { Metadata } from "next";
import * as React from "react";

import { Header } from "#/components/Header";

import HeaderEndButton from "./(components)/HeaderEndButton";

const APP_DISPLAY_NAME = "Historical APR";

export const metadata: Metadata = {
  title: `Balancer - ${APP_DISPLAY_NAME}`,
  description: "APR Enhancement Calculator for Balancer pools through rounds",
};

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { roundId: string; poolId: string; network: string };
}) {
  const { roundId, poolId, network } = params;
  return (
    <div className="flex h-full flex-col">
      <Header
        linkUrl={"/apr"}
        title={APP_DISPLAY_NAME}
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
