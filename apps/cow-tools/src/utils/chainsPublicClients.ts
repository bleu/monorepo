import { createPublicClient, http } from "viem";
import { gnosis, goerli } from "viem/chains";

export type ChainType = typeof gnosis | typeof goerli;

export type ChainName = "gnosis" | "goerli";

export type ChainId = typeof gnosis.id | typeof goerli.id;

export function createClientForChain(chain: ChainType) {
  return createPublicClient({
    chain,
    transport: http(),
  });
}

export const publicClientsFromNames = {
  gnosis: createClientForChain(gnosis),
  goerli: createClientForChain(goerli),
};

export const publicClientsFromIds = {
  [gnosis.id]: createClientForChain(gnosis),
  [goerli.id]: createClientForChain(goerli),
} as const;
