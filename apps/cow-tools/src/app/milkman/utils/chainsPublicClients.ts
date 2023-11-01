import { createPublicClient, http } from "viem";
import {
  arbitrum,
  avalanche,
  base,
  gnosis,
  goerli,
  mainnet,
  optimism,
  polygon,
  polygonZkEvm,
} from "viem/chains";
import { type PublicClient } from "wagmi";

type ChainType =
  | typeof mainnet
  | typeof polygon
  | typeof polygonZkEvm
  | typeof arbitrum
  | typeof avalanche
  | typeof gnosis
  | typeof optimism
  | typeof base
  | typeof goerli;

export type ChainName =
  | "ethereum"
  | "polygon"
  | "polygon-zkevm"
  | "arbitrum"
  | "avalanche"
  | "gnosis"
  | "optimism"
  | "base"
  | "goerli";

export function createClientForChain(chain: ChainType) {
  return createPublicClient({
    chain,
    transport: http(chain.rpcUrls.public.http[0]),
  }) as PublicClient;
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
  goerli: createClientForChain(goerli),
};
