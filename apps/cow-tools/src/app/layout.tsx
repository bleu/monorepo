import "#/global.css";

import * as React from "react";

import Fonts from "#/components/Font";
import { RootLayout } from "#/components/RootLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <Fonts />
      <body className="bg-blue2 flex h-full flex-col">
        <RootLayout>{children}</RootLayout>
      </body>
    </html>
  );
}
