"use client";

import { Toaster } from "@bleu/ui";
import SafeProvider from "@gnosis.pm/safe-apps-react-sdk";
import React from "react";

import Fathom from "./Fathom";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { HomeWrapper } from "./HomeWrapper";

export function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <SafeProvider loader={<HomeWrapper isAmmRunning={false} goToSafe />}>
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
    </SafeProvider>
  );
}
