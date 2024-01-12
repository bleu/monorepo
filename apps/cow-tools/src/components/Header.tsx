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
    <div className="flex h-20 w-full items-center border-b border-b-blue3 bg-blue2 p-4 text-white">
      <div className="mr-auto flex sm:flex-1 justify-start">
        <Link
          href={linkUrl}
          onClick={onLinkClick}
          className="flex items-center gap-3 justify-self-start"
        >
          <>
            {imageSrc && (
              <Image src={imageSrc} height={50} width={200} alt="" />
            )}
          </>
        </Link>
      </div>
      {children && <div className="flex flex-1 justify-center">{children}</div>}
      <div className="ml-auto flex flex-1 justify-end">
        <div className="bg-blue3 text-slate12 border-blue3 rounded-md text-center text-sm font-semibold border focus-visible:outline-blue7 focus-visible:outline-offset-2 disabled:opacity-40 py-3 px-5">
          {truncateAddress(safeAddress)}
        </div>
      </div>
    </div>
  );
}
