"use client";

import Image from "next/image";
import { useAccount } from "wagmi";

import SelectPoolImage from "#/assets/choose-pool.svg";
import ConnectWalletImage from "#/assets/connect-wallet.svg";

export default function Page() {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return <WalletNotConnectedState />;
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-900">
      <h1 className="mb-4 flex h-12 items-center text-center	 text-3xl font-medium not-italic text-yellow-500">
        Choose a pool on the side!
      </h1>
      <Image src={SelectPoolImage} height={400} width={400} alt="" />
    </div>
  );
}

function WalletNotConnectedState() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-900">
      <h1 className="flex h-12 items-center text-center text-3xl font-medium not-italic text-gray-400">
        Your metadata pools will appear here
      </h1>
      <h1 className="mb-4 flex h-12 items-center text-center	 text-3xl font-medium not-italic text-yellow-300">
        Please, connect your wallet
      </h1>
      <Image src={ConnectWalletImage} height={500} width={500} alt="" />
    </div>
  );
}
