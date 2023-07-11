import {
  Address,
  buildBlockExplorerTxUrl,
  networkFor,
} from "@bleu-balancer-tools/shared";
import { parseFixed } from "@ethersproject/bignumber";
import { prepareWriteContract, readContract, writeContract } from "@wagmi/core";
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
  WAITING_APPROVAL = "Waiting for your wallet approvement...",
  APPROVED = "Transaction approved",
  PINNING = "Pinning metadata...",
  CONFIRMING = "Set metadata on-chain",
  CONFIRMED = "Transaction was a success",
  SUBMITTING = "Writing on-chain",
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
  receiverAddress: Address;
  tokenAddress: Address;
  tokenAmount: string;
  tokenDecimals: number;
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
  [TransactionStatus.APPROVED]: {
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
  poolId: Address;
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

  const handleSetTransactionLink = (hash: Address) => {
    const txUrl = buildBlockExplorerTxUrl({ chainId: chain?.id, txHash: hash });
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
      // Once the transaction is approved and the metadata is pinned, update the transaction status to APPROVED
      try {
        const value = await pinJSON(poolId, metadata);
        setIpfsCID(value);
        setTransactionStatus(TransactionStatus.APPROVED);
        setNotification(NOTIFICATION_MAP[TransactionStatus.APPROVED]);
        setIsTransactionDisabled(false);
      } catch (error) {
        setTransactionStatus(TransactionStatus.PINNING_ERROR);
        setNotification(NOTIFICATION_MAP[TransactionStatus.PINNING_ERROR]);
        setIsTransactionDisabled(false);
      }
    } else if (transactionStatus === TransactionStatus.APPROVED) {
      //Call function to set metadata on-chain here
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
  operationKind,
}: {
  userAddress: Address;
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
    setHasEnoughAllowance,
  } = useInternalBalance();
  const { push } = useRouter();
  const { chain } = useNetwork();
  const [submitData, setSubmitData] = useState<SubmitData[]>([]);

  const network = networkFor(chain?.id);

  const userBalancesOp = submitData.map((data) => {
    return {
      kind: operationKind as number,
      asset: data.tokenAddress as Address,
      amount: parseFixed(
        data.tokenAmount ? data.tokenAmount : "0",
        data.tokenDecimals
      ),
      sender: userAddress as Address,
      recipient: data.receiverAddress as Address,
    };
  });

  const { config } = usePrepareVaultManageUserBalance({
    args: [userBalancesOp],
  });

  const { data, write, error } = useVaultManageUserBalance(config);

  async function checkAllowance({
    tokenAmount,
    tokenAddress,
    tokenDecimals,
  }: {
    tokenAmount: string;
    tokenAddress: Address;
    tokenDecimals: number;
  }) {
    if (tokenAmount === "" || Number(tokenAmount) <= 0) {
      setHasEnoughAllowance(undefined);
      return;
    }
    const allowance = await readContract({
      address: tokenAddress,
      abi: erc20ABI,
      functionName: "allowance",
      args: [userAddress, vaultAddress[5]],
    });
    const amountToApprove = parseFixed(tokenAmount, tokenDecimals);
    if (allowance.gte(amountToApprove)) {
      setHasEnoughAllowance(true);
      setTransactionStatus(TransactionStatus.APPROVED);
    } else {
      setHasEnoughAllowance(false);
      setTransactionStatus(TransactionStatus.AUTHORIZING);
    }
  }

  async function approveToken() {
    try {
      if (!submitData) return;

      setTransactionStatus(TransactionStatus.WAITING_APPROVAL);
      setNotification(
        NOTIFICATION_MAP_INTERNAL_BALANCES[TransactionStatus.WAITING_APPROVAL]
      );
      const config = await prepareWriteContract({
        address: submitData[0].tokenAddress as Address,
        abi: erc20ABI,
        functionName: "approve",
        args: [
          vaultAddress[5],
          parseFixed(
            submitData[0]?.tokenAmount ? submitData[0].tokenAmount : "0",
            submitData[0]?.tokenDecimals ? submitData[0].tokenDecimals : "0"
          ),
        ],
      });

      const data = await writeContract(config);
      const { hash, wait } = data;
      handleTransactionStatus({ hash });
      const receipt = await wait();
      if (receipt.status) {
        setTransactionStatus(TransactionStatus.APPROVED);
        setNotification(
          NOTIFICATION_MAP_INTERNAL_BALANCES[TransactionStatus.APPROVED]
        );
      }
    } catch (error) {
      setNotification(
        NOTIFICATION_MAP_INTERNAL_BALANCES[TransactionStatus.WRITE_ERROR]
      );
      setTransactionStatus(TransactionStatus.AUTHORIZING);
    }
  }

  function handleTransaction({
    data,
    decimals,
  }: {
    data: FieldValues;
    decimals: number;
  }) {
    setSubmitData([
      {
        tokenAddress: data.tokenAddress,
        tokenAmount: data.tokenAmount,
        tokenDecimals: decimals,
        receiverAddress: data.receiverAddress,
      },
    ]);
  }

  useEffect(() => {
    if (submitData.length === 0) return;
    setTransactionUrl(undefined);
    if (
      operationKind === UserBalanceOpKind.DEPOSIT_INTERNAL &&
      transactionStatus === TransactionStatus.AUTHORIZING
    ) {
      approveToken();
      setNotification(
        NOTIFICATION_MAP_INTERNAL_BALANCES[TransactionStatus.AUTHORIZING]
      );
    } else {
      setNotification(
        NOTIFICATION_MAP_INTERNAL_BALANCES[TransactionStatus.CONFIRMING]
      );
      write?.();
      setTransactionStatus(TransactionStatus.SUBMITTING);
    }
  }, [submitData]);

  useEffect(() => {
    if (!error) return;
    if (
      operationKind === UserBalanceOpKind.DEPOSIT_INTERNAL &&
      transactionStatus === TransactionStatus.SUBMITTING
    ) {
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
  }, [error]);

  function handleTransactionStatus({ hash }: { hash: Address }) {
    if (!hash || !chain) return;
    const txUrl = buildBlockExplorerTxUrl({
      chainId: chain?.id,
      txHash: hash,
    });
    setNotification(
      NOTIFICATION_MAP_INTERNAL_BALANCES[TransactionStatus.SUBMITTING]
    );
    setTransactionUrl(txUrl);
  }

  useEffect(() => {
    if (!data) return;
    const { hash } = data;
    handleTransactionStatus({ hash });
  }, [data]);

  useWaitForTransaction({
    hash: data?.hash,
    onSuccess() {
      push(`/internalmanager/${network}`);
      setNotification(
        NOTIFICATION_MAP_INTERNAL_BALANCES[TransactionStatus.CONFIRMED]
      );
    },
    onError() {
      push(`/internalmanager/${network}`);
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
    setSubmitData,
    checkAllowance,
  };
}
