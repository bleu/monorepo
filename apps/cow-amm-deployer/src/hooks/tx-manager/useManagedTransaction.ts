import { useEffect, useMemo } from "react";
import {
  useAccount,
  useTransactionConfirmations,
  useWriteContract,
} from "wagmi";

import { useContractWriteWithSafe } from "./useContractWriteWithSafe";
import { useIsWalletContract } from "./useIsWalletContract";
import { useWaitForTransactionReceiptWrapped } from "./useWaitForTransactionReceiptWrapped";

const CONFIRMATIONS_THRESHOLD_FOR_FINAL_TX = 15;

export function useManagedTransaction() {
  const { address } = useAccount();
  const { data: isWalletContract } = useIsWalletContract(address);

  const {
    data: safeData,
    error: safeError,
    status: safeWriteStatus,
    writeContractWithSafe,
    writeContractWithSafeAsync,
  } = useContractWriteWithSafe();

  const {
    data: eoaData,
    error: eoaError,
    status: eoaWriteStatus,
    writeContract,
    writeContractAsync,
  } = useWriteContract();

  const data = safeData || eoaData;
  const error = safeError || eoaError;
  const writeStatus = safeWriteStatus || eoaWriteStatus;

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
    refetch,
  } = useTransactionConfirmations({ hash });

  useEffect(() => {
    if (
      txReceiptStatus === "success" &&
      blockConfirmationsStatus === "success" &&
      Number(blockConfirmations) <= CONFIRMATIONS_THRESHOLD_FOR_FINAL_TX
    ) {
      const interval = setInterval(() => {
        refetch();
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [blockConfirmationsStatus, txReceiptStatus]);

  const STATE = useMemo(() => {
    const stateMap = new Map([
      [
        "idle",
        writeStatus === "idle" &&
          (safeStatus ? safeStatus === "safe_idle" : true),
      ],
      [
        "confirming",
        writeStatus === "success" && txReceiptStatus === "pending",
      ],
      [
        "confirmed",
        txReceiptStatus === "success" || safeStatus === "safe_success",
      ],
      ["pending", writeStatus === "pending"],
      [
        "safeAwaitingConfirmations",
        safeStatus === "safe_awaiting_confirmations",
      ],
      ["safeAwaitingExecution", safeStatus === "safe_awaiting_execution"],
      ["safeCancelled", safeStatus === "safe_cancelled"],
      ["final", blockConfirmations && Number(blockConfirmations) >= 1],
      ["error", writeStatus === "error" || safeStatus === "safe_failed"],
    ]);
    return stateMap;
  }, [
    hash,
    writeStatus,
    safeStatus,
    txReceiptStatus,
    blockConfirmationsStatus,
    blockConfirmations,
  ]);

  const status = Array.from(STATE.entries())
    .reverse()
    .find(([, value]) => value === true)?.[0];

  if (isWalletContract) {
    return {
      isWalletContract,
      status,
      safeHash,
      writeContract,
      writeContractWithSafe,
      hash,
      error,
      blockConfirmations,
    };
  }

  return {
    isWalletContract,
    status,
    safeHash,
    writeContract,
    writeContractWithSafe,
    writeContractWithSafeAsync,
    writeContractAsync,
    hash,
    error,
    blockConfirmations,
  };
}
