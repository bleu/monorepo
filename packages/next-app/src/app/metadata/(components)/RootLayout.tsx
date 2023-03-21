"use client";

import { Pool } from "@balancer-pool-metadata/balancer-gql/src/gql/__generated__/mainnet";
import { darkTheme, Theme } from "@rainbow-me/rainbowkit";
import merge from "lodash.merge";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { useAccount, useNetwork, WagmiConfig } from "wagmi";

import balancerSymbol from "#/assets/balancer-symbol.svg";
import ConnectWalletImage from "#/assets/connect-wallet.svg";
import EmptyWalletImage from "#/assets/empty-wallet.svg";
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

  const RainbowKitProviderDynamic = dynamic(
    async () => (await import("@rainbow-me/rainbowkit")).RainbowKitProvider,
    { ssr: false }
  );

  let { address } = useAccount();

  address = impersonateWhetherDAO(chain?.id.toString() || "1", address);

  const { data } = gql(chain?.id.toString() || "1").usePool({
    owner: address,
  });

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
            {data?.pools && !!data.pools.length ? (
              <div className="flex h-full w-full">
                <div className="h-full w-96">
                  <Sidebar pools={data.pools as Pool[]} />
                </div>
                {children}
              </div>
            ) : (
              <WalletEmptyState />
            )}
          </PoolMetadataProvider>
        ) : (
          <WalletNotConnectedState />
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

export function Sidebar({ pools }: { pools: Pool[] }) {
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
          {pools &&
            pools.map((item) => (
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

export function WalletNotConnectedState() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-900">
      <h1 className="flex h-12 items-center text-center text-3xl font-medium not-italic text-gray-400">
        Your metadata pools will appear here.
      </h1>
      <h1 className="mb-4 flex h-12 items-center text-center	 text-3xl font-medium not-italic text-yellow-300">
        Please, connect your wallet.
      </h1>
      <Image src={ConnectWalletImage} height={500} width={500} alt="" />
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
