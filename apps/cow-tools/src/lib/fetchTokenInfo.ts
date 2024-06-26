import { Address } from "@bleu/utils";
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
) {
  const publicClient = publicClientsFromIds[chainId as ChainId];

  return publicClient.readContract({
    address: tokenAddress,
    abi: erc20ABI,
    functionName: info,
  }) as Promise<T>;
}
