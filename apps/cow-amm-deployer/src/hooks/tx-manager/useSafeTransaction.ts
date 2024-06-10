import SafeAppsSDK from "@gnosis.pm/safe-apps-sdk";
import { useEffect, useState } from "react";
import { parseAbi } from "viem";
import { useAccount, useWatchContractEvent } from "wagmi";

import { useIsWalletContract } from "./useIsWalletContract";

export type SafeStatus =
  | "safe_idle"
  | "safe_loading"
  | "safe_awaiting_confirmations"
  | "safe_awaiting_execution"
  | "safe_failed"
  | "safe_success"
  | "safe_cancelled";

export const sdk = new SafeAppsSDK({
  allowedDomains: [/app.safe.global$/],
  debug: true,
});

export const gnosisAbi = parseAbi([
  "event ExecutionSuccess(bytes32 txHash, uint256 payment)",
]);

export const SAFE_STATUS_MAP = {
  IDLE: "safe_idle",
  AWAITING_CONFIRMATIONS: "safe_awaiting_confirmations",
  AWAITING_EXECUTION: "safe_awaiting_execution",
  CANCELLED: "safe_cancelled",
  FAILED: "safe_failed",
  SUCCESS: "safe_success",
} as const;

export const useSafeTransaction = ({
  safeHash,
}: {
  safeHash: `0x${string}` | undefined;
}): {
  data: `0x${string}` | undefined;
  error: unknown;
  status: SafeStatus;
} => {
  const [gnosisStatus, setGnosisStatus] = useState<SafeStatus>("safe_idle");
  const [txHash, setTxHash] = useState<string | undefined>();
  const { address } = useAccount();
  const { data: isWalletContract } = useIsWalletContract(address);

  async function loadGnosisQueuedTransactions(hash?: string) {
    if (!hash) return setGnosisStatus("safe_idle");

    const queued = await sdk.txs.getBySafeTxHash(hash);

    if (!queued) {
      setGnosisStatus("safe_idle");
      return undefined;
    }

    setGnosisStatus(SAFE_STATUS_MAP[queued.txStatus]);
    setTxHash(queued.txHash);
  }

  useEffect(() => {
    if (!safeHash) {
      return;
    }

    loadGnosisQueuedTransactions(safeHash);
    const interval = setInterval(() => {
      loadGnosisQueuedTransactions(safeHash);
    }, 1000);

    return () => clearInterval(interval);
  }, [safeHash]);

  useWatchContractEvent({
    abi: gnosisAbi,
    address,
    eventName: "ExecutionSuccess",
    onLogs: (logs) => {
      logs.forEach((log) => {
        if (log.args.txHash === safeHash) {
          loadGnosisQueuedTransactions(safeHash);
        }
      });
    },
  });

  if (!address || !isWalletContract || !safeHash)
    return {
      data: undefined,
      error: undefined,
      status: "safe_idle",
    };

  return {
    data: txHash as `0x${string}`,
    error: undefined,
    status: gnosisStatus,
  };
};
