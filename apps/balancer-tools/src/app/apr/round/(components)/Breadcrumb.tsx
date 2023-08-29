"use client";
import {
  ChevronRightIcon,
  ClipboardIcon,
  ExternalLinkIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import React, { ReactNode } from "react";

import { Pool } from "#/lib/balancer/gauges";

import { Round } from "../../(utils)/rounds";

function BreadcrumbItem({
  content,
  link,
  children,
}: {
  content: string;
  link?: string;
  children?: ReactNode;
}) {
  return (
    <li aria-current="page">
      <div className="flex items-center">
        <ChevronRightIcon />
        {link ? (
          <a
            href={link}
            className="flex ml-1 text-sm font-medium text-white hover:text-blue-600 md:ml-2"
          >
            {content}
            {children}
          </a>
        ) : (
          <div className="flex ml-1 text-sm font-medium text-white md:ml-2">
            {content}
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
  if (!roundId) return <BreadcrumbItem content={`No Round selected`} />;
  return (
    <BreadcrumbItem content={`Round ${roundId}`} link={`/apr/round/${roundId}`}>
      {!poolId && Round.currentRound().value == roundId && (
        <span className="bg-blue6 border border-blue9 text-white text-xs font-semibold mr-2 px-2 py-0.5 ml-4 rounded flex">
          Current
        </span>
      )}{" "}
    </BreadcrumbItem>
  );
}

export default function Breadcrumb({
  roundId,
  poolId,
  network,
}: {
  roundId?: string | undefined;
  poolId?: string | undefined;
  network?: string | undefined;
}) {
  let selectedPool;
  if (poolId) {
    selectedPool = new Pool(poolId);
  }

  return (
    <nav
      className="border border-blue6 bg-blue3 text-white justify-between px-4 py-3 rounded-lg sm:flex sm:px-5"
      aria-label="Breadcrumb"
    >
      <ol className="inline-flex items-center mb-3 space-x-1 md:space-x-3 sm:mb-0">
        <li>
          <div className="flex items-center">
            <div className="ml-1 text-sm font-medium text-slate-300 md:ml-2">
              Historical APR
            </div>
          </div>
        </li>
        {displaySelectedRound(roundId, poolId)}
        {/* 
        TODO: BAL-654 - Add a per chain page */}
        {network && (
          <BreadcrumbItem link={`/apr/pool/${network}/`} content={network} />
        )}
        {poolId && (
          <BreadcrumbItem
            content={selectedPool?.symbol ?? poolId}
            link={`/apr/pool/${network}/${poolId}`}
          />
        )}
      </ol>
      {poolId && (
        <div>
          <Link
            href={`https://app.balancer.fi/#/${
              network == "gnosis" ? network + "-chain" : network
            }/pool/${poolId}`}
            target="_blank"
            className="inline-flex items-center px-3 py-2 text-sm font-normal text-center text-white bg-blue6 border border-blue9 rounded-lg hover:bg-blue7 mr-3"
          >
            <span>Show on Balancer&nbsp;</span>
            <ExternalLinkIcon />
          </Link>
          &nbsp;
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
            }}
            className="inline-flex items-center px-3 py-2 text-sm font-normal text-center text-white bg-blue6 border border-blue9 rounded-lg hover:bg-blue7"
          >
            <span>Copy Link&nbsp;</span>
            <ClipboardIcon />
          </button>
        </div>
      )}
    </nav>
  );
}
