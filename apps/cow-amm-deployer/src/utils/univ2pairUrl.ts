import { NetworkFromNetworkChainId } from "@bleu-fi/utils";
import { gnosis } from "viem/chains";

import { ChainId } from "./chainsPublicClients";

export function getUniV2PairUrl(chainId: ChainId, referencePair?: string) {
  if (chainId === gnosis.id) {
    return;
  }
  return `https://info.uniswap.org/#/${NetworkFromNetworkChainId[chainId]}/pools/${referencePair}`;
}
