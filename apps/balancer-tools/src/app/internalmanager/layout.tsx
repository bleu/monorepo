"use client";

import { Network } from "@bleu/utils";
import * as React from "react";
import { useNetwork } from "wagmi";

import { Header, HeaderNetworkMismatchAlert } from "#/components/Header";
import { CheckSupportedChains } from "#/components/SupportedChain";
import { InternalManagerProvider } from "#/contexts/InternalManagerContext";
import { getNetwork, NetworksContextProvider } from "#/contexts/networks";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { chain } = useNetwork();

  const network = getNetwork(chain?.name);

  return (
    <NetworksContextProvider>
      <div className="flex h-full flex-col min-w-[930px]">
        <HeaderNetworkMismatchAlert />
        <Header
          linkUrl={`/internalmanager/${network}`}
          title={"Internal Manager"}
          imageSrc={"/assets/balancer-symbol.svg"}
        />
        <InternalManagerProvider>
          <CheckSupportedChains
            supportedChains={[
              Network.Ethereum,
              Network.Gnosis,
              Network.Arbitrum,
              Network.Polygon,
              Network.PolygonZKEVM,
              Network.Optimism,
              Network.Goerli,
            ]}
            chainName={network}
          >
            {children}
          </CheckSupportedChains>
        </InternalManagerProvider>
      </div>
    </NetworksContextProvider>
  );
}
