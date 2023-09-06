"use client";

import {
  ChevronRightIcon,
  ClipboardIcon,
  ExternalLinkIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ReactNode, useState } from "react";
import invariant from "tiny-invariant";

import { Badge } from "#/components/Badge";
import { Toast } from "#/components/Toast";
import { Pool } from "#/lib/balancer/gauges";

import { Round } from "../../(utils)/rounds";

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

function displaySelectedRound(
  roundId: string | undefined,
  poolId: string | undefined,
) {
  if (!roundId) return <BreadcrumbItem>No Round selected</BreadcrumbItem>;

  return (
    <BreadcrumbItem link={`/apr/round/${roundId}`}>
      <div className="flex items-center gap-x-2">
        Round {roundId}{" "}
        {!poolId && Round.currentRound().value == roundId && (
          <Badge color="blue" size="sm" outline>
            Current
          </Badge>
        )}
      </div>
    </BreadcrumbItem>
  );
}

export default function Breadcrumb() {
  const { poolId, roundId, network } = useParams();
  invariant(!Array.isArray(poolId), "poolId cannot be a list");
  invariant(!Array.isArray(roundId), "roundId cannot be a list");
  invariant(!Array.isArray(network), "network should not be an array");

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
              link={`/apr/pool/${network}/`}
            >
              {network}
            </BreadcrumbItem>
          )}
          {poolId && (
            <BreadcrumbItem
              classNames="hidden sm:block"
              link={`/apr/pool/${network}/${poolId}`}
            >
              {selectedPool?.symbol ?? poolId}
            </BreadcrumbItem>
          )}
          {displaySelectedRound(roundId, poolId)}
        </ol>
        {poolId && (
          <div className="flex">
            <Link
              href={`https://app.balancer.fi/#/${
                network == "gnosis" ? network + "-chain" : network
              }/pool/${poolId}`}
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
