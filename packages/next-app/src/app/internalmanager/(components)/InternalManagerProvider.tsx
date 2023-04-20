"use client";

import { useAccount } from "wagmi";

import WalletNotConnected from "#/components/WalletNotConnected";

export function InternalManagerProvider({ children }: React.PropsWithChildren) {
  const { isConnected } = useAccount();

  return <>{isConnected ? children : <WalletNotConnected />}</>;
}
