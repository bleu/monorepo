import { Chain, waitForTransaction } from "@wagmi/core";

import { useInternalBalance } from "#/contexts/InternalManagerContext";
import { writeTokenApproval } from "#/wagmi/writeTokenApproval";

import { NOTIFICATION_MAP_INTERNAL_BALANCES } from "./useManageUserBalance";
import { SubmitData, TransactionStatus } from "./useTransaction";
import { useTransactionStatus } from "./useTransactionStatus";

export function useTokenApproval() {
  const { setTransactionStatus, setNotification } = useInternalBalance();
  const { handleTransactionStatus } = useTransactionStatus();

  async function approveToken({
    data,
    chain,
  }: {
    data: SubmitData[];
    chain?: Chain;
  }) {
    const tokenData = data[0];

    try {
      setTransactionStatus(TransactionStatus.WAITING_APPROVAL);
      setNotification(
        NOTIFICATION_MAP_INTERNAL_BALANCES[TransactionStatus.WAITING_APPROVAL]
      );
      const transactionData = await writeTokenApproval({
        tokenAddress: tokenData.tokenAddress,
        tokenAmount: tokenData.tokenAmount,
        tokenDecimals: tokenData.tokenDecimals,
      });
      const { hash } = transactionData;
      handleTransactionStatus({
        hash,
        chain,
      });
      const waitForTransactionData = await waitForTransaction({
        hash,
      });
      if (waitForTransactionData.status === "success") {
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
  return { approveToken };
}
