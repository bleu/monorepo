"use client";

import * as React from "react";

import { Header } from "#/components/Header";
import { SelectedPoolRoundContextProvider } from "#/contexts/SelectedPoolRound";

import Sidebar from "./(components)/sidebar";

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <SelectedPoolRoundContextProvider>
      <div className="flex h-full flex-col">
        <Header
          linkUrl={"/apr"}
          title={"Pool Simulator"}
          imageSrc={"/assets/balancer-symbol.svg"}
          endButton={<></>}
        />
        <div className="flex flex-1 gap-x-8">
          <div className="h-full w-72 lg:w-80 max-w-sm">
            <Sidebar />
          </div>
          <div className="h-full flex-1 py-5 pr-8 text-white">{children}</div>
        </div>
      </div>
    </SelectedPoolRoundContextProvider>
  );
}
