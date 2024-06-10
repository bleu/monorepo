import { useTransactionConfirmations, useWriteContract } from "wagmi";
import { useWaitForTransactionReceiptWrapped } from "./useWaitForTransactionReceiptWrapped";
import { useEffect, useMemo } from "react";
import { useSendCalls } from "wagmi/experimental";

const CONFIRMATIONS_THRESHOLD_FOR_FINAL_TX = 15;

export function useManagedTransaction() {
  const {
    data,
    error,
    status: writeStatus,
    writeContract,
  } = useWriteContract();

  const {
    hash,
    status: txReceiptStatus,
    safeHash,
    safeStatus,
  } = useWaitForTransactionReceiptWrapped({
    hash: data,
  });

  const {
    data: blockConfirmations,
    status: blockConfirmationsStatus,
    fetchStatus: blockConfirmationsFetchStatus,
    refetch,
  } = useTransactionConfirmations({ hash });

  useEffect(() => {
    if (
      txReceiptStatus === "success" &&
      blockConfirmationsStatus === "success" &&
      Number(blockConfirmations) <= CONFIRMATIONS_THRESHOLD_FOR_FINAL_TX
    ) {
      const interval = setInterval(() => {
        console.log("refetching");
        refetch();
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [blockConfirmationsStatus, txReceiptStatus]);

  const STATE = useMemo(
    () => ({
      idle:
        writeStatus === "idle" &&
        (safeStatus ? safeStatus === "safe_idle" : true),
      confirming: writeStatus === "success" && txReceiptStatus === "pending",
      confirmed: txReceiptStatus === "success" || safeStatus === "safe_success",
      pending: writeStatus === "pending",
      safeAwaitingConfirmations: safeStatus === "safe_awaiting_confirmations",
      safeAwaitingExecution: safeStatus === "safe_awaiting_execution",
      safeCancelled: safeStatus === "safe_cancelled",
      final:
        blockConfirmationsStatus === "success" &&
        Number(blockConfirmations) >= 1,
      error: writeStatus === "error" || safeStatus === "safe_failed",
    }),
    [
      hash,
      writeStatus,
      safeStatus,
      txReceiptStatus,
      blockConfirmationsStatus,
      blockConfirmations,
    ]
  );

  const status = Object.entries(STATE).findLast(
    ([, value]) => value === true
  )?.[0];

  console.log({ status, blockConfirmations, blockConfirmationsStatus });
  return {
    status,
    safeHash,
    writeContract,
    hash,
    error,
    blockConfirmations,
  };
}
