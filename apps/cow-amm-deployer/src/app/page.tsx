"use client";

import { useAccount } from "wagmi";

import { HomePageWrapper } from "#/components/HomePageWrapper";
import { UnsuportedChain } from "#/components/UnsuportedChain";
import WalletNotConnected from "#/components/WalletNotConnected";
import { useAutoConnect } from "#/hooks/tx-manager/useAutoConnect";
import { ChainId, supportedChainIds } from "#/utils/chainsPublicClients";

export default function Page() {
  const { address: safeAddress, chainId, isConnected } = useAccount();

  useAutoConnect();

  if (!isConnected) {
    return <WalletNotConnected />;
  }

  if (chainId && !supportedChainIds.includes(chainId as ChainId)) {
    return <UnsuportedChain />;
  }

  const userId = `${safeAddress}-${chainId}`;

  return <HomePageWrapper userId={userId} />;
}
