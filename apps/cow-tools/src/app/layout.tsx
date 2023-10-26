import "#/styles/global.css";
import "@rainbow-me/rainbowkit/styles.css";

import * as React from "react";

import Fonts from "#/components/Font";
import { Footer } from "#/components/Footer";
import { RootLayout } from "#/components/RootLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <Fonts />
      <body className="bg-blue2 flex h-full flex-col">
        <RootLayout>{children}</RootLayout>
        <Footer
          githubLink="https://github.com/bleu-studio/"
          discordLink="https://discord.gg/Z78vQvmHN2"
        />
      </body>
    </html>
  );
}
