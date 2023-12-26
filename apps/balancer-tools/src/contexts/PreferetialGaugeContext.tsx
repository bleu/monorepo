"use client";

import { PreferentialGaugeQuery } from "@bleu-fi/gql/src/balancer-gauges/__generated__/Ethereum";
import { createContext, ReactNode, useContext, useState } from "react";

import { Notification } from "#/hooks/useTransaction";
import { ArrElement, GetDeepProp } from "#/utils/getTypes";

export type PreferentialGaugeGql = ArrElement<
  GetDeepProp<PreferentialGaugeQuery, "pools">
>;

interface PreferentialGaugeContextType {
  isNotifierOpen: boolean;
  setIsNotifierOpen: (isNotifierOpen: boolean) => void;
  notification: Notification | null;
  setNotification: (notification: Notification | null) => void;
  transactionUrl: string | undefined;
  setTransactionUrl: (transactionUrl: string | undefined) => void;
  clearNotification: () => void;
}

export const PreferentialGaugeContext = createContext(
  {} as PreferentialGaugeContextType,
);

export function PreferentialGaugeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isNotifierOpen, setIsNotifierOpen] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [transactionUrl, setTransactionUrl] = useState<string>();

  function clearNotification() {
    setNotification(null);
    setIsNotifierOpen(false);
    setTransactionUrl(undefined);
  }
  return (
    <PreferentialGaugeContext.Provider
      value={{
        isNotifierOpen,
        setIsNotifierOpen,
        notification,
        setNotification,
        transactionUrl,
        setTransactionUrl,
        clearNotification,
      }}
    >
      <div className="grow">{children}</div>
    </PreferentialGaugeContext.Provider>
  );
}

export function usePreferentialGauge() {
  const context = useContext(PreferentialGaugeContext);

  return context;
}
