import { Address, networkFor } from "@bleu/utils";
import { waitForTransaction } from "@wagmi/core";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useNetwork } from "wagmi";

import { useInternalBalance } from "#/contexts/InternalManagerContext";
import { UserBalanceOpKind } from "#/lib/internal-balance-helper";
import { writeManageUserBalance } from "#/wagmi/writeManageUserBalance";

import {
  NotificationVariant,
  SubmitData,
  TransactionStatus,
} from "../useTransaction";
import { useTokenApproval } from "./useTokenApproval";
import { useTransactionStatus } from "./useTransactionStatus";

export function useManageUserBalance() {
  const {
    setNotification,
    setTransactionUrl,
    transactionStatus,
    setTransactionStatus,
    isNotifierOpen,
    setIsNotifierOpen,
    notification,
  } = useInternalBalance();

  const { push } = useRouter();
  const { chain } = useNetwork();
  const network = networkFor(chain?.id);
  const { approveToken } = useTokenApproval();
  const { handleTransactionStatus } = useTransactionStatus();

  async function handleTransaction({
    data,
    operationKind,
    userAddress,
  }: {
    data: SubmitData[];
    operationKind: UserBalanceOpKind | null;
    userAddress: Address;
  }) {
    setTransactionUrl(undefined);
    const isDepositWithNoAllowance =
      operationKind === UserBalanceOpKind.DEPOSIT_INTERNAL &&
      transactionStatus === TransactionStatus.AUTHORIZING;

    const isDepositWithAllowance =
      operationKind === UserBalanceOpKind.DEPOSIT_INTERNAL &&
      transactionStatus === TransactionStatus.SUBMITTING;

    if (isDepositWithNoAllowance) {
      setNotification(
        NOTIFICATION_MAP_INTERNAL_BALANCES[TransactionStatus.AUTHORIZING]
      );
      approveToken({ data, chain });
    } else {
      setNotification(
        NOTIFICATION_MAP_INTERNAL_BALANCES[TransactionStatus.CONFIRMING]
      );
      try {
        setTransactionStatus(TransactionStatus.SUBMITTING);
        const transactionData = await writeManageUserBalance({
          data,
          operationKind,
          userAddress,
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
          push(`/internalmanager/${network}`);
          setTransactionStatus(TransactionStatus.CONFIRMED);
          setNotification(
            NOTIFICATION_MAP_INTERNAL_BALANCES[TransactionStatus.CONFIRMED]
          );
        }
        if (waitForTransactionData.status === "reverted") {
          push(`/internalmanager/${network}`);
          setNotification(
            NOTIFICATION_MAP_INTERNAL_BALANCES[TransactionStatus.PINNING_ERROR]
          );
        }
      } catch (error) {
        if (isDepositWithAllowance) {
          setNotification(
            NOTIFICATION_MAP_INTERNAL_BALANCES[TransactionStatus.WRITE_ERROR]
          );
          setTransactionStatus(TransactionStatus.APPROVED);
        } else {
          setNotification(
            NOTIFICATION_MAP_INTERNAL_BALANCES[TransactionStatus.WRITE_ERROR]
          );
          setTransactionStatus(TransactionStatus.AUTHORIZING);
        }
      }
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

export const NOTIFICATION_MAP_INTERNAL_BALANCES = {
  [TransactionStatus.AUTHORIZING]: {
    title: "Approve this transaction",
    description: "Waiting for your approval",
    variant: NotificationVariant.PENDING,
  },
  [TransactionStatus.WAITING_APPROVAL]: {
    title: "Confirm pending... ",
    description: "Waiting for your approval",
    variant: NotificationVariant.PENDING,
  },
  [TransactionStatus.APPROVED]: {
    title: "Great!",
    description: "The approval was successful!",
    variant: NotificationVariant.SUCCESS,
  },
  [TransactionStatus.SUBMITTING]: {
    title: "Wait just a little longer",
    description: "Your transaction is being made",
    variant: NotificationVariant.NOTIFICATION,
  },
  [TransactionStatus.CONFIRMING]: {
    title: "Confirm your transaction",
    description: "Confirm the wallet transaction",
    variant: NotificationVariant.PENDING,
  },
  [TransactionStatus.CONFIRMED]: {
    title: "Great!",
    description: "The transaction was a success!",
    variant: NotificationVariant.SUCCESS,
  },
  [TransactionStatus.PINNING_ERROR]: {
    title: "Error!",
    description: "the transaction has failed",
    variant: NotificationVariant.ALERT,
  },
  [TransactionStatus.WRITE_ERROR]: {
    title: "Cancelled!",
    description: "The transaction was cancelled",
    variant: NotificationVariant.ALERT,
  },
} as const;
