"use client";

import { Network } from "@bleu-fi/utils";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { FieldValues } from "react-hook-form";
import { formatUnits } from "viem";

import { Spinner } from "#/components/Spinner";
import WalletNotConnected from "#/components/WalletNotConnected";
import { useRunningAMM } from "#/hooks/useRunningAmmInfo";
import { TRANSACTION_TYPES } from "#/lib/transactionFactory";
import { ICowAmm } from "#/lib/types";
import { supportedChainIds } from "#/utils/chainsPublicClients";

import { FormWrapper } from "../(components)/FormWrapper";

function cowAmmToFormValues(cowAmm: ICowAmm): FieldValues {
  return {
    token0: cowAmm.token0.tokenInfo,
    token1: cowAmm.token1.tokenInfo,
    minTradedToken0: formatUnits(
      BigInt(cowAmm.minTradedToken0),
      cowAmm.token0.tokenInfo.decimals,
    ),
    priceOracle: cowAmm.priceOracle,
    balancerPoolId: cowAmm.priceOracleData.balancerPoolId,
    uniswapV2Pair: cowAmm.priceOracleData.uniswapV2PairAddress,
  };
}

export default function Page({
  params,
}: {
  params: {
    network: Network;
  };
}) {
  const { safe, connected } = useSafeAppsSDK();
  const { loaded, isAmmRunning, cowAmm } = useRunningAMM();

  if (!connected) {
    return <WalletNotConnected />;
  }

  if (!loaded) {
    return <Spinner />;
  }

  const transactionType = isAmmRunning
    ? TRANSACTION_TYPES.EDIT_COW_AMM
    : TRANSACTION_TYPES.CREATE_COW_AMM;

  const defaultValues = cowAmm ? cowAmmToFormValues(cowAmm) : undefined;

  if (!supportedChainIds.includes(safe.chainId)) {
    return (
      <div className="flex h-full w-full flex-col items-center rounded-3xl px-12 py-16 md:py-20">
        <div className="text-center text-3xl text-amber9">
          You are on the wrong network
        </div>
        <div className="text-xl text-white">
          Please change to {params.network}
        </div>
      </div>
    );
  }

  return (
    <FormWrapper
      transactionType={transactionType}
      defaultValues={defaultValues}
    />
  );
}