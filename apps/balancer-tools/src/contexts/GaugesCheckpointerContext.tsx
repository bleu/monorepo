"use client";

// import { InternalBalanceQuery } from "@bleu-fi/gql/src/balancer/__generated__/Ethereum";
import { Address } from "@bleu-fi/utils";
import { createContext, PropsWithChildren, useContext, useState } from "react";

import { Notification, TransactionStatus } from "#/hooks/useTransaction";

export interface gaugeItem {
  address: Address;
  chain: string;
  poolAddress: Address;
  poolSymbol: string;
  poolName: string;
  balToMint?: number;
  lastCheckpoint?: number;
}

type GaugesCheckpointerContextType = {
  isNotifierOpen: boolean;
  setIsNotifierOpen: (isNotifierOpen: boolean) => void;
  notification: Notification | null;
  setNotification: (notification: Notification | null) => void;
  transactionUrl: string | undefined;
  setTransactionUrl: (transactionUrl: string | undefined) => void;
  clearNotification: () => void;
  transactionStatus: TransactionStatus;
  setTransactionStatus: (status: TransactionStatus) => void;
};

export const GaugesCheckpointerContext = createContext(
  {} as GaugesCheckpointerContextType,
);

export function GaugesCheckpointerProvider({ children }: PropsWithChildren) {
  const [isNotifierOpen, setIsNotifierOpen] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [transactionUrl, setTransactionUrl] = useState<string>();
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>(
    TransactionStatus.AUTHORIZING,
  );

  function clearNotification() {
    setNotification(null);
    setIsNotifierOpen(false);
    setTransactionStatus(TransactionStatus.AUTHORIZING);
    setTransactionUrl(undefined);
  }

  return (
    <GaugesCheckpointerContext.Provider
      value={{
        isNotifierOpen,
        setIsNotifierOpen,
        notification,
        setNotification,
        transactionUrl,
        setTransactionUrl,
        clearNotification,
        transactionStatus,
        setTransactionStatus,
      }}
    >
      {children}
    </GaugesCheckpointerContext.Provider>
  );
}

export function useGaugesCheckpointer() {
  const context = useContext(GaugesCheckpointerContext);

  return context;
}
