import "@rainbow-me/rainbowkit/styles.css";
import "#/styles/global.css";

import type { Metadata } from "next";
import * as React from "react";

import { RootLayout } from "./(components)/RootLayout";

export const metadata: Metadata = {
  title: "Balancer DAO Admin Tools",
  description: "Welcome to Balancer DAO Admin Tools",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="h-full w-full bg-gray-900">
          <RootLayout>{children}</RootLayout>
        </div>
      </body>
    </html>
  );
}
