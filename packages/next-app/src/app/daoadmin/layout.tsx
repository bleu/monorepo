import "@rainbow-me/rainbowkit/styles.css";
import "#/styles/global.css";

import type { Metadata } from "next";
import * as React from "react";

import balancerSymbol from "#/assets/balancer-symbol.svg";
import { Header } from "#/components/Header";
import { RootLayout } from "#/components/RootLayout";

import { DaoAdminProvider } from "./(components)/DaoAdminProvider";

export const metadata: Metadata = {
  title: "Balancer Pool Metadata",
  description: "Welcome to Balancer Pool Metadata",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="h-full w-full bg-gray-900">
          <RootLayout>
            <Header
              linkUrl={"/daoadmin"}
              title={"DAO Actions"}
              imageSrc={balancerSymbol}
            />
            <DaoAdminProvider>{children}</DaoAdminProvider>
          </RootLayout>
        </div>
      </body>
    </html>
  );
}
