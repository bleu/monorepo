"use client";

import { networkFor } from "@balancer-pool-metadata/shared";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { ReactNode } from "react";
import { UrlObject } from "url";
import { useSwitchNetwork } from "wagmi";

import { NetworksContext } from "#/contexts/networks";

import { CustomConnectButton } from "./CustomConnectButton";

interface IHeader {
  linkUrl: UrlObject | __next_route_internal_types__.RouteImpl<string>;
  imageSrc?: string;
  title: string;
  children?: ReactNode;
}

export function Header({ linkUrl, imageSrc, title, children }: IHeader) {
  return (
    <div className="flex h-20 flex-wrap items-center justify-between border-b border-gray-700 bg-gray-800 p-4 text-white">
      <Link href={linkUrl} className="mr-5 flex items-center gap-3">
        {imageSrc && <Image src={imageSrc} height={50} width={50} alt="" />}
        <h1 className="flex gap-2 text-xl font-thin not-italic leading-4 text-gray-200">
          Balancer <p className="font-medium">{title}</p>
        </h1>
      </Link>
      {children}
      <CustomConnectButton />
    </div>
  );
}

export function HeaderNetworkMismatchAlert() {
  const { mismatchedNetworks, urlPathNetwork } =
    React.useContext(NetworksContext);

  const { switchNetwork } = useSwitchNetwork({ chainId: urlPathNetwork });

  if (!mismatchedNetworks || !urlPathNetwork) return null;

  return (
    <div className="flex min-h-[50px] flex-row items-center justify-center bg-blue6 text-white">
      <ExclamationTriangleIcon className="mr-3 h-4 w-4" />
      <p className="pr-4">
        You're seeing a pool in {networkFor(urlPathNetwork)}. Please switch
        networks to be able to edit it.
      </p>
      <button
        className="inline-block h-6 cursor-pointer rounded-lg border-none bg-gray-800 px-2 text-xs text-white shadow hover:bg-white hover:text-blue6 hover:shadow-none"
        onClick={() => switchNetwork?.()}
      >
        Switch network
      </button>
    </div>
  );
}
