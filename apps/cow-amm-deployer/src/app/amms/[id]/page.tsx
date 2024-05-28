"use client";

import { formatNumber } from "@bleu/utils/formatNumber";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import {
  ArrowTopRightIcon,
  Pencil2Icon,
  ResetIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { Address } from "viem";

import { Button } from "#/components/Button";
import { Spinner } from "#/components/Spinner";
import { UnsuportedChain } from "#/components/UnsuportedChain";
import WalletNotConnected from "#/components/WalletNotConnected";
import { useStandaloneAMM } from "#/hooks/useStandaloneAmm";
import { buildAccountCowExplorerUrl } from "#/lib/cowExplorer";
import { ChainId, supportedChainIds } from "#/utils/chainsPublicClients";

import { PoolCompositionTable } from "./(components)/PoolCompositionTable";
import { PriceInformation } from "./(components)/PriceInformation";

export default function Page({ params }: { params: { id: `0x${string}` } }) {
  const { data: cowAmm, loading } = useStandaloneAMM(params.id);

  const { safe, connected } = useSafeAppsSDK();

  if (!connected) {
    return <WalletNotConnected />;
  }

  if (!cowAmm || loading) {
    return <Spinner />;
  }

  if (!supportedChainIds.includes(safe.chainId)) {
    return <UnsuportedChain />;
  }

  return (
    <div className="flex w-full justify-center">
      <div className="my-10 flex w-9/12 flex-col gap-y-5 justify-center">
        <div className="flex items-center justify-between gap-x-8">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-serif">
              The first <i className="text-purple">MEV-Capturing AMM</i>,
              brought to you by <i className="text-yellow">CoW DAO</i>{" "}
            </h2>
            {/* @ts-ignore */}
            <PriceInformation cowAmm={cowAmm} />
          </div>
          <div className="flex flex-col bg-yellow/40 text-foreground py-2 px-8">
            <span className="text-sm">Total Value</span>
            <span className="text-2xl">
              ${" "}
              {formatNumber(
                cowAmm.totalUsdValue,
                2,
                "decimal",
                "compact",
                0.01
              )}
            </span>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-xl my-2 border-b-2 border-primary">
            AMM Composition
          </span>
          <Link
            className="text-primary hover:text-primary/90 inline-flex items-center gap-1 text-sm"
            href={
              new URL(
                buildAccountCowExplorerUrl({
                  chainId: safe.chainId as ChainId,
                  address: safe.safeAddress as Address,
                })
              )
            }
            rel="noreferrer noopener"
            target="_blank"
          >
            See in CoW Explorer
            <ArrowTopRightIcon className="hover:text-primary" />
          </Link>
        </div>
        <PoolCompositionTable cowAmm={cowAmm} />
        <div className="flex gap-4 items-center ">
          <Button
            className="flex items-center gap-1 py-3 px-6 "
            variant="destructive"
            disabled
          >
            <ResetIcon />
            Stop CoW AMM LP
          </Button>
          <Button className="flex items-center gap-1 py-3 px-6" disabled>
            <Pencil2Icon />
            Edit CoW AMM LP parameters
          </Button>
        </div>
      </div>
    </div>
  );
}
