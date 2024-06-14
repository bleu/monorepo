import {
  Custom,
  getTransactionDetails,
  getTransactionQueue,
  MultiSend,
  Transaction,
  TransactionInfoType,
} from "@safe-global/safe-gateway-typescript-sdk";

import { ChainId } from "#/utils/chainsPublicClients";

import { COW_CONSTANT_PRODUCT_FACTORY } from "./contracts";

export const fetchHasAmmTxPending = async ({
  chainId,
  address,
}: {
  chainId: ChainId;
  address: string;
}) => {
  const queuedObjs = await getTransactionQueue(String(chainId), address);
  const queuedTxs = queuedObjs.results.filter(
    (obj) => obj.type === "TRANSACTION",
  ) as Transaction[];
  const txInfos = queuedTxs
    .map((tx) => tx.transaction.txInfo)
    .filter((txInfo) => txInfo.type === TransactionInfoType.CUSTOM) as (
    | Custom
    | MultiSend
  )[];

  const anyTxToProductConstantFactory = txInfos.some(
    (txInfo) =>
      txInfo.to.value.toLowerCase() ===
      COW_CONSTANT_PRODUCT_FACTORY[chainId].toLowerCase(),
  );

  // early return to avoid unnecessary calls to getTransactionDetails
  if (anyTxToProductConstantFactory) {
    return true;
  }

  const multisendTxs = queuedTxs.filter(
    (tx) =>
      tx.transaction.txInfo.type === TransactionInfoType.CUSTOM &&
      tx.transaction.txInfo.methodName === "multiSend",
  ) as Transaction[];

  const txDetails = await Promise.all(
    multisendTxs.map((tx) =>
      getTransactionDetails(String(chainId), tx.transaction.id),
    ),
  );

  const anyMultiSendTxToProductConstantFactory = txDetails.some((txDetail) => {
    const txsInsideMultisend =
      txDetail.txData?.dataDecoded?.parameters?.[0].valueDecoded;
    if (!txsInsideMultisend) return false;
    return txsInsideMultisend.some(
      (tx) =>
        tx.to.toLowerCase() ===
        COW_CONSTANT_PRODUCT_FACTORY[chainId].toLowerCase(),
    );
  });

  return anyMultiSendTxToProductConstantFactory;
};
