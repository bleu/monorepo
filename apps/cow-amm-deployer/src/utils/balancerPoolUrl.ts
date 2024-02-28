import { NetworkFromNetworkChainId } from "@bleu-fi/utils";

import { ChainId } from "./chainsPublicClients";

export function getBalancerPoolUrl(chainId: ChainId, poolId?: string) {
  return `https://app.balancer.fi/#/${NetworkFromNetworkChainId[chainId]}-chain/pool/${poolId}`;
}
