"use client";

import { TypenameEnum } from "@balancer-pool-metadata/schema";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

export function toSlug(string?: string) {
  return (
    string
      ?.toLowerCase()
      ?.replace(/ /g, "-")
      ?.replace(/[^\w-]+/g, "") || ""
  );
}

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
  handleSetMetadata: (data: PoolMetadataAttribute[]) => void;
  updateStatus: UpdateStatus;
  setStatus: Dispatch<SetStateAction<UpdateStatus>>;
  submit: boolean;
  handleSubmit: Dispatch<SetStateAction<boolean>>;
  metadataUpdated: boolean;
}

export enum UpdateStatus {
  PINNING,
  AUTHORIZING,
  SUBMITTING,
  CONFIRMING,
  CONFIRMED,
}

export enum StatusLabels {
  "Waiting...",
  "Confirm transaction on your wallet",
  "Submitting...",
  "Submitted",
  "Close",
}

export const PoolMetadataContext = createContext({} as PoolMetadataContextType);

export function PoolMetadataProvider({ children }: { children: ReactNode }) {
  const [selectedPool, setSelectedPool] = useState<string>("");
  const [metadata, setMetadata] = useState<PoolMetadataAttribute[]>([]);
  const [updateStatus, setStatus] = useState<UpdateStatus>(
    UpdateStatus.PINNING
  );
  const [submit, handleSubmit] = useState<boolean>(false);
  const [metadataUpdated, setMetadataUpdated] = useState<boolean>(false);

  function handleSetMetadata(data: PoolMetadataAttribute[]) {
    setMetadataUpdated(false);
    setMetadata(data);
  }

  function handleAddMetadata(data: PoolMetadataAttribute) {
    setMetadataUpdated(true);
    setMetadata((state) => [data, ...state]);
  }

  function handleUpdateMetadata(data: PoolMetadataAttribute) {
    setMetadataUpdated(true);
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
        handleSetMetadata,
        updateStatus,
        setStatus,
        submit,
        handleSubmit,
        metadataUpdated,
      }}
    >
      {children}
    </PoolMetadataContext.Provider>
  );
}
