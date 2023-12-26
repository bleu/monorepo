import { waitForTransaction } from "@wagmi/core";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useNetwork } from "wagmi";

import { useGaugesCheckpointer } from "#/contexts/GaugesCheckpointerContext";
import { writeCheckpointMultipleGauges } from "#/wagmi/writeCheckpointMultipleGauges";

import { NotificationVariant, TransactionStatus } from "../useTransaction";
import { useTransactionStatus } from "./useTransactionStatus";

export function useCheckpointGauges() {
  const {
    setNotification,
    setTransactionUrl,
    isNotifierOpen,
    setIsNotifierOpen,
    notification,
    selectedGauges,
  } = useGaugesCheckpointer();

  const { refresh } = useRouter();
  const { chain } = useNetwork();
  const { handleTransactionStatus } = useTransactionStatus();

  async function handleTransaction({ ethValue }: { ethValue: number }) {
    setTransactionUrl(undefined);
    setNotification(
      NOTIFICATION_MAP_GAUGES_CHECKPOINT[TransactionStatus.CONFIRMING],
    );
    try {
      const transactionData = await writeCheckpointMultipleGauges({
        votingOptions: selectedGauges.map((gauge) => gauge.votingOption),
        ethValue: ethValue,
      });

      const { hash } = transactionData;
      handleTransactionStatus({
        hash,
        chain,
      });
      const waitForTransactionData = await waitForTransaction({
        hash,
      });
      if (waitForTransactionData.status === "success") {
        refresh();
        setNotification(
          NOTIFICATION_MAP_GAUGES_CHECKPOINT[TransactionStatus.CONFIRMED],
        );
      }
      if (waitForTransactionData.status === "reverted") {
        refresh();
        setNotification(
          NOTIFICATION_MAP_GAUGES_CHECKPOINT[TransactionStatus.WRITE_ERROR],
        );
      }
    } catch (error) {
      setNotification(
        NOTIFICATION_MAP_GAUGES_CHECKPOINT[TransactionStatus.WRITE_ERROR],
      );
    }
  }
  const handleNotifier = () => {
    if (isNotifierOpen) {
      setIsNotifierOpen(false);
      setTimeout(() => {
        setIsNotifierOpen(true);
      }, 100);
    } else {
      setIsNotifierOpen(true);
    }
  };

  useEffect(() => {
    if (!notification) return;
    handleNotifier();
  }, [notification]);

  return {
    handleTransaction,
  };
}

export const NOTIFICATION_MAP_GAUGES_CHECKPOINT = {
  [TransactionStatus.CONFIRMING]: {
    title: "Confirm your transaction",
    description: "Confirm the wallet transaction",
    variant: NotificationVariant.PENDING,
  },
  [TransactionStatus.SUBMITTING]: {
    title: "Submitting...",
    description: "Your transaction is being made",
    variant: NotificationVariant.NOTIFICATION,
  },
  [TransactionStatus.CONFIRMED]: {
    title: "Great!",
    description: "The transaction was a success!",
    variant: NotificationVariant.SUCCESS,
  },
  [TransactionStatus.WRITE_ERROR]: {
    title: "Error!",
    description: "An error ocurred. Please try again.",
    variant: NotificationVariant.ALERT,
  },
} as const;
