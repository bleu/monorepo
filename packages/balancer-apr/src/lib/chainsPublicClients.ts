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
  [mainnet.id]:
    "https://mainnet.chainnodes.org/adcffa0f-ce12-4929-933a-38735d1f5210",
  [optimism.id]:
    "https://optimism-mainnet.chainnodes.org/adcffa0f-ce12-4929-933a-38735d1f5210",
  [arbitrum.id]:
    "https://arbitrum-one.chainnodes.org/adcffa0f-ce12-4929-933a-38735d1f5210",
  [gnosis.id]:
    "https://gnosis-mainnet.chainnodes.org/adcffa0f-ce12-4929-933a-38735d1f5210",
  [polygon.id]:
    "https://polygon-mainnet.chainnodes.org/adcffa0f-ce12-4929-933a-38735d1f5210",
  [polygonZkEvm.id]: "https://1rpc.io/zkevm",
} as const;

export function createClientForChain(chain: ChainType) {
  return createPublicClient({
    chain,
    transport: http(
      RPC_ENDPOINT_MAP[chain.id as keyof typeof RPC_ENDPOINT_MAP],
    ),
    batch: {
      multicall: {
        batchSize: 24,
        wait: 1000,
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
