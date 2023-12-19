import { Metadata } from "next";
import * as React from "react";

import { Footer } from "#/components/Footer";
import { Header } from "#/components/Header";
import { NetworksContextProvider } from "#/contexts/networks";

const APP_DISPLAY_NAME = "Milkman orders";

export const metadata: Metadata = {
  title: `Cow Swap - ${APP_DISPLAY_NAME}`,
  description: "Manage your milkman orders",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <NetworksContextProvider>
      <div className="flex flex-col h-screen">
        <Header linkUrl={"/milkman"} imageSrc={"/assets/milkman.svg"} />

        <div className="flex flex-1 overflow-auto p-4 sm:flex-row sm:gap-x-8 text-white">
          {children}
        </div>
        <Footer
          githubLink="https://github.com/bleu-fi"
          discordLink="https://discord.gg/Z78vQvmHN2"
        />
      </div>
    </NetworksContextProvider>
  );
}
