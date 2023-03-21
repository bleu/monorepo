"use client";

import { Pool } from "@balancer-pool-metadata/balancer-gql/src/gql/__generated__/mainnet";
import { darkTheme, Theme } from "@rainbow-me/rainbowkit";
import merge from "lodash.merge";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { useAccount, useNetwork, WagmiConfig } from "wagmi";

import balancerSymbol from "#/assets/balancer-symbol.svg";
import {
  PoolMetadataContext,
  PoolMetadataProvider,
} from "#/contexts/PoolMetadataContext";
import gql, { impersonateWhetherDAO } from "#/lib/gql";
import { chains, client } from "#/wagmi/client";

import { OwnedPool } from "./OwnedPool";

export function RootLayout({ children }: { children: React.ReactNode }) {
  const { chain } = useNetwork();
  const { isConnected } = useAccount();
  const router = useRouter();

  const RainbowKitProviderDynamic = dynamic(
    async () => (await import("@rainbow-me/rainbowkit")).RainbowKitProvider,
    { ssr: false }
  );

  useEffect(() => {
    localStorage.setItem("networkId", chain?.id?.toString() || "1");

    router.refresh();
  }, [chain]);

  return (
    <WagmiConfig client={client}>
      <RainbowKitProviderDynamic
        chains={chains}
        modalSize="compact"
        theme={CustomTheme}
      >
        <Header />
        {isConnected ? (
          <PoolMetadataProvider>
            <div className="flex h-full">
              <div className="h-full w-96">
                <div className="h-full w-full">
                  <Sidebar />
                </div>
              </div>

              {children}
            </div>
          </PoolMetadataProvider>
        ) : (
          <WalletEmptyState />
        )}
      </RainbowKitProviderDynamic>
    </WagmiConfig>
  );
}

export function Header() {
  const CustomConnectButton = dynamic(
    async () =>
      (await import("#/components/CustomConnectButton")).CustomConnectButton,
    { ssr: false }
  );

  return (
    <div className="flex flex-wrap items-center justify-between border-b border-gray-700 bg-gray-800 p-4 text-white">
      <div className="mr-5 flex items-center gap-3">
        <Image src={balancerSymbol} height={50} width={50} alt="" />
        <h1 className="flex gap-2 text-4xl font-thin not-italic leading-8 text-gray-200">
          Balancer <p className="font-medium">Pool Metadata</p>
        </h1>
      </div>

      <CustomConnectButton />
    </div>
  );
}

export function Sidebar() {
  let { address } = useAccount();

  address = impersonateWhetherDAO(address);

  const { data } = gql.usePool({
    owner: address,
  });

  const { selectedPool, handleSetPool } = useContext(PoolMetadataContext);

  return (
    <div className="h-full w-96 max-w-full bg-gray-900 p-5">
      <div className="h-screen w-96 max-w-full items-start justify-start space-y-4">
        <div className="items-start justify-start space-y-2.5 self-stretch bg-gray-900 px-2">
          <div className="flex items-center justify-start space-x-0 text-2xl font-medium text-gray-400">
            <span>Owned pools</span>
          </div>
        </div>
        <div className="relative max-h-[40rem] self-stretch overflow-auto rounded-md border border-gray-700 bg-gray-800">
          {data?.pools &&
            data.pools.map((item) => (
              <Link
                key={item.id}
                href={`/metadata/pool/${item.id}`}
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
    <div className="flex h-screen items-center justify-center bg-gray-900">
      <h1 className="text-center text-xl font-normal leading-6 text-white opacity-80 md:text-2xl md:leading-9">
        Welcome to Balancer Pool Metadata, please connect your wallet
      </h1>
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
