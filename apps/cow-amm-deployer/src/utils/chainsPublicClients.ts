import { createPublicClient, http } from "viem";
import { arbitrum, gnosis, mainnet, sepolia } from "viem/chains";

export type ChainType = (typeof supportedChains)[number];

export type ChainName = "gnosis" | "mainnet" | "arbitrum" | "sepolia";

export type ChainId = (typeof supportedChainIds)[number];

export const supportedChains = [gnosis, mainnet, arbitrum, sepolia] as const;

export const supportedChainIds = [
  mainnet.id,
  gnosis.id,
  arbitrum.id,
  sepolia.id,
] as const;

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
  arbitrum: createClientForChain(arbitrum),
};

export const publicClientsFromIds = {
  [gnosis.id]: createClientForChain(gnosis),
  [mainnet.id]: createClientForChain(mainnet),
  [sepolia.id]: createClientForChain(sepolia),
  [arbitrum.id]: createClientForChain(arbitrum),
} as const;
