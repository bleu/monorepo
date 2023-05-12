"use client";

import * as React from "react";
import { useNetwork } from "wagmi";

import balancerSymbol from "#/assets/balancer-symbol.svg";
import { Header, HeaderNetworkMismatchAlert } from "#/components/Header";
import { CheckSupportedChains } from "#/components/SupportedChain";
import { InternalManagerProvider } from "#/contexts/InternalManagerContext";
import { getNetwork, NetworksContextProvider } from "#/contexts/networks";
import { chains } from "#/wagmi/client";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { chain } = useNetwork();

  const network = getNetwork(chain?.name);

  return (
    <NetworksContextProvider>
      <div className="flex h-full flex-col">
        <HeaderNetworkMismatchAlert />
        <Header
          linkUrl={`/internalmanager/${network}`}
          title={"Internal Manager"}
          imageSrc={balancerSymbol}
        />
        <InternalManagerProvider>
          <CheckSupportedChains
            supportedChains={[
              "Ethereum",
              "Gnosis",
              "Arbitrum One",
              "Optimism",
              "Goerli",
              "Sepolia",
            ]}
            chainName={chain?.name as (typeof chains)[number]["name"]}
          >
            {children}
          </CheckSupportedChains>
        </InternalManagerProvider>
      </div>
    </NetworksContextProvider>
  );
}
