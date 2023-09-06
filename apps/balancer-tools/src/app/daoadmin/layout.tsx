import type { Metadata } from "next";
import * as React from "react";

import { Header } from "#/components/Header";

import { DaoAdminProvider } from "./(components)/DaoAdminProvider";

export const metadata: Metadata = {
  title: "Balancer Pool Metadata",
  description: "Welcome to Balancer Pool Metadata",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col min-w-[930px]">
      <Header
        linkUrl={"/daoadmin"}
        title={"DAO Actions"}
        imageSrc={"/assets/balancer-symbol.svg"}
      />
      <DaoAdminProvider>{children}</DaoAdminProvider>
    </div>
  );
}
