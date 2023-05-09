"use client";

import { InternalBalanceQuery } from "@balancer-pool-metadata/gql/src/balancer-internal-manager/__generated__/Mainnet";
import { createContext, PropsWithChildren, useContext, useState } from "react";

import { Notification, TransactionStatus } from "#/hooks/useTransaction";
import { ArrElement, GetDeepProp } from "#/utils/getTypes";

export interface SelectedToken {
  address: string;
  symbol: string;
  logoUrl?: string;
}

type tokenProps = ArrElement<
  GetDeepProp<InternalBalanceQuery, "userInternalBalances">
>;

export type useInternalBalancesTransactionProps = {
  token: tokenProps;
  userAddress: `0x${string}`;
};

type InternalManagerContextType = {
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

export const InternalManagerContext = createContext(
  {} as InternalManagerContextType
);

export function InternalManagerProvider({ children }: PropsWithChildren) {
  const [isNotifierOpen, setIsNotifierOpen] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [transactionUrl, setTransactionUrl] = useState<string>();
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>(
    TransactionStatus.AUTHORIZING
  );

  function clearNotification() {
    setNotification(null);
    setIsNotifierOpen(false);
  }

  return (
    <InternalManagerContext.Provider
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
    </InternalManagerContext.Provider>
  );
}

export function useInternalBalance() {
  const context = useContext(InternalManagerContext);

  return context;
}
