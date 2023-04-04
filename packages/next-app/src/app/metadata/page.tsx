"use client";

import Image from "next/image";
import { useAccount } from "wagmi";

import SelectPoolImage from "#/assets/choose-pool.svg";
import WalletNotConnected from "#/components/WalletNotConnected";

export default function Page() {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return <WalletNotConnected />;
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
