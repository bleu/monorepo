import { Address, buildBlockExplorerTxUrl } from "@bleu-fi/utils";
import { Chain } from "wagmi";

import { useGaugesCheckpointer } from "#/contexts/GaugesCheckpointerContext";

import { TransactionStatus } from "../useTransaction";
import { NOTIFICATION_MAP_GAUGES_CHECKPOINT } from "./useCheckpointGauges";

export function useTransactionStatus() {
  const { setNotification, setTransactionUrl } = useGaugesCheckpointer();
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
      NOTIFICATION_MAP_GAUGES_CHECKPOINT[TransactionStatus.SUBMITTING],
    );
    setTransactionUrl(txUrl);
  }
  return { handleTransactionStatus };
}
