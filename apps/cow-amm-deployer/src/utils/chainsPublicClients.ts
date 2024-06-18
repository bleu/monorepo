import { createPublicClient, http } from "viem";
import { gnosis, mainnet, sepolia } from "viem/chains";

export type ChainType = (typeof supportedChains)[number];

export type ChainName = "gnosis" | "mainnet" | "sepolia";

export type ChainId = (typeof supportedChainIds)[number];

export const supportedChains = [gnosis, mainnet, sepolia] as const;

export const supportedChainIds = [mainnet.id, gnosis.id, sepolia.id] as const;

export const RPC_PROVIDERS = {
  [mainnet.id]: process.env.NEXT_PUBLIC_RPC_URL_MAINNET,
  [gnosis.id]: process.env.NEXT_PUBLIC_RPC_URL_GNOSIS,
  [sepolia.id]: process.env.NEXT_PUBLIC_RPC_URL_SEPOLIA,
} as const;

export function createClientForChain(chain: ChainType) {
  return createPublicClient({
    chain,
    transport: http(RPC_PROVIDERS[chain.id]),
    cacheTime: 0,
  });
}

export const publicClientsFromNames = {
  gnosis: createClientForChain(gnosis),
  mainnet: createClientForChain(mainnet),
  sepolia: createClientForChain(sepolia),
};

export const publicClientsFromIds = {
  [gnosis.id]: createClientForChain(gnosis),
  [mainnet.id]: createClientForChain(mainnet),
  [sepolia.id]: createClientForChain(sepolia),
} as const;
