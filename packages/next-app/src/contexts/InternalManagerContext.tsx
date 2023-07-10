"use client";

import { InternalBalanceQuery } from "@bleu-balancer-tools/gql/src/balancer-internal-manager/__generated__/Ethereum";
import { Address } from "@bleu-balancer-tools/shared";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

import { getTokensData } from "#/app/_serverActions";
import { Notification, TransactionStatus } from "#/hooks/useTransaction";
import { ArrElement, GetDeepProp } from "#/utils/getTypes";

import { useNetworks } from "./networks";

export interface SelectedToken {
  address: string;
  symbol: string;
  logoUrl?: string;
}

interface tokenListItem {
  address: string;
  chainId: number;
  decimals: number;
  name: string;
  symbol: string;
}

type tokenProps = ArrElement<
  GetDeepProp<InternalBalanceQuery, "userInternalBalances">
>;

export type useInternalBalancesTransactionProps = {
  token: tokenProps;
  userAddress: Address;
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
  tokenList: tokenListItem[];
  hasAllowance: boolean | undefined;
  setHasAllowance: (hasAllowance: boolean | undefined) => void;
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
  const [tokenList, setTokenList] = useState<tokenListItem[]>([]);
  const [hasAllowance, setHasAllowance] = useState<boolean | undefined>(
    undefined
  );

  const { networkConnectedToWallet } = useNetworks();

  function clearNotification() {
    setNotification(null);
    setIsNotifierOpen(false);
    setTransactionStatus(TransactionStatus.AUTHORIZING);
    setTransactionUrl(undefined);
  }

  useEffect(() => {
    if (!networkConnectedToWallet) return;
    getTokensData({ networkConnectedToWallet }).then((tokens) => {
      setTokenList(tokens);
    });
  }, [networkConnectedToWallet]);

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
        tokenList,
        hasAllowance,
        setHasAllowance,
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
