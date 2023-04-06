import { parseFixed } from "@ethersproject/bignumber";
import { prepareWriteContract, writeContract } from "@wagmi/core";

import { vaultAbi } from "#/abis/vault";

const VAULT_CONTRACT_NETWORK_MAP = {
  5: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
} as const;

export enum UserBalanceOpKind {
  DEPOSIT_INTERNAL,
  WITHDRAW_INTERNAL,
  TRANSFER_INTERNAL,
  TRANSFER_EXTERNAL,
}

export async function writeWithdrawInternalBalance(
  userAddress: `0x${string}`,
  tokenAddress: `0x${string}`,
  tokenAmount: string,
  networkId?: keyof typeof VAULT_CONTRACT_NETWORK_MAP
) {
  const userBalanceOp = {
    kind: UserBalanceOpKind.WITHDRAW_INTERNAL,
    asset: tokenAddress,
    amount: parseFixed(tokenAmount, 18),
    sender: userAddress,
    recipient: userAddress,
  };

  const config = await prepareWriteContract({
    address: VAULT_CONTRACT_NETWORK_MAP[networkId || 5],
    abi: vaultAbi,
    functionName: "manageUserBalance",
    args: [[userBalanceOp]],
  });

  return await writeContract(config);
}
