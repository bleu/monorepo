import { Address } from "@bleu-fi/utils";
import { erc20ABI } from "@wagmi/core";

import { ChainId, publicClientsFromIds } from "#/utils/chainsPublicClients";

export function fetchTokenInfo<T>(
  tokenAddress: Address,
  chainId: ChainId,
  info:
    | "symbol"
    | "name"
    | "decimals"
    | "allowance"
    | "balanceOf"
    | "totalSupply",
  args?: readonly [`0x${string}`, `0x${string}`] | readonly [`0x${string}`],
) {
  const publicClient = publicClientsFromIds[chainId as ChainId];

  return publicClient.readContract({
    address: tokenAddress,
    abi: erc20ABI,
    functionName: info,
    args,
  }) as Promise<T>;
}
