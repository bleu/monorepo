"use client";

import { Toaster } from "@bleu/ui";
import SafeProvider from "@gnosis.pm/safe-apps-react-sdk";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from "react";
import { WagmiProvider } from "wagmi";

import { TokenSelectContextProvider } from "#/contexts/tokenSelectContext";
import { TransactionManagerContextProvider } from "#/contexts/transactionManagerContext";
import { config } from "#/wagmi";

import Fathom from "./Fathom";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { HomePageWrapper } from "./HomePageWrapper";

export function RootLayout({ children }: React.PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SafeProvider loader={<HomePageWrapper disableButton={true} />}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <TokenSelectContextProvider>
            <TransactionManagerContextProvider>
              <Fathom />
              <div className="size-full">
                <div className="flex flex-col h-screen">
                  <Header
                    linkUrl={"/"}
                    imageSrc={"/assets/cow-amm-deployer.svg"}
                  />
                  <div className="flex flex-1 overflow-auto p-4 sm:flex-row sm:gap-x-8 text-foreground">
                    {children}
                  </div>
                  <Footer twitterLink="https://twitter.com/cowswap" />
                  <Toaster position="top-right" />
                </div>
              </div>
            </TransactionManagerContextProvider>
          </TokenSelectContextProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </SafeProvider>
  );
}
