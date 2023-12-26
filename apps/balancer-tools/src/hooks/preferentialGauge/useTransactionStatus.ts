import {
  Address,
  buildBlockExplorerTxUrl,
  NetworkChainId,
} from "@bleu-fi/utils";

import { usePreferentialGauge } from "#/contexts/PreferetialGaugeContext";

import { NotificationVariant } from "../useTransaction";

export function useTransactionStatus() {
  const { setNotification, setTransactionUrl } = usePreferentialGauge();
  function handleTransactionStatus({
    hash,
    chainId,
  }: {
    hash: Address;
    chainId?: number;
  }) {
    if (!hash || !chainId) return;
    const txUrl = buildBlockExplorerTxUrl({
      chainId: chainId as NetworkChainId,
      txHash: hash,
    });
    setNotification({
      title: "Wait just a little longer",
      description: "Your transaction is being made",
      variant: NotificationVariant.NOTIFICATION,
    });
    setTransactionUrl(txUrl);
  }
  return { handleTransactionStatus };
}
