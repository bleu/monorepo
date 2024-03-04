"use client";

import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

import { truncateAddress } from "#/utils/truncate";

interface IHeader {
  linkUrl: string;
  imageSrc?: string;
  children?: ReactNode;
  onLinkClick?: () => void;
}

export function Header({ linkUrl, imageSrc, children, onLinkClick }: IHeader) {
  const {
    safe: { safeAddress },
  } = useSafeAppsSDK();
  return (
    <div className="flex h-20 w-full items-center p-4 text-foreground">
      <div className="mr-auto flex sm:flex-1 justify-start">
        <Link
          href={linkUrl}
          onClick={onLinkClick}
          className="flex items-center gap-3 justify-self-start"
        >
          <>
            {imageSrc && (
              <Image
                src={imageSrc}
                height={50}
                width={200}
                alt="CoW AMM Logo"
              />
            )}
          </>
        </Link>
      </div>
      {children && <div className="flex flex-1 justify-center">{children}</div>}
      <div className="ml-auto flex flex-1 justify-end">
        <div className="text-secondary-foreground bg-secondary/30 border-secondary/50 text-center text-sm font-semibold border focus-visible:outline-brown7 focus-visible:outline-offset-2 disabled:opacity-40 py-3 px-5">
          {truncateAddress(safeAddress)}
          {/* - TODO add link to Etherscan */}
        </div>
      </div>
    </div>
  );
}
