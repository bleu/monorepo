"use client";

import Spinner from "#/components/Spinner";
import WalletNotConnected from "#/components/WalletNotConnected";
import { useAccount } from "#/wagmi";

import { TokenTable } from "./(components)/TokenTable";

export default function Page() {
  const { isConnected, isReconnecting, isConnecting } = useAccount();

  if (!isConnected && !isReconnecting && !isConnecting) {
    return <WalletNotConnected isInternalManager />;
  }

  if (isConnecting || isReconnecting) {
    return <Spinner />;
  }

  return <TokenTable />;
}
