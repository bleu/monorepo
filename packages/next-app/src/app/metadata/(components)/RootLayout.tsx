"use client";

import { Pool } from "@balancer-pool-metadata/balancer-gql/src/gql/__generated__/mainnet";
import { darkTheme, RainbowKitProvider, Theme } from "@rainbow-me/rainbowkit";
import merge from "lodash.merge";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { useAccount, useNetwork, WagmiConfig } from "wagmi";

import balancerSymbol from "#/assets/balancer-symbol.svg";
import EmptyWalletImage from "#/assets/empty-wallet.svg";
import { CustomConnectButton } from "#/components/CustomConnectButton";
import {
  PoolMetadataContext,
  PoolMetadataProvider,
} from "#/contexts/PoolMetadataContext";
import { impersonateWhetherDAO, networkFor } from "#/lib/gql";
import { fetchOwnedPools } from "#/utils/fetcher";
import { chains, client } from "#/wagmi/client";

import { OwnedPool } from "./OwnedPool";

// const CustomConnectButton = React.lazy(
//   () => import("#/components/CustomConnectButton").CustomConnectButton
// );

// const RainbowKitProviderDynamic = React.lazy(
//   () => import("@rainbow-me/rainbowkit").RainbowKitProvider
// );

export function RootLayout({ children }: { children: React.ReactNode }) {
  const [poolsData, setPoolsData] = useState<Pool[]>([]);
  const { chain } = useNetwork();
  const { isConnected } = useAccount();
  const { push } = useRouter();

  let { address } = useAccount();

  address = impersonateWhetherDAO(chain?.id.toString() || "1", address);

  useEffect(() => {
    if (!address) return;

    fetchOwnedPools(address, chain?.id.toString() || "1")
      .then((response) => setPoolsData(response.pools as Pool[]))
      .catch(() => setPoolsData([]));
  }, [chain, address]);

  useEffect(() => {
    if (chain) push("/metadata");
  }, [chain]);

  return (
    <WagmiConfig client={client}>
      <RainbowKitProvider
        chains={chains}
        modalSize="compact"
        theme={CustomTheme}
      >
        <Header />
        <PoolMetadataProvider>
          {isConnected && poolsData && !!poolsData.length ? (
            <div className="flex h-full w-full">
              <div className="h-full w-96">
                <Sidebar pools={poolsData as Pool[]} />
              </div>
              {children}
            </div>
          ) : isConnected ? (
            <WalletEmptyState />
          ) : (
            <div className="flex h-screen w-full pl-4 sm:pl-6 lg:pl-12">
              {children}
            </div>
          )}
        </PoolMetadataProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export function Header() {
  return (
    <div className="flex flex-wrap items-center justify-between border-b border-gray-700 bg-gray-800 p-4 text-white">
      <Link href={"/metadata"} className="mr-5 flex items-center gap-3">
        <Image src={balancerSymbol} height={50} width={50} alt="" />
        <h1 className="flex gap-2 text-4xl font-thin not-italic leading-8 text-gray-200">
          Balancer <p className="font-medium">Pool Metadata</p>
        </h1>
      </Link>

      <CustomConnectButton />
    </div>
  );
}

export function Sidebar({ pools }: { pools: Pool[] }) {
  const { selectedPool, handleSetPool } = useContext(PoolMetadataContext);
  const { chain } = useNetwork();
  const network = networkFor(chain!.id.toString());

  return (
    <div className="h-full w-96 max-w-full bg-gray-900 p-5">
      <div className="h-screen w-96 max-w-full items-start justify-start space-y-4">
        <div className="items-start justify-start space-y-2.5 self-stretch bg-gray-900 px-2">
          <div className="flex items-center justify-start space-x-0 text-2xl font-medium text-gray-400">
            <span>Owned pools</span>
          </div>
        </div>
        <div className="relative max-h-[40rem] self-stretch overflow-auto rounded-md border border-gray-700 bg-gray-800">
          {pools &&
            pools.map((item) => (
              <Link
                key={item.id}
                href={`/metadata/${network}/pool/${item.id}`}
                onClick={() => handleSetPool(item.id)}
              >
                <OwnedPool
                  key={item.id}
                  isSelected={item.id === selectedPool}
                  pool={item as Pool}
                />
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}

export function WalletEmptyState() {
  return (
    <div className="flex h-full w-full">
      <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-900">
        <h1 className="flex h-12 items-center text-center text-3xl font-medium not-italic text-gray-400">
          There are no pools in this network!
        </h1>
        <h1 className="mb-4 flex h-12 items-center text-center	 text-3xl font-medium not-italic text-yellow-300">
          Please, choose other network.
        </h1>
        <Image src={EmptyWalletImage} height={500} width={500} alt="" />
      </div>
    </div>
  );
}

const CustomTheme = merge(darkTheme(), {
  colors: {
    accentColor: "#3182CE",
    accentColorForeground: "#E2E8F0",
    closeButtonBackground: "#E2E8F0",
    connectButtonText: "#E2E8F0",
    closeButton: "#2D3748",
    connectButtonTextError: "#E2E8F0",
    connectionIndicator: "#30E000",
    generalBorder: "#E2E8F0",
    menuItemBackground: "#353d49",
    modalBackground: "#2D3748",
    modalBorder: "transparent",
    modalText: "#E2E8F0",
    modalTextDim: "#E2E8F0",
    modalTextSecondary: "#E2E8F0",
    selectedOptionBorder: "rgba(60, 66, 66, 0.1)",
    standby: "#FFD641",
  },
  fonts: {},
  radii: {
    menuButton: "25px",
    modal: "25px",
  },
  shadows: {
    selectedOption: "0px 4px 8px rgba(0, 0, 0, 0.24)",
    selectedWallet: "0px 4px 8px rgba(0, 0, 0, 0.12)",
  },
} as Theme);
