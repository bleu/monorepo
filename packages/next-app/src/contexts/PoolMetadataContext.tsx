"use client";

import cuid from "cuid";
import { createContext, ReactNode, useState } from "react";

// import metadataGql from "../lib/poolMetadataGql";

const cellData: {
  id: string;
  name: string;
  type: string;
  desc: string;
  value: React.ReactNode;
}[] = [
  {
    id: cuid(),
    name: "Pool Address",
    type: "address",
    desc: "The address of the smart contract that implements the exchange pool",
    value: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
  },
  {
    id: cuid(),
    name: "Pool link",
    type: "URL",
    desc: "The address of the smart contract that implements the exchange pool",
    value: "https://github.com/",
  },
  {
    id: cuid(),
    name: "Pool image",
    type: "image",
    desc: "balancer logo",
    value: "https://s2.coinmarketcap.com/static/img/coins/200x200/5728.png",
  },
];

export interface PoolMetadataAttribute {
  id: string;
  name: string;
  type: string;
  desc: string;
  value: unknown;
}

interface PoolMetadataContextType {
  metadata: PoolMetadataAttribute[];
  handleAddMetadata: (data: PoolMetadataAttribute) => void;
  handleUpdateMetadata: (data: PoolMetadataAttribute) => void;
  selectedPool: string | null;
  handleSetPool: (poolId: string) => void;
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

  return (
    <PoolMetadataContext.Provider
      value={{
        metadata,
        handleAddMetadata,
        handleUpdateMetadata,
        selectedPool,
        handleSetPool,
      }}
    >
      {children}
    </PoolMetadataContext.Provider>
  );
}
