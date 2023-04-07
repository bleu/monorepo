"use client";

import Image from "next/image";

import SelectPoolImage from "#/assets/choose-pool.svg";
import WalletNotConnected from "#/components/WalletNotConnected";
import { useAccount } from "#/wagmi";

import { Loading } from "./(components)/Loading";

export default function Page() {
  const { isConnected, isReconnecting, isConnecting } = useAccount();

  if (!isConnected && !isReconnecting && !isConnecting) {
    return <WalletNotConnected />;
  }

  if (isConnecting || isReconnecting) {
    return <Loading />;
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-gray-900">
      <h1 className="mb-4 flex h-12 items-center text-center	 text-3xl font-medium not-italic text-yellow-500">
        Choose a pool on the side!
      </h1>
      <Image src={SelectPoolImage} height={400} width={400} alt="" />
    </div>
  );
}
