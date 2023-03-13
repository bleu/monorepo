"use client";

import { createContext, ReactNode, useState } from "react";

export function toSlug(string?: string) {
  return (
    string
      ?.toLowerCase()
      ?.replace(/ /g, "-")
      ?.replace(/[^\w-]+/g, "") || ""
  );
}

const cellData: {
  id: string;
  key: string;
  typename: string;
  description: string;
  value: React.ReactNode;
}[] = [
  {
    id: "pool-address",
    key: "Pool Address",
    typename: "address",
    description:
      "The address of the smart contract that implements the exchange pool",
    value: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
  },
  {
    id: "pool-link",
    key: "Pool link",
    typename: "URL",
    description:
      "The address of the smart contract that implements the exchange pool",
    value: "https://github.com/",
  },
  {
    id: "pool-image",
    key: "Pool image",
    typename: "image",
    description: "balancer logo",
    value: "https://s2.coinmarketcap.com/static/img/coins/200x200/5728.png",
  },
];

export interface PoolMetadataAttribute {
  id: string;
  key: string;
  typename: string;
  description: string;
  value: unknown;
}

interface PoolMetadataContextType {
  metadata: PoolMetadataAttribute[];
  handleAddMetadata: (data: PoolMetadataAttribute) => void;
  handleUpdateMetadata: (data: PoolMetadataAttribute) => void;
  selectedPool: string | null;
  handleSetPool: (poolId: string) => void;
  isKeyUnique: (key: string) => boolean;
}

export const PoolMetadataContext = createContext({} as PoolMetadataContextType);

export function PoolMetadataProvider({ children }: { children: ReactNode }) {
  const [selectedPool, setSelectedPool] = useState<string>("");
  // const { data: poolMetadata } = metadataGql.useMetadataPool({
  //   poolId: selectedPool,
  // });
  // cellData = getDataFromIpfs(poolMetadata.CID)
  const [metadata, setMetadata] = useState<PoolMetadataAttribute[]>(cellData);

  function handleAddMetadata(data: PoolMetadataAttribute) {
    setMetadata((state) => [data, ...state]);
  }

  function handleUpdateMetadata(data: PoolMetadataAttribute) {
    setMetadata((state) =>
      state.map((item) => {
        return item.id === data.id ? data : item;
      })
    );
  }

  function handleSetPool(poolId: string) {
    setSelectedPool(poolId);
  }

  function isKeyUnique(key: string) {
    return metadata.every((item) => toSlug(item.key) !== toSlug(key));
  }

  return (
    <PoolMetadataContext.Provider
      value={{
        metadata,
        handleAddMetadata,
        handleUpdateMetadata,
        selectedPool,
        handleSetPool,
        isKeyUnique,
      }}
    >
      {children}
    </PoolMetadataContext.Provider>
  );
}
