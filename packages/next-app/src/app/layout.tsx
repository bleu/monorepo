import { RootLayout } from "#/components/RootLayout";
import "#/styles/global.css";
import "@rainbow-me/rainbowkit/styles.css";

import * as React from "react";

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
