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

const flechaS = localFont({
  src: [
    {
      path: "../fonts/FlechaS-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/FlechaS-MediumItalic.woff2",
      weight: "500",
      style: "italic",
    },
  ],
  variable: "--font-family-serif",
});

const circularStd = localFont({
  src: [
    {
      path: "../fonts/CircularStd-Book.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/CircularStd-Medium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-family-sans",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body
        className={cn(
          flechaS.variable,
          circularStd.variable,
          "bg-background flex h-full flex-col font-sans font-normal text-foreground",
        )}
      >
        <RootLayout>{children}</RootLayout>
      </body>
    </html>
  );
}
