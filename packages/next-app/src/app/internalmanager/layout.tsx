"use client";

import * as React from "react";
import { useNetwork } from "wagmi";

import balancerSymbol from "#/assets/balancer-symbol.svg";
import { Header } from "#/components/Header";
import { CheckUnsupportedChain } from "#/components/UnsupportedChain";
import { InternalManagerProvider } from "#/contexts/InternalManagerContext";
import { NetworksContextProvider } from "#/contexts/networks";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { chain } = useNetwork();
  return (
    <NetworksContextProvider>
      <div className="flex h-full flex-col">
        <Header
          linkUrl={"/internalmanager"}
          title={"Internal Manager"}
          imageSrc={balancerSymbol}
        />
        <InternalManagerProvider>
          <CheckUnsupportedChain
            unsupportedChain="Polygon"
            chainName={chain?.name}
          >
            {children}
          </CheckUnsupportedChain>
        </InternalManagerProvider>
      </div>
    </NetworksContextProvider>
  );
}
