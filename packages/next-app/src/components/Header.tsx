"use client";

import Image from "next/image";
import Link from "next/link";
import { UrlObject } from "url";

import { CustomConnectButton } from "./CustomConnectButton";

interface IHeader {
  linkUrl: UrlObject | __next_route_internal_types__.RouteImpl<string>;
  imageSrc?: string;
  title: string;
}

export function Header({ linkUrl, imageSrc, title }: IHeader) {
  return (
    <div className="flex flex-wrap items-center justify-between border-b border-gray-700 bg-gray-800 p-4 text-white">
      <Link href={linkUrl} className="mr-5 flex items-center gap-3">
        {imageSrc && <Image src={imageSrc} height={50} width={50} alt="" />}
        <h1 className="flex gap-2 text-4xl font-thin not-italic leading-8 text-gray-200">
          Balancer <p className="font-medium">{title}</p>
        </h1>
      </Link>
      <CustomConnectButton />
    </div>
  );
}
