"use client";

import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";

import { HomeWrapper } from "#/components/HomeWrapper";
import { UnsuportedChain } from "#/components/UnsuportedChain";
import WalletNotConnected from "#/components/WalletNotConnected";
import { supportedChainIds } from "#/utils/chainsPublicClients";

export default function Page() {
  const { connected, safe } = useSafeAppsSDK();

  if (!connected) {
    return <WalletNotConnected />;
  }

  if (!supportedChainIds.includes(safe.chainId)) {
    return <UnsuportedChain />;
  }

  return <HomeWrapper />;
}
