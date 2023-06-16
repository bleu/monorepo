"use client";

import { TypenameEnum } from "@bleu-balancer-tools/schema";
import isEqual from "lodash/isEqual";
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

import { toSlug } from "#/utils/formatStringCase";

// TODO: generate TS types from zod: https://github.com/sachinraja/zod-to-ts
export interface PoolMetadataAttribute {
  typename: (typeof TypenameEnum.enum)[keyof typeof TypenameEnum.enum];
  key: string;
  description: string | null;
  value: string | null;
}

interface PoolMetadataContextType {
  metadata: PoolMetadataAttribute[];
  handleAddMetadata: (data: PoolMetadataAttribute) => void;
  handleUpdateMetadata: (data: PoolMetadataAttribute) => void;
  isKeyUnique: (key: string) => boolean;
  handleSetMetadata: (data: PoolMetadataAttribute[]) => void;
  handleSetOriginalMetadata: (data: PoolMetadataAttribute[]) => void;
  updateStatus: UpdateStatus;
  setStatus: Dispatch<SetStateAction<UpdateStatus>>;
  metadataUpdated: boolean;
  handleRemoveMetadataAttr: (key: string) => void;
  isMetadataValid: boolean;
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

function hasNull(element: PoolMetadataAttribute) {
  return Object.values(element).includes(null);
}

export const PoolMetadataContext = createContext({} as PoolMetadataContextType);

export function PoolMetadataProvider({ children }: PropsWithChildren) {
  const [metadata, setMetadata] = useState<PoolMetadataAttribute[]>([]);
  const [updateStatus, setStatus] = useState<UpdateStatus>(
    UpdateStatus.PINNING
  );
  const [originalMetadata, setOriginalMetadata] = useState<
    PoolMetadataAttribute[]
  >([]);
  const [isMetadataValid, setIsMetadataValid] = useState(false);

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

  function isKeyUnique(key: string) {
    return metadata.every((item) => toSlug(item.key) !== toSlug(key));
  }

  const metadataUpdated = !isEqual(metadata, originalMetadata);

  useEffect(() => {
    setIsMetadataValid(!metadata.some(hasNull));
  }, [metadata]);

  return (
    <PoolMetadataContext.Provider
      value={{
        metadata,
        handleAddMetadata,
        handleUpdateMetadata,
        isKeyUnique,
        handleSetMetadata: setMetadata,
        updateStatus,
        setStatus,
        metadataUpdated,
        handleSetOriginalMetadata: setOriginalMetadata,
        handleRemoveMetadataAttr,
        isMetadataValid,
      }}
    >
      {children}
    </PoolMetadataContext.Provider>
  );
}

export function usePoolMetadata() {
  const context = useContext(PoolMetadataContext);

  return context;
}
