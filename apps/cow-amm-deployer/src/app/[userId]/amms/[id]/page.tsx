import { formatNumber } from "@bleu/utils/formatNumber";
import {
  ArrowTopRightIcon,
  Pencil2Icon,
  ResetIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { Address } from "viem";

import { Button } from "#/components/Button";
import { buildAccountCowExplorerUrl } from "#/lib/cowExplorer";
import { fetchAmmData } from "#/lib/fetchAmmData";
import { ChainId } from "#/utils/chainsPublicClients";

import { PoolCompositionTable } from "./(components)/PoolCompositionTable";
import { PriceInformation } from "./(components)/PriceInformation";
import { TradingControlButton } from "./(components)/TradingControlButton";

export default async function Page({
  params,
}: {
  params: { userId: string; id: string };
}) {
  const ammData = await fetchAmmData(params.id);

  return (
    <div className="flex w-full justify-center">
      <div className="my-10 flex w-9/12 flex-col gap-y-5 justify-center">
        <div className="flex items-center justify-between gap-x-8">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-serif">
              The first <i className="text-purple">MEV-Capturing AMM</i>,
              brought to you by <i className="text-yellow">CoW DAO</i>
            </h2>
            {ammData.disabled ? (
              <span>
                This AMM is currently{" "}
                <i className="text-destructive">disabled</i>
              </span>
            ) : (
              <PriceInformation cowAmm={ammData} />
            )}
          </div>

          <div className="flex flex-col bg-yellow/40 text-foreground py-2 px-8">
            <span className="text-sm">Total Value</span>
            <span className="text-2xl">
              ${" "}
              {formatNumber(
                ammData.totalUsdValue,
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
                  chainId: ammData.order.chainId as ChainId,
                  address: ammData.order.owner as Address,
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
        <PoolCompositionTable cowAmm={ammData} />
        <div className="flex gap-4 items-center">
          <Link href={`/${params.userId}/amms`}>
            <Button
              className="flex items-center gap-1 py-3 px-6"
              variant="ghost"
            >
              <ResetIcon />
              Back to AMMs table
            </Button>
          </Link>
          <TradingControlButton ammData={ammData} />
          {!ammData.disabled && (
            <Button className="flex items-center gap-1 py-3 px-6" disabled>
              <Pencil2Icon />
              Edit parameters
            </Button>
          )}
          <Link href={`/amms/${params.id}/withdraw`}>
            <Button
              className="flex items-center gap-1 py-3 px-6"
              variant="highlight"
            >
              Withdraw
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
