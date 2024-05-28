"use client";

import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";

import WalletNotConnected from "#/components/WalletNotConnected";
import { TRANSACTION_TYPES } from "#/lib/transactionFactory";
import { supportedChainIds } from "#/utils/chainsPublicClients";

import { UnsuportedChain } from "../../components/UnsuportedChain";
import { FormWrapper } from "./(components)/FormWrapper";

export default function Page() {
  const { safe, connected } = useSafeAppsSDK();

  if (!connected) {
    return <WalletNotConnected />;
  }

  if (!supportedChainIds.includes(safe.chainId)) {
    return <UnsuportedChain />;
  }

  return <FormWrapper transactionType={TRANSACTION_TYPES.CREATE_COW_AMM} />;
}
