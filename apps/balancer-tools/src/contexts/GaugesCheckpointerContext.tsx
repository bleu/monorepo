"use client";

import { VeBalGetVotingListQuery } from "@bleu/gql/src/balancer-api-v3/__generated__/Ethereum";
import { createContext, PropsWithChildren, useContext, useState } from "react";

import { Notification } from "#/hooks/useTransaction";
import { ArrElement, GetDeepProp } from "#/utils/getTypes";

export interface gaugeItem {
  votingOption: ArrElement<
    GetDeepProp<VeBalGetVotingListQuery, "veBalGetVotingList">
  >;
  balToMint: number | null;
}

type GaugesCheckpointerContextType = {
  isNotifierOpen: boolean;
  setIsNotifierOpen: (isNotifierOpen: boolean) => void;
  notification: Notification | null;
  setNotification: (notification: Notification | null) => void;
  transactionUrl: string | undefined;
  setTransactionUrl: (transactionUrl: string | undefined) => void;
  clearNotification: () => void;
  selectedGauges: gaugeItem[];
  addSelectedGauge: (selectedGauge: gaugeItem) => void;
  removeSelectedGauge: (selectedGauge: gaugeItem) => void;
  setSelectedGauges: (selectedGauges: gaugeItem[]) => void;
};

export const GaugesCheckpointerContext = createContext(
  {} as GaugesCheckpointerContextType
);

export function GaugesCheckpointerProvider({ children }: PropsWithChildren) {
  const [isNotifierOpen, setIsNotifierOpen] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [transactionUrl, setTransactionUrl] = useState<string>();
  const [selectedGauges, setSelectedGauges] = useState<gaugeItem[]>([]);

  function addSelectedGauge(selectedGauge: gaugeItem) {
    setSelectedGauges([...selectedGauges, selectedGauge]);
  }

  function removeSelectedGauge(selectedGauge: gaugeItem) {
    setSelectedGauges(
      selectedGauges.filter(
        (gauge) => gauge.votingOption.id !== selectedGauge.votingOption.id
      )
    );
  }

  function clearNotification() {
    setNotification(null);
    setIsNotifierOpen(false);
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
        selectedGauges,
        addSelectedGauge,
        removeSelectedGauge,
        setSelectedGauges,
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
