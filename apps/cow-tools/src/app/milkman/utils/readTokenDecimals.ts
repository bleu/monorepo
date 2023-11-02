import { erc20ABI } from "@wagmi/core";
import { Address, createPublicClient, http } from "viem";
import { goerli } from "viem/chains";

export const publicClient = createPublicClient({
  chain: goerli,
  transport: http(),
});

export async function readTokenDecimals(tokenAddress: Address) {
  try {
    return await publicClient.readContract({
      address: tokenAddress,
      abi: erc20ABI,
      functionName: "decimals",
    });
  } catch (error) {
    throw new Error(`Error fetching decimals of ${tokenAddress} - ${error}`);
  }
}
