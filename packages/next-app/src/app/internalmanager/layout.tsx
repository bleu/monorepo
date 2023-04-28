"use client";

import * as React from "react";
import { useNetwork } from "wagmi";

import balancerSymbol from "#/assets/balancer-symbol.svg";
import { Header } from "#/components/Header";
import { CheckSupportedChains } from "#/components/SupportedChain";
import { InternalManagerProvider } from "#/contexts/InternalManagerContext";
import { NetworksContextProvider } from "#/contexts/networks";
import { chains } from "#/wagmi/client";

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
          <CheckSupportedChains
            supportedChains={["Ethereum", "Goerli"]}
            chainName={chain?.name as (typeof chains)[number]["name"]}
          >
            {children}
          </CheckSupportedChains>
        </InternalManagerProvider>
      </div>
    </NetworksContextProvider>
  );
}
