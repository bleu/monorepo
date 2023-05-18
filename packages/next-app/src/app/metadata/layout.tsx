"use client";

import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import * as Separator from "@radix-ui/react-separator";
import * as React from "react";
import { Suspense } from "react";
import { useNetwork } from "wagmi";

import balancerSymbol from "#/assets/balancer-symbol.svg";
import { Dialog } from "#/components/Dialog";
import { Header, HeaderNetworkMismatchAlert } from "#/components/Header";
import SearchPoolForm from "#/components/SearchPoolForm";
import Sidebar from "#/components/Sidebar";
import Spinner from "#/components/Spinner";
import { CheckSupportedChains } from "#/components/SupportedChain";
import { NetworksContextProvider } from "#/contexts/networks";
import {
  PoolMetadataProvider,
  usePoolMetadata,
} from "#/contexts/PoolMetadataContext";
import { chains } from "#/wagmi/client";

import OwnedPoolsSidebarItems from "./(components)/OwnedPoolsSidebarItems";

export default function Layout({ children }: React.PropsWithChildren) {
  const { chain } = useNetwork();
  const { handleGoToPool } = usePoolMetadata();

  return (
    <NetworksContextProvider>
      <div className="flex flex-col h-full">
        <HeaderNetworkMismatchAlert />
        <Header
          linkUrl={"/metadata"}
          title={"Pool Metadata"}
          imageSrc={balancerSymbol}
        />
        <div className="flex flex-1 gap-x-8">
          <PoolMetadataProvider>
            <div>
              <Sidebar isFloating>
                <Dialog
                  title="Go to pool"
                  content={<SearchPoolForm onSubmit={handleGoToPool} />}
                >
                  <span className="text-sm font-normal text-slate12 cursor-pointer flex items-center space-x-2">
                    <MagnifyingGlassIcon
                      width="16"
                      height="16"
                      strokeWidth={1}
                    />
                    <span>Open a pool directly</span>
                  </span>
                </Dialog>
                <Separator.Root className="bg-blue6 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px my-5" />

                <Sidebar.Header name="Owned pools" />
                <Sidebar.Content>
                  <Suspense fallback={<Spinner />}>
                    <OwnedPoolsSidebarItems />
                  </Suspense>
                </Sidebar.Content>
              </Sidebar>
            </div>
            <CheckSupportedChains
              supportedChains={["Goerli", "Polygon"]}
              chainName={chain?.name as (typeof chains)[number]["name"]}
            >
              {children}
            </CheckSupportedChains>
          </PoolMetadataProvider>
        </div>
      </div>
    </NetworksContextProvider>
  );
}
