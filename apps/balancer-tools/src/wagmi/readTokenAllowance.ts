import { Address } from "@bleu/utils";
import { erc20ABI, readContract } from "@wagmi/core";

import { vaultAddress } from "./generated";

export async function readTokenAllowance({
  tokenAddress,
  userAddress,
}: {
  tokenAddress: Address;
  userAddress: Address;
}) {
  return await readContract({
    address: tokenAddress,
    abi: erc20ABI,
    functionName: "allowance",
    args: [userAddress, vaultAddress[5]],
  });
}
