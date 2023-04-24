import type { Metadata } from "next";
import * as React from "react";

import balancerSymbol from "#/assets/balancer-symbol.svg";
import { Header } from "#/components/Header";
import { InternalManagerProvider } from "#/contexts/InternalManagerContext";
import { NetworksContextProvider } from "#/contexts/networks";

export const metadata: Metadata = {
  title: "Balancer Internal Manager",
  description: "Welcome to Balancer Internal Manager",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <NetworksContextProvider>
      <div className="flex h-screen flex-col">
        <Header
          linkUrl={"/internalmanager"}
          title={"Internal Manager"}
          imageSrc={balancerSymbol}
        />
        <InternalManagerProvider>{children}</InternalManagerProvider>
      </div>
    </NetworksContextProvider>
  );
}
