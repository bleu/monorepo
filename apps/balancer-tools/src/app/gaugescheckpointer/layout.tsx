"use client";

import { Network } from "@bleu/utils";
import * as React from "react";
import { useNetwork } from "wagmi";

import { Header, HeaderNetworkMismatchAlert } from "#/components/Header";
import { CheckSupportedChains } from "#/components/SupportedChain";
import { GaugesCheckpointerProvider } from "#/contexts/GaugesCheckpointerContext";
import { getNetwork, NetworksContextProvider } from "#/contexts/networks";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { chain } = useNetwork();

  const network = getNetwork(chain?.name);

  return (
    <NetworksContextProvider>
      <div className="flex h-full flex-col min-w-[930px]">
        <HeaderNetworkMismatchAlert />
        <Header
          linkUrl={`/gaugescheckpointer/${network}`}
          title={"Gauges Checkpointer"}
          imageSrc={"/assets/balancer-symbol.svg"}
        />
        <GaugesCheckpointerProvider>
          <CheckSupportedChains
            supportedChains={[Network.Ethereum]}
            chainName={network}
          >
            {children}
          </CheckSupportedChains>
        </GaugesCheckpointerProvider>
      </div>
    </NetworksContextProvider>
  );
}
