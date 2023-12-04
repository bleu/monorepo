import { createPublicClient, http } from "viem";
import {
  arbitrum,
  avalanche,
  base,
  gnosis as gnosisChain,
  mainnet as mainnetChain,
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

const mainnet = {
  ...mainnetChain,
  rpcUrls: {
    default: {
      http: [
        "https://mainnet.chainnodes.org/adcffa0f-ce12-4929-933a-38735d1f5210",
      ],
      webSocket: [
        "wss://mainnet.chainnodes.org/adcffa0f-ce12-4929-933a-38735d1f5210",
      ],
    },
    public: {
      ...mainnetChain.rpcUrls.public,
    },
  },
};

const gnosis = {
  ...gnosisChain,
  rpcUrls: {
    default: {
      http: [
        "https://gnosis-mainnet.chainnodes.org/adcffa0f-ce12-4929-933a-38735d1f5210",
      ],
      webSocket: [
        "wss://gnosis-mainnet.chainnodes.org/adcffa0f-ce12-4929-933a-38735d1f5210",
      ],
    },
    public: {
      ...gnosisChain.rpcUrls.public,
    },
  },
};

export function createClientForChain(chain: ChainType) {
  return createPublicClient({
    chain,
    transport: http(chain.rpcUrls.default.http[0]),
    batch: {
      multicall: true,
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
