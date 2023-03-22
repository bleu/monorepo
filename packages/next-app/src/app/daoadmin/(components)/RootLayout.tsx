"use client";

import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { darkTheme, RainbowKitProvider, Theme } from "@rainbow-me/rainbowkit";
import merge from "lodash.merge";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { useAccount, useNetwork, WagmiConfig } from "wagmi";

import { CustomConnectButton } from "#/components/CustomConnectButton";
import {
  ActionAttribute,
  AdminToolsContext,
  AdminToolsProvider,
} from "#/contexts/AdminToolsContext";
import { hardcodedData } from "#/utils/hardcodedData";
import { chains, client } from "#/wagmi/client";

import { Actions } from "./Actions";

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
  const router = useRouter();

  useEffect(() => {
    localStorage.setItem("networkId", chain?.id?.toString() || "1");

    router.refresh();
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

export function Sidebar() {
  const data = hardcodedData;
  const [querySearch, setQuerySearch] = useState("");

  const handleSearchChange = (e: React.FormEvent<HTMLInputElement>) => {
    setQuerySearch(e.currentTarget.value);
  };

  const filteredActions = data.actions.filter((item) =>
    item.name.toLowerCase().includes(querySearch.toLowerCase())
  );

  const { selectedAction, handleSetAction } = useContext(AdminToolsContext);

  return (
    <div className="h-full w-96 max-w-full bg-gray-800 py-5">
      <div className="h-screen w-96 max-w-full items-start justify-start space-y-4">
        <div className="items-start justify-start space-y-2.5 self-stretch px-5">
          <div className="flex items-center justify-start space-x-0 text-2xl font-medium text-gray-400">
            <span>DAO Actions</span>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center">
              <input
                placeholder="Search for DAO Action"
                className="h-9 w-full appearance-none items-center justify-center rounded-l-[4px] bg-white px-[10px] text-sm leading-none text-gray-400 outline-none"
                onChange={handleSearchChange}
              />
              <button className="h-9 rounded-r-[4px] bg-gray-400 px-2 leading-none outline-none transition hover:bg-gray-500">
                <MagnifyingGlassIcon
                  color="rgb(31 41 55)"
                  className="ml-1 font-semibold"
                  height={20}
                  width={20}
                />
              </button>
            </div>
          </div>
        </div>
        <div className="relative max-h-[40rem] self-stretch overflow-auto">
          {filteredActions &&
            filteredActions.map((item: ActionAttribute) => (
              <Link
                key={item.id}
                href={`/daoadmin/action/${item.id}`}
                onClick={() => handleSetAction(item)}
              >
                <Actions
                  key={item.id}
                  isSelected={item.id === selectedAction?.id}
                  action={item as ActionAttribute}
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
