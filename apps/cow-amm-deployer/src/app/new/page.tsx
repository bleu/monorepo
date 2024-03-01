"use client";

import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { FieldValues } from "react-hook-form";
import { formatUnits } from "viem";

import { HomeWrapper } from "#/components/HomeWrapper";
import { Spinner } from "#/components/Spinner";
import WalletNotConnected from "#/components/WalletNotConnected";
import { useRunningAMM } from "#/hooks/useRunningAmmInfo";
import { TRANSACTION_TYPES } from "#/lib/transactionFactory";
import { ICowAmm } from "#/lib/types";
import { supportedChainIds } from "#/utils/chainsPublicClients";

import { FormWrapper } from "./(components)/FormWrapper";

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

export default function Page() {
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

  const defaultValues =
    isAmmRunning && cowAmm ? cowAmmToFormValues(cowAmm) : undefined;

  if (!supportedChainIds.includes(safe.chainId)) {
    <HomeWrapper isAmmRunning={false} unsuportedChain={true} />;
  }

  return (
    <FormWrapper
      transactionType={transactionType}
      defaultValues={defaultValues}
    />
  );
}
