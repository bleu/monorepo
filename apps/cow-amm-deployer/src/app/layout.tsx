import "#/global.css";
import "@rainbow-me/rainbowkit/styles.css";

import { Metadata } from "next";
import * as React from "react";

import Fonts from "#/components/Font";
import { Footer } from "#/components/Footer";
import { Header } from "#/components/Header";
import { RootLayout } from "#/components/RootLayout";
import { NetworksContextProvider } from "#/contexts/networks";

const APP_DISPLAY_NAME = "CoW Amm Manager";

export const metadata: Metadata = {
  title: `Cow - ${APP_DISPLAY_NAME}`,
  description: "Manage your CoW Amm",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <Fonts />
      <body className="bg-amm-brown flex h-full flex-col">
        <RootLayout>
          <NetworksContextProvider>
            <div className="flex flex-col h-screen">
              <Header linkUrl={"/"} imageSrc={"/assets/cow-amm.svg"} />
              <div className="flex flex-1 overflow-auto p-4 sm:flex-row sm:gap-x-8 text-white">
                {children}
              </div>
              <Footer twitterLink="https://twitter.com/cowswap" />
            </div>
          </NetworksContextProvider>
        </RootLayout>
      </body>
    </html>
  );
}
