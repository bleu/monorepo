import { createPublicClient, http } from "viem";
import { goerli, mainnet } from "viem/chains";

export type ChainType = typeof mainnet | typeof goerli;

export type ChainName = "mainnet" | "goerli";

export type ChainId = typeof mainnet.id | typeof goerli.id;

export function createClientForChain(chain: ChainType) {
  return createPublicClient({
    chain,
    transport: http(),
  });
}

export const publicClientsFromNames = {
  mainnet: createClientForChain(mainnet),
  goerli: createClientForChain(goerli),
};

export const publicClientsFromIds = {
  [mainnet.id]: createClientForChain(mainnet),
  [goerli.id]: createClientForChain(goerli),
} as const;
