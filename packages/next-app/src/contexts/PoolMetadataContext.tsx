"use client";
import { TypenameEnum } from "@balancer-pool-metadata/schema";
import isEqual from "lodash/isEqual";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";

import { toSlug } from "#/utils/formatStringCase";

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
  handleSetOriginalMetadata: (data: PoolMetadataAttribute[]) => void;
  updateStatus: UpdateStatus;
  setStatus: Dispatch<SetStateAction<UpdateStatus>>;
  metadataUpdated: boolean;
  handleRemoveMetadataAttr: (key: string) => void;
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
  const [metadataUpdated, setMetadataUpdated] = useState<boolean>(false);
  const [originalMetadata, setOriginalMetadata] = useState<
    PoolMetadataAttribute[]
  >([]);

  function handleSetMetadata(data: PoolMetadataAttribute[]) {
    setMetadata(data);
  }

  function handleSetOriginalMetadata(data: PoolMetadataAttribute[]) {
    setOriginalMetadata(data);
  }

  function handleAddMetadata(data: PoolMetadataAttribute) {
    setMetadata((state) => [data, ...state]);
  }

  const handleRemoveMetadataAttr = (key: string) => {
    setMetadata((state) => state.filter((item) => item.key !== key));
  };

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

  useEffect(() => {
    setMetadataUpdated(!isEqual(metadata, originalMetadata));
  }, [metadata, originalMetadata]);

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
        metadataUpdated,
        handleSetOriginalMetadata,
        handleRemoveMetadataAttr,
      }}
    >
      {children}
    </PoolMetadataContext.Provider>
  );
}
