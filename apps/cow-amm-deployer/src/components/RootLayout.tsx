"use client";

import { Toaster } from "@bleu/ui";
import SafeProvider from "@gnosis.pm/safe-apps-react-sdk";
import React from "react";

import { TokenSelectContextProvider } from "#/contexts/tokenSelect";

import Fathom from "./Fathom";
import { Footer } from "./Footer";
import { Header } from "./Header";

export function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <SafeProvider>
      <TokenSelectContextProvider>
        <Fathom />
        <div className="size-full">
          <div className="flex flex-col h-screen">
            <Header linkUrl={"/"} imageSrc={"/assets/cow-amm-deployer.svg"} />
            <div className="flex flex-1 overflow-auto p-4 sm:flex-row sm:gap-x-8 text-foreground">
              {children}
            </div>
            <Footer twitterLink="https://twitter.com/cowswap" />
            <Toaster />
          </div>
        </div>
      </TokenSelectContextProvider>
    </SafeProvider>
  );
}
