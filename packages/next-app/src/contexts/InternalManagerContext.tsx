"use client";

import { InternalBalanceQuery } from "@balancer-pool-metadata/gql/src/balancer-internal-manager/__generated__/Mainnet";
import { createContext, PropsWithChildren, useContext, useState } from "react";

import { Notification } from "#/hooks/useTransaction";
import { ArrElement, GetDeepProp } from "#/utils/getTypes";

type tokenProps = ArrElement<
  GetDeepProp<InternalBalanceQuery, "userInternalBalances">
>;

export type useInternalBalancesTransactionProps = {
  token: tokenProps;
  userAddress: `0x${string}`;
};

type InternalManagerContextType = {
  token: tokenProps;
  setToken: (token: tokenProps) => void;
  userAddress: `0x${string}`;
  setUserAddress: (userAddress: `0x${string}`) => void;
  isNotifierOpen: boolean;
  setIsNotifierOpen: (isNotifierOpen: boolean) => void;
  notification: Notification | null;
  setNotification: (notification: Notification | null) => void;
  transactionUrl: string | undefined;
  setTransactionUrl: (transactionUrl: string | undefined) => void;
  clearNotification: () => void;
};

export const InternalManagerContext = createContext(
  {} as InternalManagerContextType
);

export function InternalManagerProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<tokenProps>({} as tokenProps);
  const [userAddress, setUserAddress] = useState<`0x${string}`>(
    "0x" as `0x${string}`
  );
  const [isNotifierOpen, setIsNotifierOpen] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [transactionUrl, setTransactionUrl] = useState<string>();

  function clearNotification() {
    setNotification(null);
    setIsNotifierOpen(false);
  }

  return (
    <InternalManagerContext.Provider
      value={{
        token,
        setToken,
        userAddress,
        setUserAddress,
        isNotifierOpen,
        setIsNotifierOpen,
        notification,
        setNotification,
        transactionUrl,
        setTransactionUrl,
        clearNotification,
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
