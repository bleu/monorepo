"use client";

import Image from "next/image";

import SelectPoolImage from "#/assets/choose-pool.svg";
import Spinner from "#/components/Spinner";
import WalletNotConnected from "#/components/WalletNotConnected";
import { useAccount } from "#/wagmi";

export default function Page() {
  const { isConnected, isReconnecting, isConnecting } = useAccount();

  if (!isConnected && !isReconnecting && !isConnecting) {
    return <WalletNotConnected />;
  }

  if (isConnecting || isReconnecting) {
    return <Spinner />;
  }

  return (
    <div className="w-full rounded-3xl items-center py-16 px-12 md:py-20 flex flex-col">
      <div className="text-center text-amber9 text-3xl">
        Pick a pool on the side
      </div>
      <Image src={SelectPoolImage} height={400} width={400} alt="" />
    </div>
  );
}
