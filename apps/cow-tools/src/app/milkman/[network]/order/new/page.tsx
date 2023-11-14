"use client";

import { Address, Network } from "@bleu-fi/utils";
import { useAccount, useNetwork } from "wagmi";

import { TransactionCard } from "#/app/milkman/(components)/TransactionCard";
import { Spinner } from "#/components/Spinner";
import WalletNotConnected from "#/components/WalletNotConnected";
import { getNetwork } from "#/contexts/networks";

export type tokenPriceChecker = {
  symbol: string;
  address: string;
  decimals: number;
};

export default function Page({
  params,
}: {
  params: {
    network: Network;
  };
}) {
  const { chain } = useNetwork();
  const { isConnected, isReconnecting, isConnecting } = useAccount();
  const { address } = useAccount();

  const addressLower = address ? address?.toLowerCase() : "";

  if (!isConnected && !isReconnecting && !isConnecting) {
    return <WalletNotConnected />;
  }

  if (isConnecting || isReconnecting) {
    return <Spinner />;
  }

  const network = getNetwork(chain?.name);

  if (network !== params.network) {
    return (
      <div className="flex h-full w-full flex-col items-center rounded-3xl px-12 py-16 md:py-20">
        <div className="text-center text-3xl text-amber9">
          You are on the wrong network
        </div>
        <div className="text-xl text-white">
          Please change to {params.network}
        </div>
      </div>
    );
  }

  return (
    <>
      <TransactionCard
        userAddress={addressLower as Address}
        chainId={chain?.id}
      />
    </>
  );
}
