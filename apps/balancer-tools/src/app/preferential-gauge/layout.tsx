"use client";

import { Network, networkFor } from "@bleu-fi/utils";
import * as React from "react";
import { useNetwork } from "wagmi";

import { Header, HeaderNetworkMismatchAlert } from "#/components/Header";
import { CheckSupportedChains } from "#/components/SupportedChain";
import { getNetwork, NetworksContextProvider } from "#/contexts/networks";
import { PreferentialGaugeProvider } from "#/contexts/PreferetialGaugeContext";

import { PreferentialGaugeSidebar } from "./(components)/PreferentialGaugeSidebar";

export default function Layout({ children }: React.PropsWithChildren) {
  const { chain } = useNetwork();
  const network = getNetwork(chain?.name);

  return (
    <NetworksContextProvider>
      <div className="flex h-full flex-col min-w-[930px]">
        <HeaderNetworkMismatchAlert />
        <Header
          linkUrl={`/preferential-gauge/${networkFor(chain?.id)}`}
          title={"Preferential Gauges"}
          imageSrc={"/assets/balancer-symbol.svg"}
        />
        <PreferentialGaugeProvider>
          <div className="flex flex-1 gap-x-8">
            <PreferentialGaugeSidebar />
            <CheckSupportedChains
              supportedChains={[Network.Ethereum, Network.Goerli]}
              chainName={network}
            >
              {children}
            </CheckSupportedChains>
          </div>
        </PreferentialGaugeProvider>
      </div>
    </NetworksContextProvider>
  );
}
