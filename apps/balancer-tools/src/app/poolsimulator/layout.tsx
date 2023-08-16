"use client";

import * as React from "react";

import { Header } from "#/components/Header";
import Sidebar from "#/components/Sidebar";
import {
  defaultAnalysisData,
  defaultPool,
  PoolSimulatorProvider,
  usePoolSimulator,
} from "#/contexts/PoolSimulatorContext";

import Menu from "./(components)/Menu";
import { ShareButton } from "./(components)/ShareButton";

export default function Layout({ children }: React.PropsWithChildren) {
  const {
    setIsAnalysis,
    handleImportPoolParametersById,
    setInitialData,
    setCustomData,
  } = usePoolSimulator();

  function onLinkClick() {
    setIsAnalysis(false);
    handleImportPoolParametersById(
      {
        poolId: defaultPool.id,
        network: defaultPool.network,
      },
      setInitialData,
    );
    setCustomData(defaultAnalysisData);
  }

  return (
    <div className="flex h-full flex-col">
      <PoolSimulatorProvider>
        <Header
          linkUrl={"/poolsimulator"}
          title={"Pool Simulator"}
          imageSrc={"/assets/balancer-symbol.svg"}
          endButton={<ShareButton />}
          onLinkClick={onLinkClick}
        />
        <div className="flex flex-1 gap-x-8">
          <div className="bg-blue2">
            <Sidebar isFloating>
              <Menu />
            </Sidebar>
          </div>
          <div className="w-full">{children}</div>
        </div>
      </PoolSimulatorProvider>
    </div>
  );
}
