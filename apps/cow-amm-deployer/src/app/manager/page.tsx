"use client";

import { formatNumber } from "@bleu-fi/utils/formatNumber";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import {
  ArrowTopRightIcon,
  Pencil2Icon,
  StopIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";

import Button from "#/components/Button";
import { Dialog } from "#/components/Dialog";
import { Spinner } from "#/components/Spinner";
import WalletNotConnected from "#/components/WalletNotConnected";
import { useRawTxData } from "#/hooks/useRawTxData";
import { useRunningAMM } from "#/hooks/useRunningAmmInfo";
import { TRANSACTION_TYPES } from "#/lib/transactionFactory";
import { PRICE_ORACLES } from "#/lib/types";
import { getBalancerPoolUrl } from "#/utils/balancerPoolUrl";
import { ChainId, supportedChainIds } from "#/utils/chainsPublicClients";
import { getUniV2PairUrl } from "#/utils/univ2pairUrl";

import { UnsuportedChain } from "../../components/UnsuportedChain";
import { PoolCompositionTable } from "./(components)/PoolCompositionTable";

export default function Page() {
  const router = useRouter();
  const { sendTransactions } = useRawTxData();
  const { safe, connected } = useSafeAppsSDK();
  const { loaded, cowAmm } = useRunningAMM();
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

  const priceOracleLink =
    cowAmm.priceOracle === PRICE_ORACLES.BALANCER
      ? getBalancerPoolUrl(
          safe.chainId as ChainId,
          cowAmm.priceOracleData?.balancerPoolId,
        )
      : getUniV2PairUrl(
          safe.chainId as ChainId,
          cowAmm.priceOracleData?.uniswapV2PairAddress,
        );

  return (
    <div className="flex w-full justify-center">
      <Dialog
        content={
          <div className="flex flex-col gap-3">
            <span className="text-seashell">
              Clicking confirm will make the CoW AMM LP position created stop.
              This means that the position will no longer be actively
              rebalanced. Don't worry, the tokens will stay on your Safe Wallet.
            </span>
            <Button
              className="text-center gap-1 py-3 px-6"
              color="tomato"
              onClick={async () => {
                await sendTransactions([
                  {
                    type: TRANSACTION_TYPES.STOP_COW_AMM,
                    chainId: safe.chainId as ChainId,
                  },
                ]).then(() => {
                  router.push("/stoptxprocessing");
                });
                setOpenDialog(false);
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
      <div className="my-10 flex w-9/12 flex-col gap-y-5 justify center">
        <div className="flex items-center justify-between gap-x-8">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl">
              The first <i className="text-purple9">MEV-Capturing AMM</i>,
              brought to you by <i className="text-amber9">CoW DAO</i>{" "}
            </h2>
            <div className="flex flex-row gap-x-1 items-center">
              <span>Using price information from {cowAmm.priceOracle}</span>
              {priceOracleLink && (
                <Link href={priceOracleLink} target="_blank">
                  <ArrowTopRightIcon className="hover:text-slate11" />
                </Link>
              )}
            </div>
          </div>
          <div className="flex flex-col bg-amber9 text-amm-brown py-2 px-8 rounded-lg">
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
          <span className="text-xl my-2 border-b-2 border-amber9">
            AMM Composition
          </span>
        </div>
        <PoolCompositionTable cowAmm={cowAmm} />
        <div className="flex gap-4">
          <Button
            className="flex items-center gap-1 py-3 px-6 "
            color="tomato"
            onClick={() => {
              setOpenDialog(true);
            }}
          >
            <StopIcon />
            Stop CoW AMM LP position
          </Button>
          <Button
            className="flex items-center gap-1 py-3 px-6"
            onClick={() => {
              router.push("/new");
            }}
          >
            <Pencil2Icon />
            Edit CoW AMM parameters
          </Button>
        </div>
      </div>
    </div>
  );
}
