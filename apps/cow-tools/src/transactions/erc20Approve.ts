import { Address } from "@bleu-balancer-tools/utils";
import { BaseTransaction } from "@gnosis.pm/safe-apps-sdk";
import { erc20ABI } from "@wagmi/core";
import { encodeFunctionData } from "viem";

function getERC20ApproveTx(
  tokenAddress: Address,
  spender: Address,
  amount: bigint,
): BaseTransaction {
  return {
    to: tokenAddress,
    value: "0",
    data: encodeFunctionData({
      abi: erc20ABI,
      functionName: "approve",
      args: [spender, amount],
    }),
  };
}

export { getERC20ApproveTx };
