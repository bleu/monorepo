"use client";

import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";

import { HomeWrapper } from "#/components/HomeWrapper";
import { Spinner } from "#/components/Spinner";
import { UnsuportedChain } from "#/components/UnsuportedChain";
import WalletNotConnected from "#/components/WalletNotConnected";
import { useRunningAMM } from "#/hooks/useRunningAmmInfo";
import { supportedChainIds } from "#/utils/chainsPublicClients";

export default function Page() {
  const { connected, safe } = useSafeAppsSDK();
  const { isAmmRunning, loaded } = useRunningAMM();

  if (!loaded) {
    return <Spinner />;
  }

  if (!connected) {
    return <WalletNotConnected />;
  }

  if (!supportedChainIds.includes(safe.chainId)) {
    return <UnsuportedChain />;
  }

  return <HomeWrapper isAmmRunning={isAmmRunning} />;
}
