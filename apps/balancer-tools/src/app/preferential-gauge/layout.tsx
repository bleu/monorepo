"use client";

import "@rainbow-me/rainbowkit/styles.css";

import { Network, networkFor } from "@bleu-fi/utils";
import SafeProvider from "@gnosis.pm/safe-apps-react-sdk";
import * as React from "react";
import { useNetwork } from "wagmi";

import { CheckSupportedChains } from "#/components/SupportedChain";
import { getNetwork, NetworksContextProvider } from "#/contexts/networks";
import { PreferentialGaugeProvider } from "#/contexts/PreferetialGaugeContext";

import { Header } from "./(components)/Header";
import { PreferentialGaugeSidebar } from "./(components)/PreferentialGaugeSidebar";

export default function Layout({ children }: React.PropsWithChildren) {
  const { chain } = useNetwork();
  const network = getNetwork(chain?.name);

  return (
    <SafeProvider loader={<SafeLoader />}>
      <NetworksContextProvider>
        <div className="flex h-full flex-col min-w-[930px]">
          <Header
            linkUrl={`/preferential-gauge/${networkFor(chain?.id)}`}
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
    </SafeProvider>
  );
}

function SafeLoader() {
  return (
    <div className="flex h-full w-full flex-col  justify-center items-center rounded-3xl px-12 py-16 md:py-20  text-slate12">
      <div className="text-center text-3xl">This is a Safe (wallet) App</div>
      <p className="text-xl">
        To access please use this with your safe account connected
      </p>
    </div>
  );
}
