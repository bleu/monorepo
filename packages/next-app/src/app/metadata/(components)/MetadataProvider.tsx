"use client";

import { Pool } from "@balancer-pool-metadata/balancer-gql/src/gql/__generated__/mainnet";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAccount, useNetwork } from "wagmi";

import EmptyWalletImage from "#/assets/empty-wallet.svg";
import {
  PoolMetadataProvider,
  usePoolMetadata,
} from "#/contexts/PoolMetadataContext";
import { impersonateWhetherDAO } from "#/lib/gql";
import { fetchOwnedPools } from "#/utils/fetcher";

import { MetadataSidebar } from "./MetadataSidebar";

export function MetadataProvider({ children }: { children: React.ReactNode }) {
  return (
    <PoolMetadataProvider>
      <MetadataContent>{children}</MetadataContent>
    </PoolMetadataProvider>
  );
}

function MetadataContent({ children }: { children: React.ReactNode }) {
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const { push } = useRouter();
  const { poolsData, changeSetPoolsData } = usePoolMetadata();

  let { address } = useAccount();
  address = impersonateWhetherDAO(chain?.id.toString() || "1", address);

  //talvez esse useeffect seja no contexto e passamos o poolsdata pro contexto
  useEffect(() => {
    if (!address) return;
    fetchOwnedPools(address, chain?.id.toString() || "1")
      .then((response) => changeSetPoolsData(response.pools as Pool[]))
      .catch(() => changeSetPoolsData([]));
  }, [chain, address]);

  useEffect(() => {
    if (chain) push("/metadata");
  }, [chain]);
  return (
    <>
      {isConnected && poolsData && !!poolsData.length ? (
        <div className="flex h-full w-full">
          <div className="h-full w-96">
            <MetadataSidebar />
          </div>
          {children}
        </div>
      ) : isConnected ? (
        <WalletEmptyState />
      ) : (
        <div className="flex h-screen w-full pl-4 sm:pl-6 lg:pl-12">
          {children}
        </div>
      )}
    </>
  );
}

export function WalletEmptyState() {
  return (
    <div className="flex h-full w-full">
      <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-900">
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
