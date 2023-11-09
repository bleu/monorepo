"use client";

import SafeProvider from "@gnosis.pm/safe-apps-react-sdk";
import { darkTheme, RainbowKitProvider, Theme } from "@rainbow-me/rainbowkit";
import merge from "lodash.merge";
import Link from "next/link";
import React from "react";
import { WagmiConfig } from "wagmi";

import { chains, config } from "#/wagmi/client";

import Fathom from "./Fathom";

export function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider
        chains={chains}
        modalSize="compact"
        theme={CustomTheme}
      >
        <SafeProvider loader={<SafeLoader />}>
          <Fathom />
          <div className="h-full w-full bg-blue1">{children}</div>
        </SafeProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

function SafeLoader() {
  return (
    <div className="flex h-full w-full flex-col  justify-center items-center rounded-3xl px-12 py-16 md:py-20  text-slate12">
      <div className="text-center text-3xl">This is a Safe (wallet) App</div>
      <p className="text-xl">
        To access please use this
        <Link
          target="_blank"
          href="https://app.safe.global/share/safe-app?appUrl=https%3A%2F%2Fcow-tools-bleu-fi.vercel.app&chain=gor"
          className="text-amber9"
        >
          {" "}
          link{" "}
        </Link>
        with your safe account connected
      </p>
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
  fonts: {
    body: "var(--font-family-sans)",
  },
  radii: {
    menuButton: "25px",
    modal: "25px",
  },
  shadows: {
    selectedOption: "0px 4px 8px rgba(0, 0, 0, 0.24)",
    selectedWallet: "0px 4px 8px rgba(0, 0, 0, 0.12)",
  },
} as Theme);
