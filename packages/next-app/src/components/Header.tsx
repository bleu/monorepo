"use client";

import { networkFor } from "@balancer-pool-metadata/shared";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { ReactNode } from "react";
import { UrlObject } from "url";

import { useNetworks } from "#/contexts/networks";
import { useSwitchNetwork } from "#/wagmi";

import { CustomConnectButton } from "./CustomConnectButton";

interface IHeader {
  linkUrl: UrlObject | __next_route_internal_types__.RouteImpl<string>;
  imageSrc?: string;
  title: string;
  children?: ReactNode;
}

export function Header({ linkUrl, imageSrc, title, children }: IHeader) {
  return (
    <div className="flex h-20 w-full items-center border-b border-b-blue3 bg-blue2 p-4 text-white">
      <div className="mr-auto flex flex-1 justify-start">
        <Link
          href={linkUrl}
          className="flex items-center gap-3 justify-self-start"
        >
          {imageSrc && <Image src={imageSrc} height={50} width={50} alt="" />}
          <div className="text-xl font-thin text-slate12">
            Balancer <p className="font-medium">{title}</p>
          </div>
        </Link>
      </div>
      <div className="flex flex-1 justify-center">{children}</div>
      <div className="ml-auto flex flex-1 justify-end">
        <CustomConnectButton />
      </div>
    </div>
  );
}

export function HeaderNetworkMismatchAlert() {
  const { mismatchedNetworks, urlPathNetwork } = useNetworks();

  const { switchNetwork } = useSwitchNetwork({ chainId: urlPathNetwork });

  if (!mismatchedNetworks || !urlPathNetwork) return null;

  return (
    <div className="flex min-h-[50px] flex-row items-center justify-center bg-tomato3 text-white">
      <ExclamationTriangleIcon className="mr-3 h-4 w-4" />
      <p className="pr-4">Please switch to {networkFor(urlPathNetwork)}</p>
      <button
        className="inline-block h-6 cursor-pointer rounded-lg border-none bg-tomato4 px-2 text-xs text-white shadow hover:bg-tomato6 hover:text-white hover:shadow-none"
        onClick={() => switchNetwork?.()}
      >
        Switch network
      </button>
    </div>
  );
}
