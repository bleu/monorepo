"use client";

import { formatNumber } from "@bleu-fi/utils/formatNumber";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import {
  ArrowTopRightIcon,
  Pencil2Icon,
  PlusIcon,
  StopIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { gnosis, mainnet } from "viem/chains";

import { Button } from "#/components";
import { Dialog } from "#/components/Dialog";
import { LinkComponent } from "#/components/Link";
import { Spinner } from "#/components/Spinner";
import WalletNotConnected from "#/components/WalletNotConnected";
import { useRawTxData } from "#/hooks/useRawTxData";
import { useRunningAMM } from "#/hooks/useRunningAmmInfo";
import { TRANSACTION_TYPES } from "#/lib/transactionFactory";
import { PRICE_ORACLES } from "#/lib/types";
import { getBalancerPoolUrl } from "#/utils/balancerPoolUrl";
import { ChainId, supportedChainIds } from "#/utils/chainsPublicClients";
import { getUniV2PairUrl } from "#/utils/univ2pairUrl";

import { PoolCompositionTable } from "./(components)/PoolCompositionTable";

export default function Page() {
  const router = useRouter();
  const { sendTransactions } = useRawTxData();
  const { safe, connected } = useSafeAppsSDK();
  const { loaded, isAmmRunning, cowAmm } = useRunningAMM();
  const [openDialog, setOpenDialog] = useState(false);

  if (!connected) {
    return <WalletNotConnected />;
  }

  if (!loaded) {
    return <Spinner />;
  }

  if (!supportedChainIds.includes(safe.chainId)) {
    return (
      <div className="flex h-full w-full flex-col items-center rounded-3xl px-12 py-16 md:py-20">
        <div className="text-center text-3xl text-amber9">
          This app isn't available on this network
        </div>
        <div className="text-xl text-white">
          Please change to {gnosis.name} or {mainnet.name}
        </div>
      </div>
    );
  }

  if (!isAmmRunning || !cowAmm) {
    return (
      <div className="flex w-full justify-center">
        <div className="my-10 flex w-9/12 flex-col gap-y-5 justify center">
          <div className="flex items-center justify-between gap-x-8">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl text-slate12">CoW AMM</h1>
              <h2 className="text-xl text-slate12">
                The first MEV-Capturing AMM, brought to you by CoW DAO
              </h2>
              <span>
                This safe does not have any CoW AMM liquidity pools active.
                Create a liquidity pool to enjoy passive rebalancing without
                losing from LVR.
              </span>
              <div className="flex gap-4 mt-2">
                <LinkComponent
                  loaderColor="amber"
                  href={`/amm/new`}
                  content={
                    <Button
                      className="flex items-center gap-1 py-3 px-6"
                      title="New order"
                    >
                      <PlusIcon />
                      Create CoW AMM LP
                    </Button>
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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
          <div className="flex flex-col gap-y-2">
            <span className="text-slate12">
              Clicking confirm will make the CoW AMM LP position created stop.
              This means that the position will no longer be actively
              rebalanced. Don't worry, the tokens will stay on your Safe Wallet.
            </span>
            <div className="flex">
              <Button
                className="flex items-center gap-1 py-3 px-6"
                onClick={async () => {
                  await sendTransactions([
                    {
                      type: TRANSACTION_TYPES.STOP_COW_AMM,
                      chainId: safe.chainId as ChainId,
                    },
                  ]);
                  router.refresh();
                }}
              >
                Confirm
              </Button>
            </div>
          </div>
        }
        title="Stop CoW AMM Confirmation"
        isOpen={openDialog}
        setIsOpen={setOpenDialog}
      />
      <div className="my-10 flex w-9/12 flex-col gap-y-5 justify center">
        <div className="flex items-center justify-between gap-x-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl text-slate12">CoW AMM</h1>
            <h2 className="text-xl text-slate12">
              The first MEV-Capturing AMM, brought to you by CoW DAO
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
          <div className="flex flex-col bg-blue3 p-5 rounded-lg w-min-64">
            <span className="text-sm text-slate9">Total Value</span>
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
          <span className="text-xl my-2 border-b-2 border-blue7">
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
          <Button className="flex items-center gap-1 py-3 px-6" disabled>
            <Pencil2Icon />
            Edit CoW AMM parameters
          </Button>
        </div>
      </div>
    </div>
  );
}
