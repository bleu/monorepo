"use client";

import Image from "next/image";

import { Spinner } from "#/components/Spinner";
import WalletNotConnected from "#/components/WalletNotConnected";
import { useAccount, useNetwork } from "#/wagmi";

export default function Page() {
  const { isConnected, isReconnecting, isConnecting } = useAccount();
  const { chain } = useNetwork();

  if (!isConnected && !isReconnecting && !isConnecting) {
    return <WalletNotConnected />;
  }

  if (isConnecting || isReconnecting) {
    return <Spinner />;
  }

  return (
    <div className="flex w-full flex-col items-center rounded-3xl px-12 py-16 md:py-20">
      <div className="text-center text-3xl text-amber9 flex flex-col">
        <span>You are on {chain?.name}</span>
        <span>Pick a pool on the side</span>
      </div>
      <Image src={"/assets/choose-pool.svg"} height={400} width={400} alt="" />
    </div>
  );
}
