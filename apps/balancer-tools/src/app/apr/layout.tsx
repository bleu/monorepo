import { Metadata } from "next";
import * as React from "react";

import { Header } from "#/components/Header";
import { Spinner } from "#/components/Spinner";

import HeaderEndButton from "./(components)/HeaderEndButton";

const APP_DISPLAY_NAME = "Historical APR";

export const metadata: Metadata = {
  title: `Balancer - ${APP_DISPLAY_NAME}`,
  description: "APR Enhancement Calculator for Balancer pools through rounds",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col">
      <Header
        linkUrl={"/apr"}
        title={APP_DISPLAY_NAME}
        imageSrc={"/assets/balancer-symbol.svg"}
        endButton={
          <React.Suspense fallback={<Spinner />}>
            <HeaderEndButton />
          </React.Suspense>
        }
      />

      <div className="sm:flex flex-1 gap-x-8 px-4 pt-4 text-white">
        {children}
      </div>
    </div>
  );
}
