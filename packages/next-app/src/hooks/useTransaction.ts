import { buildBlockExplorerTxURL } from "@balancer-pool-metadata/shared";
import { parseFixed } from "@ethersproject/bignumber";
import { prepareWriteContract, writeContract } from "@wagmi/core";
import { useRouter } from "next/navigation";
import { Dispatch, useEffect, useState } from "react";
import { FieldValues } from "react-hook-form";

import { useInternalBalance } from "#/contexts/InternalManagerContext";
import { PoolMetadataAttribute } from "#/contexts/PoolMetadataContext";
import { UserBalanceOpKind } from "#/lib/internal-balance-helper";
import { pinJSON } from "#/lib/ipfs";
import { erc20ABI, useNetwork, useWaitForTransaction } from "#/wagmi";
import {
  usePoolMetadataRegistrySetPoolMetadata,
  usePreparePoolMetadataRegistrySetPoolMetadata,
  usePrepareVaultManageUserBalance,
  useVaultManageUserBalance,
  vaultAddress,
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

export type Notification = {
  title: string;
  description: string;
  variant: NotificationVariant;
};

type SubmitData = {
  receiverAddress: `0x${string}`;
  tokenAddress: `0x${string}`;
  tokenAmount: string;
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
    title: "Confirm pending... ",
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
  [TransactionStatus.SUBMITTING]: {
    title: "Wait just a little longer",
    description: "Your transaction is being made",
    variant: NotificationVariant.NOTIFICATION,
  },
  [TransactionStatus.CONFIRMING]: {
    title: "Great!",
    description: "The approval was successful!",
    variant: NotificationVariant.SUCCESS,
  },
  [TransactionStatus.CONFIRMED]: {
    title: "Great!",
    description: "The transaction was a success!",
    variant: NotificationVariant.SUCCESS,
  },
  [TransactionStatus.WRITE_ERROR]: {
    title: "Error!",
    description: "the transaction has failed",
    variant: NotificationVariant.ALERT,
  },
} as const;

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
    const txUrl = buildBlockExplorerTxURL({ chainId: chain!.id, txHash: hash });
    setTransactionUrl(txUrl);
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

export function useInternalBalancesTransaction({
  userAddress,
  tokenDecimals,
  operationKind,
}: {
  userAddress: `0x${string}`;
  tokenDecimals: number;
  operationKind: UserBalanceOpKind | null;
}) {
  const {
    setNotification,
    setTransactionUrl,
    isNotifierOpen,
    setIsNotifierOpen,
    notification,
    transactionStatus,
    setTransactionStatus,
  } = useInternalBalance();
  const { push } = useRouter();
  const { chain } = useNetwork();
  const [submitData, setSubmitData] = useState<SubmitData | null>(null);

  //Prepare data for transaction
  const userBalanceOp = {
    kind: operationKind as number,
    asset: submitData?.tokenAddress as `0x${string}`,
    //TODO get this if tokenAmount is not defined a better solution than 0 to initialize the value
    amount: parseFixed(
      submitData?.tokenAmount ? submitData.tokenAmount : "0",
      tokenDecimals
    ),
    sender: userAddress as `0x${string}`,
    recipient: submitData?.receiverAddress as `0x${string}`,
  };

  const { config } = usePrepareVaultManageUserBalance({
    args: [[userBalanceOp]],
  });

  const { data, write } = useVaultManageUserBalance(config);

  //function to prepare depoist transaction
  async function approveToken() {
    if (!submitData) return;
    setTransactionStatus(TransactionStatus.AUTHORIZING);
    setNotification(
      NOTIFICATION_MAP_INTERNAL_BALANCES[TransactionStatus.AUTHORIZING]
    );
    const config = await prepareWriteContract({
      address: submitData?.tokenAddress as `0x${string}`,
      abi: erc20ABI,
      functionName: "approve",
      args: [
        vaultAddress[5],
        parseFixed(
          submitData?.tokenAmount ? submitData.tokenAmount : "0",
          tokenDecimals
        ),
      ],
    });
    const data = await writeContract(config);
    const { hash, wait } = data;
    handleTransactionStatus({ hash });
    const receipt = await wait();
    if (receipt.status) {
      setTransactionStatus(TransactionStatus.CONFIRMING);
      setNotification(
        NOTIFICATION_MAP_INTERNAL_BALANCES[TransactionStatus.CONFIRMING]
      );
    }
  }

  //trigger transaction
  function handleTransaction(data: FieldValues) {
    setSubmitData({
      tokenAddress: data.tokenAddress,
      tokenAmount: data.tokenAmount,
      receiverAddress: data.receiverAddress,
    });
  }

  // //trigger the actual transaction
  useEffect(() => {
    if (!submitData) return;
    setTransactionUrl(undefined);
    setNotification(
      NOTIFICATION_MAP_INTERNAL_BALANCES[TransactionStatus.WAITING_APPROVAL]
    );
    if (
      operationKind === UserBalanceOpKind.DEPOSIT_INTERNAL &&
      transactionStatus === TransactionStatus.AUTHORIZING
    ) {
      approveToken();
    } else {
      write?.();
    }
  }, [submitData]);

  function handleTransactionStatus({ hash }: { hash: `0x${string}` }) {
    if (!hash || !chain) return;
    const txUrl = buildBlockExplorerTxURL({
      chainId: chain!.id,
      txHash: hash,
    });
    setNotification(
      NOTIFICATION_MAP_INTERNAL_BALANCES[TransactionStatus.SUBMITTING]
    );
    setTransactionUrl(txUrl);
  }

  //handle transaction status
  useEffect(() => {
    if (!data) return;
    const { hash } = data;
    handleTransactionStatus({ hash });
  }, [data]);

  //check if transaction is confirmed
  useWaitForTransaction({
    hash: data?.hash,
    onSuccess() {
      push(`/internalmanager`);
      setNotification(
        NOTIFICATION_MAP_INTERNAL_BALANCES[TransactionStatus.CONFIRMED]
      );
    },
    onError() {
      push(`/internalmanager`);
      setNotification(
        NOTIFICATION_MAP_INTERNAL_BALANCES[TransactionStatus.WRITE_ERROR]
      );
    },
  });

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
