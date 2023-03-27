"use client";

import { darkTheme, RainbowKitProvider, Theme } from "@rainbow-me/rainbowkit";
import merge from "lodash.merge";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAccount, useNetwork, WagmiConfig } from "wagmi";

import { CustomConnectButton } from "#/components/CustomConnectButton";
import { Sidebar } from "#/components/Sidebar";
import { AdminToolsProvider } from "#/contexts/AdminToolsContext";
import { chains, client } from "#/wagmi/client";

// const RainbowKitProviderDynamic = dynamic(
//   () => import("@rainbow-me/rainbowkit").then((mod) => mod.RainbowKitProvider),
//   { ssr: false }
// );

// const CustomConnectButton = dynamic(
//   () =>
//     import("#/components/CustomConnectButton").then(
//       (mod) => mod.CustomConnectButton
//     ),
//   { ssr: false }
// );

export function RootLayout({ children }: { children: React.ReactNode }) {
  const { chain } = useNetwork();
  const { isConnected } = useAccount();
  const { push } = useRouter();

  useEffect(() => {
    if (chain) push("/daoadmin");
  }, [chain]);

  return (
    <WagmiConfig client={client}>
      <RainbowKitProvider
        chains={chains}
        modalSize="compact"
        theme={CustomTheme}
      >
        <Header />
        {isConnected ? (
          <AdminToolsProvider>
            <div className="flex h-full">
              <div className="h-full w-96">
                <div className="h-full w-full">
                  <Sidebar />
                </div>
              </div>
              <div className="p-5">{children}</div>
            </div>
          </AdminToolsProvider>
        ) : (
          <WalletEmptyState />
        )}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export function Header() {
  return (
    <div className="flex flex-wrap items-center justify-between border-b border-gray-700 bg-gray-800 p-4 text-white">
      <div className="mr-5 flex items-center gap-3">
        <Link href={"/daoadmin"}>
          <h1 className="flex gap-2 text-4xl font-thin not-italic leading-8 text-gray-200">
            Balancer <p className="font-medium">Admin Tools</p>
          </h1>
        </Link>
      </div>

      <CustomConnectButton />
    </div>
  );
}

export function WalletEmptyState() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-900">
      <h1 className="text-center text-xl font-normal leading-6 text-white opacity-80 md:text-2xl md:leading-9">
        Welcome to Balancer Admin Tools, please connect your wallet
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
