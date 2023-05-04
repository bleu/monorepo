import "#/styles/global.css";
import "@rainbow-me/rainbowkit/styles.css";

import * as React from "react";

import { Footer } from "#/components/Footer";
import { RootLayout } from "#/components/RootLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full flex flex-col bg-blue2">
        <RootLayout>{children}</RootLayout>
        <Footer
          githubLink="https://github.com/bleu-studio/balancer-pool-metadata"
          discordLink="https://discord.balancer.fi/"
        />
      </body>
    </html>
  );
}
