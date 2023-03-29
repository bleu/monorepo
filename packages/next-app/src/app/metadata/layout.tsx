import type { Metadata } from "next";
import * as React from "react";

import balancerSymbol from "#/assets/balancer-symbol.svg";
import { Header } from "#/components/Header";

import { MetadataProvider } from "./(components)/MetadataProvider";

export const metadata: Metadata = {
  title: "Balancer Pool Metadata",
  description: "Welcome to Balancer Pool Metadata",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header
        linkUrl={"/metadata"}
        title={"Pool Metadata"}
        imageSrc={balancerSymbol}
      />
      <MetadataProvider>{children}</MetadataProvider>
    </>
  );
}
