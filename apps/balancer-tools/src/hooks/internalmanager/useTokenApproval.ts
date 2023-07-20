import { Chain, waitForTransaction } from "@wagmi/core";
import { parseUnits } from "viem";

import { useInternalBalance } from "#/contexts/InternalManagerContext";
import { writeTokenApproval } from "#/wagmi/writeTokenApproval";

import { SubmitData, TransactionStatus } from "../useTransaction";
import { NOTIFICATION_MAP_INTERNAL_BALANCES } from "./useManageUserBalance";
import { useTransactionStatus } from "./useTransactionStatus";

const MAX_UINT256 =
  0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn;

export function useTokenApproval() {
  const { setTransactionStatus, setNotification } = useInternalBalance();
  const { handleTransactionStatus } = useTransactionStatus();

  async function approveToken({
    data,
    chain,
    forceMax = true,
  }: {
    data: SubmitData[];
    chain?: Chain;
    forceMax?: boolean;
  }) {
    const tokenData = data[0];

    try {
      setTransactionStatus(TransactionStatus.WAITING_APPROVAL);
      setNotification(
        NOTIFICATION_MAP_INTERNAL_BALANCES[TransactionStatus.WAITING_APPROVAL],
      );
      const transactionData = await writeTokenApproval({
        tokenAddress: tokenData.tokenAddress,
        tokenAmount: forceMax
          ? MAX_UINT256
          : parseUnits(tokenData.tokenAmount, tokenData.tokenDecimals),
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
          NOTIFICATION_MAP_INTERNAL_BALANCES[TransactionStatus.APPROVED],
        );
      }
    } catch (error) {
      setNotification(
        NOTIFICATION_MAP_INTERNAL_BALANCES[TransactionStatus.WRITE_ERROR],
      );
      setTransactionStatus(TransactionStatus.AUTHORIZING);
    }
  }
  return { approveToken };
}
