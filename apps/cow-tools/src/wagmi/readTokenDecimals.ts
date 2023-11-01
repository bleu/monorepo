import { Address } from "@bleu-balancer-tools/utils";
import { erc20ABI, readContract } from "@wagmi/core";

export async function readTokenDecimals(tokenAddress: Address) {
  return await readContract({
    address: tokenAddress,
    abi: erc20ABI,
    functionName: "decimals",
  });
}
