import { createPublicClient, http } from "viem";
import { gnosis, mainnet, sepolia } from "viem/chains";

export type ChainType = (typeof supportedChains)[number];

export type ChainName = "gnosis" | "mainnet" | "sepolia";

export type ChainId = (typeof supportedChainIds)[number];

export const supportedChains = [gnosis, mainnet, sepolia] as const;

export const supportedChainIds = [mainnet.id, gnosis.id, sepolia.id] as const;

export function createClientForChain(chain: ChainType) {
  return createPublicClient({
    chain,
    transport: http(),
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
