"use client";

import { Network, networkIdEnumMap } from "@bleu-balancer-tools/shared";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import * as Separator from "@radix-ui/react-separator";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Suspense } from "react";
import { useNetwork } from "wagmi";

import balancerSymbol from "#/assets/balancer-symbol.svg";
import { Dialog } from "#/components/Dialog";
import { Header, HeaderNetworkMismatchAlert } from "#/components/Header";
import { PoolAttribute, SearchPoolForm } from "#/components/SearchPoolForm";
import Sidebar from "#/components/Sidebar";
import { Spinner } from "#/components/Spinner";
import { CheckSupportedChains } from "#/components/SupportedChain";
import { getNetwork, NetworksContextProvider } from "#/contexts/networks";
import { PoolMetadataProvider } from "#/contexts/PoolMetadataContext";

import OwnedPoolsSidebarItems from "./(components)/OwnedPoolsSidebarItems";

export default function Layout({ children }: React.PropsWithChildren) {
  const { push } = useRouter();
  const { chain } = useNetwork();
  const network = getNetwork(chain?.name);

  function handleGoToPool(formData: PoolAttribute) {
    const networkId = formData.network ?? chain?.id.toString();
    const networkName =
      networkIdEnumMap[networkId as keyof typeof networkIdEnumMap];
    push(`/metadata/${networkName}/pool/${formData.poolId}`);
  }

  return (
    <NetworksContextProvider>
      <div className="flex h-full flex-col">
        <HeaderNetworkMismatchAlert />
        <Header
          linkUrl={`/metadata/${network}/`}
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
                  <span className="flex cursor-pointer items-center space-x-2 text-sm font-normal text-slate12">
                    <MagnifyingGlassIcon
                      width="16"
                      height="16"
                      strokeWidth={1}
                    />
                    <span>Open a pool directly</span>
                  </span>
                </Dialog>
                <Separator.Root className="my-5 bg-blue6 data-[orientation=horizontal]:h-px data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px" />

                <Sidebar.Header name="Owned pools" />
                <Sidebar.Content>
                  <Suspense fallback={<Spinner />}>
                    <OwnedPoolsSidebarItems />
                  </Suspense>
                </Sidebar.Content>
              </Sidebar>
            </div>
            <CheckSupportedChains
              supportedChains={[Network.Goerli, Network.Polygon]}
              chainName={network}
            >
              {children}
            </CheckSupportedChains>
          </PoolMetadataProvider>
        </div>
      </div>
    </NetworksContextProvider>
  );
}
