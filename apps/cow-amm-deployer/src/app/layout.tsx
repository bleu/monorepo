import "#/global.css";

import { Metadata } from "next";
import localFont from "next/font/local";
import * as React from "react";

import { RootLayout } from "#/components/RootLayout";
import { cn } from "#/lib/utils";

const APP_DISPLAY_NAME = "CoW AMM Manager";

export const metadata: Metadata = {
  title: `Cow - ${APP_DISPLAY_NAME}`,
  description: "Manage your CoW AMM",
  twitter: {
    images: "/assets/preview-image.png",
  },
  openGraph: {
    images: "/assets/preview-image.png",
  },
};

const studioFeixenSans = localFont({
  src: [
    {
      path: "../fonts/Studio-Feixen-Sans.ttf",
    },
  ],
  variable: "--font-family-sans",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body
        className={cn(
          studioFeixenSans.variable,
          "bg-[url(/assets/bg.png)] flex h-full flex-col font-sans font-normal text-white",
        )}
      >
        <RootLayout>{children}</RootLayout>
      </body>
    </html>
  );
}
