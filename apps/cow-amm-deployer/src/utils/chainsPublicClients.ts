import { createPublicClient, http } from "viem";
import { gnosis, mainnet, sepolia } from "viem/chains";

export type ChainType = typeof gnosis | typeof mainnet | typeof sepolia;

export type ChainName = "gnosis" | "mainnet" | "sepolia";

export type ChainId = typeof gnosis.id | typeof mainnet.id | typeof sepolia.id;

export const supportedChainIds = [
  gnosis.id,
  mainnet.id,
  sepolia.id,
] as number[];

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
