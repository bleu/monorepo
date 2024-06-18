"use client";

import { useAccount } from "wagmi";

import { HomePageWrapper } from "#/components/HomePageWrapper";
import { useAutoConnect } from "#/hooks/tx-manager/useAutoConnect";

export default function Page() {
  const { address: safeAddress, chainId } = useAccount();

  useAutoConnect();
  const userId = `${safeAddress}-${chainId}`;

  return <HomePageWrapper userId={userId} />;
}
