"use client";

import { TypenameEnum } from "@balancer-pool-metadata/schema";
import { createContext, ReactNode, useState } from "react";

export function toSlug(string?: string) {
  return (
    string
      ?.toLowerCase()
      ?.replace(/ /g, "-")
      ?.replace(/[^\w-]+/g, "") || ""
  );
}

const cellData: PoolMetadataAttribute[] = [
  {
    key: "Pool Address",
    typename: TypenameEnum.enum.text,
    description:
      "The address of the smart contract that implements the exchange pool",
    value: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
  },
  {
    key: "Pool link",
    typename: TypenameEnum.enum.url,
    description:
      "The address of the smart contract that implements the exchange pool",
    value: "https://github.com/",
  },
  {
    key: "Pool image",
    typename: TypenameEnum.enum.url,
    description: "balancer logo",
    value: "https://s2.coinmarketcap.com/static/img/coins/200x200/5728.png",
  },
];

// TODO: generate TS types from zod: https://github.com/sachinraja/zod-to-ts
export interface PoolMetadataAttribute {
  typename: (typeof TypenameEnum.enum)[keyof typeof TypenameEnum.enum];
  key: string;
  description: string;
  value: string;
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
        return toSlug(item.key) === toSlug(data.key) ? data : item;
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
