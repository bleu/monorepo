"use client";

import * as React from "react";

import balancerSymbol from "#/assets/balancer-symbol.svg";
import { Header } from "#/components/Header";
import Sidebar from "#/components/Sidebar";
import { StableSwapProvider } from "#/contexts/StableSwapContext";

import Menu from "./(components)/Menu";
import { ShareButton } from "./(components)/ShareButton";

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <div className="flex h-full flex-col">
      <StableSwapProvider>
        <Header
          linkUrl={"/stableswapsimulator"}
          title={"Stable Swap Simulator"}
          imageSrc={balancerSymbol}
          endButton={<ShareButton />}
        />
        <div className="flex flex-1 gap-x-8">
          <div className="bg-blue2">
            <Sidebar isFloating>
              <Menu />
            </Sidebar>
          </div>
          <div className="w-full">{children}</div>
        </div>
      </StableSwapProvider>
    </div>
  );
}
