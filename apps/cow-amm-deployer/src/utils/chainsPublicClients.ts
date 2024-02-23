import { createPublicClient, http } from "viem";
import { gnosis } from "viem/chains";

export type ChainType = typeof gnosis;

export type ChainName = "gnosis";

export type ChainId = typeof gnosis.id;

export function createClientForChain(chain: ChainType) {
  return createPublicClient({
    chain,
    transport: http(),
  });
}

export const publicClientsFromNames = {
  gnosis: createClientForChain(gnosis),
};

export const publicClientsFromIds = {
  [gnosis.id]: createClientForChain(gnosis),
} as const;
