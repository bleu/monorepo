"use client";

import { Network } from "@bleu/utils";
import {
  ChevronRightIcon,
  ClipboardIcon,
  ExternalLinkIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { ReactNode, useState } from "react";
import invariant from "tiny-invariant";

import { Toast } from "#/components/Toast";
import { Pool } from "#/lib/balancer/gauges";

import { generatePoolPageLink } from "../(utils)/getFilteredApiUrl";
import { parseMMDDYYYYToDate } from "../api/(utils)/date";

function getPoolExternalUrl({
  network,
  poolId,
}: {
  network: string;
  poolId: string;
}) {
  let url: string;

  switch (network) {
    case Network.Gnosis:
      url = `https://app.balancer.fi/#/${network}-chain/pool/${poolId}`;
      break;
    case Network.Optimism:
      url = `https://op.beets.fi/pool/${poolId}`;
      break;
    default:
      url = `https://app.balancer.fi/#/${network}/pool/${poolId}`;
      break;
  }
  return url;
}

function BreadcrumbItem({
  link,
  children,
  classNames,
}: {
  link?: string;
  children?: ReactNode;
  classNames?: string;
}) {
  return (
    <li aria-current="page" className={classNames}>
      <div className="flex items-center">
        <ChevronRightIcon />
        {link ? (
          <a
            href={link}
            className={`flex ml-1 text-xs sm:text-sm font-medium text-white hover:text-blue-600 md:ml-2 whitespace-nowrap`}
          >
            {children}
          </a>
        ) : (
          <div
            className={`flex ml-1 text-xs sm:text-sm font-medium text-white md:ml-2 whitespace-nowrap`}
          >
            {children}
          </div>
        )}
      </div>
    </li>
  );
}

export default function Breadcrumb() {
  const { poolId, network } = useParams();
  invariant(!Array.isArray(poolId), "poolId cannot be a list");
  invariant(!Array.isArray(network), "network should not be an array");
  const searchParams = useSearchParams();
  const startAt = searchParams.get("startAt");
  const endAt = searchParams.get("endAt");

  const [isNotifierOpen, setIsNotifierOpen] = useState<boolean>(false);

  let selectedPool;
  if (poolId) {
    selectedPool = new Pool(poolId);
  }

  return (
    <>
      <nav
        className="border border-blue6 bg-blue3 text-white justify-between px-4 py-3 rounded-lg flex sm:px-5 h-16"
        aria-label="Breadcrumb"
      >
        <ol className="inline-flex items-center space-x-1 mb-0">
          <li className="hidden sm:block">
            <div className="flex items-center">
              <div className="ml-1 text-sm font-medium text-slate-300 md:ml-2">
                <Link href="/apr/">Home</Link>
              </div>
            </div>
          </li>
          {network && (
            <BreadcrumbItem
              classNames="hidden sm:block"
              link={generatePoolPageLink(
                parseMMDDYYYYToDate(searchParams.get("startAt")) as Date,
                parseMMDDYYYYToDate(searchParams.get("endAt")) as Date,
                { network },
              )}
            >
              {network}
            </BreadcrumbItem>
          )}
          {poolId && (
            <BreadcrumbItem
              classNames="hidden sm:block"
              link={`/apr/pool/${network}/${poolId}?${searchParams.toString()}`}
            >
              {selectedPool?.symbol ?? poolId}
            </BreadcrumbItem>
          )}
          <BreadcrumbItem
            link={generatePoolPageLink(
              parseMMDDYYYYToDate(searchParams.get("startAt")) as Date,
              parseMMDDYYYYToDate(searchParams.get("endAt")) as Date,
            )}
          >
            <div className="flex items-center gap-x-2">
              {startAt} - {endAt}
            </div>
          </BreadcrumbItem>
        </ol>
        {poolId && (
          <div className="flex">
            <Link
              href={getPoolExternalUrl({ network, poolId })}
              target="_blank"
              className="inline-flex items-center px-3 py-2 text-sm font-normal text-center text-white bg-blue6 border border-blue9 rounded-lg hover:bg-blue7 sm:mr-3"
            >
              <span className="hidden md:block">Show on Balancer&nbsp;</span>
              <ExternalLinkIcon />
            </Link>
            &nbsp;
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setIsNotifierOpen(true);
              }}
              className="inline-flex items-center px-3 py-2 text-sm font-normal text-center text-white bg-blue6 border border-blue9 rounded-lg hover:bg-blue7"
            >
              <span className="hidden md:block">Copy Link&nbsp;</span>
              <ClipboardIcon />
            </button>
          </div>
        )}
      </nav>
      <Toast
        content={<ToastContent />}
        isOpen={isNotifierOpen}
        setIsOpen={setIsNotifierOpen}
        duration={5000}
      />
    </>
  );
}

function ToastContent() {
  return (
    <div className="flex h-14 flex-row items-center justify-between px-4 py-8">
      <div className="flex flex-col justify-between space-y-1">
        <h1 className="text-xl font-medium text-slate12">Link copied</h1>
      </div>
    </div>
  );
}
