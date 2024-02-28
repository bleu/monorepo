"use client";

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
import { ChainId } from "#/utils/chainsPublicClients";
import { getUniV2PairUrl } from "#/utils/univ2pairUrl";

import { PoolCompositionTable } from "./(components)/PoolCompositionTable";

export function HomePageWrapper() {
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

  if (safe.chainId !== mainnet.id && safe.chainId !== gnosis.id) {
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
              <h1 className="text-3xl text-slate12">
                CoW AMM (Automatic Market Maker)
              </h1>
              <span>
                There isn't any AMM running. Create it to provide liquidity
                without suffering with LVR.
              </span>
            </div>
            <div className="flex gap-4">
              <LinkComponent
                loaderColor="amber"
                href={`/amm/new`}
                content={
                  <Button
                    className="flex items-center gap-1 py-3 px-6"
                    title="New order"
                  >
                    <PlusIcon />
                    Create AMM
                  </Button>
                }
              />
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
              This will make CoW AMM stop to re-balancing the funds on your
              behalf. The tokens will stay on your Safe Wallet.
            </span>
            <div className="flex">
              <Button
                className="flex items-center gap-1 py-3 px-6"
                onClick={async () => {
                  await sendTransactions([
                    {
                      type: TRANSACTION_TYPES.STOP_COW_AMM,
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
            <h1 className="text-3xl text-slate12">
              CoW AMM (Automatic Market Maker)
            </h1>
            <div className="flex flex-row gap-x-1 items-center">
              <span>Using price information from {cowAmm.priceOracle}</span>
              {priceOracleLink && (
                <Link href={priceOracleLink} target="_blank">
                  <ArrowTopRightIcon className="hover:text-slate11" />
                </Link>
              )}
            </div>
          </div>
          <div className="flex gap-4">
            <Button
              className="flex items-center gap-1 py-3 px-6 "
              color="tomato"
              onClick={() => {
                setOpenDialog(true);
              }}
            >
              <StopIcon />
              Stop
            </Button>
            <Button className="flex items-center gap-1 py-3 px-6" disabled>
              <Pencil2Icon />
              Edit
            </Button>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-xl my-2 border-b-2 border-blue7">
            AMM Composition
          </span>
        </div>
        <PoolCompositionTable cowAmm={cowAmm} />
      </div>
    </div>
  );
}
