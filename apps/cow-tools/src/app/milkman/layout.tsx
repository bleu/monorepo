import { Metadata } from "next";
import * as React from "react";

import { Header } from "#/components/Header";

const APP_DISPLAY_NAME = "Milkman orders";

export const metadata: Metadata = {
  title: `Cow Swap - ${APP_DISPLAY_NAME}`,
  description: "Manage your milkman orders",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col">
      <Header
        linkUrl={"/milkman"}
        title={APP_DISPLAY_NAME}
        imageSrc={"/favicon.ico"}
      />

      <div className="sm:flex flex-1 gap-x-8 px-4 pt-4 text-white">
        {children}
      </div>
    </div>
  );
}
