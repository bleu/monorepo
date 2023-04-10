"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAccount, useNetwork } from "wagmi";

import WalletNotConnected from "#/components/WalletNotConnected";

export function InternalManagerProvider({ children }: React.PropsWithChildren) {
  const { isConnected } = useAccount();

  const { chain } = useNetwork();
  const { push } = useRouter();

  useEffect(() => {
    if (chain) push("/internalmanager");
  }, [chain]);

  return isConnected ? children : <WalletNotConnected />;
}
