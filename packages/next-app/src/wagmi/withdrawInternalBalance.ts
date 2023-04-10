import { parseFixed } from "@ethersproject/bignumber";
import { prepareWriteContract, writeContract } from "@wagmi/core";

import { vaultAbi } from "#/abis/vault";
import { tokenDictionary } from "#/utils/getTokenInfo";

const NETWORK_VAULT_ADDRESS_MAP = {
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
  networkId?: keyof typeof NETWORK_VAULT_ADDRESS_MAP
) {
  const userBalanceOp = {
    kind: UserBalanceOpKind.WITHDRAW_INTERNAL,
    asset: tokenAddress,
    amount: parseFixed(tokenAmount, tokenDictionary[tokenAddress].decimals),
    sender: userAddress,
    recipient: userAddress,
  };

  const config = await prepareWriteContract({
    address: NETWORK_VAULT_ADDRESS_MAP[networkId || 5],
    abi: vaultAbi,
    functionName: "manageUserBalance",
    args: [[userBalanceOp]],
  });

  return await writeContract(config);
}
