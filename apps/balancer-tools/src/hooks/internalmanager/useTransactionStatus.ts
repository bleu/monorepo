import { Address, buildBlockExplorerTxUrl } from "@bleu-fi/utils";
import { Chain } from "wagmi";

import { useInternalBalance } from "#/contexts/InternalManagerContext";

import { TransactionStatus } from "../useTransaction";
import { NOTIFICATION_MAP_INTERNAL_BALANCES } from "./useManageUserBalance";

export function useTransactionStatus() {
  const { setNotification, setTransactionUrl } = useInternalBalance();
  function handleTransactionStatus({
    hash,
    chain,
  }: {
    hash: Address;
    chain?: Chain;
  }) {
    if (!hash || !chain) return;
    const txUrl = buildBlockExplorerTxUrl({
      chainId: chain?.id,
      txHash: hash,
    });
    setNotification(
      NOTIFICATION_MAP_INTERNAL_BALANCES[TransactionStatus.SUBMITTING],
    );
    setTransactionUrl(txUrl);
  }
  return { handleTransactionStatus };
}
