"use client";

import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { Address } from "viem";

import { buildAccountCowExplorerUrl } from "#/lib/cowExplorer";
import { ChainId } from "#/utils/chainsPublicClients";
import { truncateAddress } from "#/utils/truncate";

interface IHeader {
  linkUrl: string;
  imageSrc?: string;
  children?: ReactNode;
  onLinkClick?: () => void;
}

export function Header({ linkUrl, imageSrc, children, onLinkClick }: IHeader) {
  const { safe } = useSafeAppsSDK();
  return (
    <div className="flex h-20 w-full items-center p-4 text-foreground">
      <div className="mr-auto flex sm:flex-1 justify-start">
        <Link
          href={linkUrl}
          onClick={onLinkClick}
          className="flex items-center gap-3 justify-self-start"
        >
          {imageSrc && (
            <Image src={imageSrc} height={75} width={300} alt="CoW AMM Logo" />
          )}
        </Link>
      </div>
      {children && <div className="flex flex-1 justify-center">{children}</div>}
      <div className="ml-auto flex flex-1 justify-end">
        <div className="text-secondary-foreground bg-secondary/30 border-secondary/50 text-center text-sm font-semibold border focus-visible:outline-brown7 focus-visible:outline-offset-2 disabled:opacity-40 py-3 px-5">
          <Link
            className="text-primary hover:text-primary/90 inline-flex items-center gap-1"
            href={
              new URL(
                buildAccountCowExplorerUrl({
                  chainId: safe.chainId as ChainId,
                  address: safe.safeAddress as Address,
                }),
              )
            }
            rel="noreferrer noopener"
            target="_blank"
          >
            {truncateAddress(safe.safeAddress)}
            <ArrowTopRightIcon className="hover:text-primary" />
          </Link>
        </div>
      </div>
    </div>
  );
}
