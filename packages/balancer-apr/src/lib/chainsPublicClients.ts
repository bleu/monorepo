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

const RPC_ENDPOINT_MAP = {
  [mainnet.id]: process.env.MAINNET_RPC_URL,
  [optimism.id]: process.env.OPTIMISM_RPC_URL,
  [arbitrum.id]: process.env.ARBITRUM_RPC_URL,
  [gnosis.id]: process.env.GNOSIS_RPC_URL,
  [polygon.id]: process.env.POLYGON_RPC_URL,
  [polygonZkEvm.id]: process.env.POLYGONZKEVM_RPC_URL,
  [base.id]: process.env.BASE_RPC_URL,
} as const;

export function createClientForChain(chain: ChainType) {
  return createPublicClient({
    chain,
    transport: http(
      RPC_ENDPOINT_MAP[chain.id as keyof typeof RPC_ENDPOINT_MAP],
      {
        batch: true,
      },
    ),
    cacheTime: 10_000,
    batch: {
      multicall: {
        batchSize: 100,
        wait: 500,
      },
    },
  });
}

interface PublicClients {
  [networkSlug: string]: ReturnType<typeof createClientForChain>;
}

export const publicClients: PublicClients = {
  ethereum: createClientForChain(mainnet),
  optimism: createClientForChain(optimism),
  polygon: createClientForChain(polygon),
  "polygon-zkevm": createClientForChain(polygonZkEvm),
  arbitrum: createClientForChain(arbitrum),
  avalanche: createClientForChain(avalanche),
  gnosis: createClientForChain(gnosis),
  base: createClientForChain(base),
};
