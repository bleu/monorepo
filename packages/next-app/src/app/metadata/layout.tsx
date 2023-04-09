import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import type { Metadata } from "next";
import * as React from "react";

import balancerSymbol from "#/assets/balancer-symbol.svg";
import { Dialog } from "#/components/Dialog";
import { Footer } from "#/components/Footer";
import { Header, HeaderNetworkMismatchAlert } from "#/components/Header";
import { NetworksContextProvider } from "#/contexts/networks";

import { MetadataProvider } from "./(components)/MetadataProvider";
import SearchPoolForm from "./(components)/SearchPoolForm";

export const metadata: Metadata = {
  title: "Balancer Pool Metadata",
  description: "Welcome to Balancer Pool Metadata",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col">
      <NetworksContextProvider>
        <HeaderNetworkMismatchAlert />
        <Header
          linkUrl={"/metadata"}
          title={"Pool Metadata"}
          imageSrc={balancerSymbol}
        >
          <Dialog title="Go to pool" content={<SearchPoolForm />}>
            <div className="pointer-events-auto relative mx-2 rounded">
              <button
                type="button"
                className="flex w-full items-center rounded-md m-2 text-sm leading-6 text-slate-400 shadow-sm"
              >
                <MagnifyingGlassIcon
                  width="21"
                  height="21"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  className="mr-3 flex-none"
                />
                Go to pool
              </button>
            </div>
          </Dialog>
        </Header>
        <MetadataProvider>{children}</MetadataProvider>
        <Footer
          githubLink="https://github.com/bleu-studio/balancer-pool-metadata"
          discordLink="https://discord.balancer.fi/"
        />
      </NetworksContextProvider>
    </div>
  );
}
