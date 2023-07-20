import { Address } from "@bleu-balancer-tools/utils";
import { parseUnits } from "viem";

import { useInternalBalance } from "#/contexts/InternalManagerContext";
import { readTokenAllowance } from "#/wagmi/readTokenAllowance";

import { TransactionStatus } from "../useTransaction";

export function useCheckAllowance() {
  const { setTransactionStatus, setHasEnoughAllowance } = useInternalBalance();

  async function checkAllowance({
    tokenAmount,
    tokenAddress,
    tokenDecimals,
    userAddress,
  }: {
    tokenAmount: string;
    tokenAddress: Address;
    tokenDecimals: number;
    userAddress: Address;
  }) {
    if (tokenAmount === "" || Number(tokenAmount) <= 0) {
      setHasEnoughAllowance(undefined);
      return;
    }

    const allowance = await readTokenAllowance({
      tokenAddress,
      userAddress,
    });

    const amountToApprove = parseUnits(tokenAmount, tokenDecimals);
    if (allowance >= amountToApprove) {
      setHasEnoughAllowance(true);
      setTransactionStatus(TransactionStatus.APPROVED);
    } else {
      setHasEnoughAllowance(false);
      setTransactionStatus(TransactionStatus.AUTHORIZING);
    }
  }
  return { checkAllowance };
}
