"use client";

import { useAccount } from "wagmi";

import { HomePageWrapper } from "#/components/HomePageWrapper";

export default function Page() {
  const { address: safeAddress, chainId } = useAccount();

  const userId = `${safeAddress}-${chainId}`;

  return <HomePageWrapper userId={userId} />;
}
