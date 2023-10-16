import { createPublicClient, http } from "viem";
import {
  arbitrum,
  avalanche,
  base,
  gnosis,
  mainnet,
  optimism,
  polygon,
  polygonZkEvm,
} from "viem/chains";

type ChainType =
  | typeof mainnet
  | typeof polygon
  | typeof polygonZkEvm
  | typeof arbitrum
  | typeof avalanche
  | typeof gnosis
  | typeof optimism
  | typeof base;

export type ChainName =
  | "ethereum"
  | "polygon"
  | "polygon-zkevm"
  | "arbitrum"
  | "avalanche"
  | "gnosis"
  | "optimism"
  | "base";

export function createClientForChain(chain: ChainType) {
  return createPublicClient({
    chain,
    transport: http(),
  });
}

export const publicClients = {
  ethereum: createClientForChain(mainnet),
  optimism: createClientForChain(optimism),
  polygon: createClientForChain(polygon),
  "polygon-zkevm": createClientForChain(polygonZkEvm),
  arbitrum: createClientForChain(arbitrum),
  avalanche: createClientForChain(avalanche),
  gnosis: createClientForChain(gnosis),
  base: createClientForChain(base),
};
