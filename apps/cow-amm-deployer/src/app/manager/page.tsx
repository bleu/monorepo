"use client";

import { formatNumber } from "@bleu-fi/utils/formatNumber";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { tomatoDark } from "@radix-ui/colors";
import {
  ArrowTopRightIcon,
  ExclamationTriangleIcon,
  Pencil2Icon,
  ResetIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { Address } from "viem";

import { Button } from "#/components/Button";
import { Dialog } from "#/components/Dialog";
import { Spinner } from "#/components/Spinner";
import { Tooltip } from "#/components/Tooltip";
import WalletNotConnected from "#/components/WalletNotConnected";
import { useRawTxData } from "#/hooks/useRawTxData";
import { useRunningAMM } from "#/hooks/useRunningAmmInfo";
import { buildAccountCowExplorerUrl } from "#/lib/cowExplorer";
import { TRANSACTION_TYPES } from "#/lib/transactionFactory";
import { ChainId, supportedChainIds } from "#/utils/chainsPublicClients";

import { UnsuportedChain } from "../../components/UnsuportedChain";
import { PoolCompositionTable } from "./(components)/PoolCompositionTable";
import { PriceInformation } from "./(components)/PriceInformation";

export default function Page() {
  const router = useRouter();
  const { sendTransactions } = useRawTxData();
  const { safe, connected } = useSafeAppsSDK();
  const { loaded, cowAmm, isAmmFromModule } = useRunningAMM();
  const [openDialog, setOpenDialog] = useState(false);

  if (!connected) {
    return <WalletNotConnected />;
  }

  if (!loaded) {
    return <Spinner />;
  }

  if (!supportedChainIds.includes(safe.chainId)) {
    return <UnsuportedChain />;
  }

  if (!cowAmm) {
    redirect("/new");
  }

  return (
    <div className="flex w-full justify-center">
      <Dialog
        content={
          <div className="flex flex-col gap-3">
            <span className="text-primary-foreground">
              Clicking confirm will make the CoW AMM LP position created stop.
              This means that the position will no longer be actively
              rebalanced. Don't worry, the tokens will stay on your Safe Wallet.
            </span>
            <Button
              className="text-center gap-1 py-3 px-6"
              variant="destructive"
              onClick={async () => {
                setOpenDialog(false);
                await sendTransactions([
                  {
                    type: TRANSACTION_TYPES.STOP_COW_AMM,
                    chainId: safe.chainId as ChainId,
                  },
                ]).then(() => {
                  router.push("/stoptxprocessing");
                });
              }}
            >
              Confirm
            </Button>
          </div>
        }
        title="Stop CoW AMM Confirmation"
        isOpen={openDialog}
        setIsOpen={setOpenDialog}
      />
      <div className="my-10 flex w-9/12 flex-col gap-y-5 justify-center">
        <div className="flex items-center justify-between gap-x-8">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-serif">
              The first <i className="text-purple">MEV-Capturing AMM</i>,
              brought to you by <i className="text-yellow">CoW DAO</i>{" "}
            </h2>
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
                0.01,
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
                }),
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
            disabled={!isAmmFromModule}
            onClick={() => {
              setOpenDialog(true);
            }}
          >
            <ResetIcon />
            Stop CoW AMM LP
          </Button>
          <Button
            className="flex items-center gap-1 py-3 px-6"
            onClick={() => {
              router.push("/new");
            }}
            disabled={!isAmmFromModule}
          >
            <Pencil2Icon />
            Edit CoW AMM LP parameters
          </Button>
          {!isAmmFromModule && (
            <Tooltip content="This CoW AMM LP position was not created from the supported module.">
              <ExclamationTriangleIcon
                className="size-6"
                color={tomatoDark.tomato10}
              />
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
}
