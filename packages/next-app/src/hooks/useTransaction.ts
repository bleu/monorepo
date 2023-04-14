import { Dispatch, useEffect, useState } from "react";

import { PoolMetadataAttribute } from "#/contexts/PoolMetadataContext";
import { pinJSON } from "#/lib/ipfs";
import { useNetwork } from "#/wagmi";
import {
  usePoolMetadataRegistrySetPoolMetadata,
  usePreparePoolMetadataRegistrySetPoolMetadata,
} from "#/wagmi/generated";

export enum TransactionStatus {
  AUTHORIZING = "Approve this transaction",
  PINNING = "Pinning metadata...",
  CONFIRMING = "Set metadata on-chain",
  WAITING_APPROVAL = "Waiting for your wallet approvement...",
  SUBMITTING = "Writing on-chain",
  CONFIRMED = "Transaction was a success",
  PINNING_ERROR = "The transaction has failed",
  WRITE_ERROR = "The transaction has failed",
}

enum NotificationVariant {
  NOTIFICATION = "notification",
  PENDING = "pending",
  ALERT = "alert",
  SUCCESS = "success",
}

type Notification = {
  title: string;
  description: string;
  variant: NotificationVariant;
};

type TransactionHookResult = {
  handleTransaction: () => void;
  isTransactionDisabled: boolean;
  notification: Notification | null;
  transactionStatus: TransactionStatus;
  isNotifierOpen: boolean;
  setIsNotifierOpen: Dispatch<boolean>;
  transactionUrl: string | undefined;
};

const NOTIFICATION_MAP = {
  [TransactionStatus.PINNING]: {
    title: "Approve confirmed! ",
    description: "Pinning file to IPFS",
    variant: NotificationVariant.NOTIFICATION,
  },
  [TransactionStatus.CONFIRMING]: {
    title: "Confirme pending... ",
    description: "Set metadata on-chain",
    variant: NotificationVariant.PENDING,
  },
  [TransactionStatus.SUBMITTING]: {
    title: "Update confirmed! ",
    description: "Metadata is being updated!",
    variant: NotificationVariant.NOTIFICATION,
  },
  [TransactionStatus.CONFIRMED]: {
    title: "Great!",
    description: "The update was a success!",
    variant: NotificationVariant.SUCCESS,
  },
  [TransactionStatus.PINNING_ERROR]: {
    title: "Error!",
    description: "the metadata update has failed",
    variant: NotificationVariant.ALERT,
  },
  [TransactionStatus.WRITE_ERROR]: {
    title: "Error!",
    description: "the metadata update has failed",
    variant: NotificationVariant.ALERT,
  },
};

const networkUrls = {
  1: "https://etherscan.io/tx/",
  5: "https://goerli.etherscan.io/tx/",
  137: "https://polygonscan.com/tx/",
  42161: "https://arbiscan.io/tx/",
};

export function useMetadataTransaction({
  poolId,
  metadata,
}: {
  poolId: `0x${string}`;
  metadata: PoolMetadataAttribute[];
}): TransactionHookResult {
  const [ipfsCID, setIpfsCID] = useState("");
  const [isNotifierOpen, setIsNotifierOpen] = useState(false);
  const [isTransactionDisabled, setIsTransactionDisabled] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>(
    TransactionStatus.AUTHORIZING
  );
  const [transactionUrl, setTransactionUrl] = useState<string | undefined>();

  const { config } = usePreparePoolMetadataRegistrySetPoolMetadata({
    args: [poolId, ipfsCID],
  });
  const { write, data } = usePoolMetadataRegistrySetPoolMetadata(config);
  const { chain } = useNetwork();

  const handleSetTransactionLink = (hash: `0x${string}`) => {
    const baseTxUrl = networkUrls[chain!.id as keyof typeof networkUrls];
    setTransactionUrl(`${baseTxUrl}${hash}`);
  };

  useEffect(() => {
    if (!data) return;
    const { wait, hash } = data;
    async function waitTransaction() {
      handleSetTransactionLink(hash);
      // Once the metadata is set on-chain, update the transaction status to SUBMITTING
      setTransactionStatus(TransactionStatus.SUBMITTING);
      setNotification(NOTIFICATION_MAP[TransactionStatus.SUBMITTING]);
      const receipt = await wait();

      if (receipt.status) {
        setTransactionStatus(TransactionStatus.CONFIRMED);
        setNotification(NOTIFICATION_MAP[TransactionStatus.CONFIRMED]);
      }
    }
    waitTransaction();
  }, [data]);

  const handleTransaction = async () => {
    if (isTransactionDisabled) {
      return;
    }

    setIsTransactionDisabled(true);

    if (transactionStatus === TransactionStatus.AUTHORIZING) {
      setTransactionStatus(TransactionStatus.PINNING);
      setNotification(NOTIFICATION_MAP[TransactionStatus.PINNING]);

      // Call function to approve transaction and pin metadata to IPFS here
      // Once the transaction is approved and the metadata is pinned, update the transaction status to CONFIRMING
      try {
        const value = await pinJSON(poolId, metadata);
        setIpfsCID(value);
        setTransactionStatus(TransactionStatus.CONFIRMING);
        setNotification(NOTIFICATION_MAP[TransactionStatus.CONFIRMING]);
        setIsTransactionDisabled(false);
      } catch (error) {
        setTransactionStatus(TransactionStatus.PINNING_ERROR);
        setNotification(NOTIFICATION_MAP[TransactionStatus.PINNING_ERROR]);
        setIsTransactionDisabled(false);
      }
    } else if (transactionStatus === TransactionStatus.CONFIRMING) {
      // Call function to set metadata on-chain here
      try {
        setTransactionStatus(TransactionStatus.WAITING_APPROVAL);
        write?.();
      } catch (error) {
        setTransactionStatus(TransactionStatus.WRITE_ERROR);
        setNotification(NOTIFICATION_MAP[TransactionStatus.WRITE_ERROR]);
        setIsTransactionDisabled(false);
      }
    }
  };

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
    isTransactionDisabled,
    notification,
    transactionStatus,
    isNotifierOpen,
    setIsNotifierOpen,
    transactionUrl,
  };
}
