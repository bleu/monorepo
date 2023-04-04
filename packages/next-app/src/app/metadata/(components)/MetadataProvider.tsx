"use client";

import { Pool } from "@balancer-pool-metadata/balancer-gql/src/gql/__generated__/mainnet";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount, useNetwork } from "wagmi";

import EmptyWalletImage from "#/assets/empty-wallet.svg";
import { PoolMetadataProvider } from "#/contexts/PoolMetadataContext";
import { impersonateWhetherDAO } from "#/lib/gql";
import { fetchOwnedPools } from "#/utils/fetcher";

import { Loading } from "./Loading";
import { Sidebar } from "./Sidebar";

export function MetadataProvider({ children }: { children: React.ReactNode }) {
  const [poolsData, setPoolsData] = useState<Pool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { chain } = useNetwork();
  const [selectedChain, setSelectedChain] = useState<number | undefined>(
    undefined
  );
  const { isConnected, isDisconnected } = useAccount();
  const { push } = useRouter();

  let { address } = useAccount();
  address = impersonateWhetherDAO(chain?.id.toString() || "1", address);

  useEffect(() => {
    if (!address) return;
    setIsLoading(true);
    fetchOwnedPools(address, chain?.id.toString() || "1")
      .then((response) => {
        setPoolsData(response.pools as Pool[]);
        setIsLoading(false);
      })
      .catch(() => {
        setPoolsData([]);
        setIsLoading(false);
      });
  }, [chain, address]);

  useEffect(() => {
    // case user switch the chain
    if (chain && selectedChain && chain.id !== selectedChain) {
      setSelectedChain(chain.id);
      push("/metadata");
    } else if (chain && !selectedChain) {
      setSelectedChain(chain.id);
    }
  }, [chain]);

  return (
    <PoolMetadataProvider>
      {isConnected && poolsData.length > 0 ? (
        <div className="flex h-full w-full">
          <div className="h-full w-96">
            <Sidebar pools={poolsData as Pool[]} />
          </div>
          {children}
        </div>
      ) : isConnected && !isLoading && !poolsData.length ? (
        <WalletEmptyState />
      ) : (
        <div className="flex h-full w-full pl-4 sm:pl-6 lg:pl-12">
          {(isLoading || !address) && !isDisconnected ? <Loading /> : children}
        </div>
      )}
    </PoolMetadataProvider>
  );
}

export function WalletEmptyState() {
  return (
    <div className="flex h-full w-full">
      <div className="flex h-full w-full flex-col items-center justify-center bg-gray-900">
        <h1 className="flex h-12 items-center text-center text-3xl font-medium not-italic text-gray-400">
          There are no pools in this network!
        </h1>
        <h1 className="mb-4 flex h-12 items-center text-center	 text-3xl font-medium not-italic text-yellow-300">
          Please, choose other network.
        </h1>
        <Image src={EmptyWalletImage} height={500} width={500} alt="" />
      </div>
    </div>
  );
}
