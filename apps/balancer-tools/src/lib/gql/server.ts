import { Subgraph, SUBGRAPHS } from "@bleu-balancer-tools/gql/codegen";
import balancerSdks from "@bleu-balancer-tools/gql/src/balancer/index.server";
import gaugesSdks from "@bleu-balancer-tools/gql/src/balancer-gauges/index.server";
import poolMetadataSdks from "@bleu-balancer-tools/gql/src/balancer-pools-metadata/index.server";
import rewardsSdks from "@bleu-balancer-tools/gql/src/balancer-rewards/index.server";
import {
  Address,
  DELEGATE_OWNER,
  Network,
  networkFor,
  networkMultisigs,
} from "@bleu-balancer-tools/utils";
import { GraphQLClient } from "graphql-request";

import { withCache } from "../cache";

export function impersonateWhetherDAO(
  chainId: string,
  address: Address | undefined,
) {
  const network = networkFor(chainId);

  if (
    network !== Network.Goerli &&
    network !== Network.Sepolia &&
    network !== Network.Gnosis &&
    network !== Network.Optimism &&
    network !== Network.Arbitrum &&
    network !== Network.PolygonZKEVM &&
    network !== Network.Base &&
    network !== Network.Avalanche &&
    networkMultisigs[network] === address
  ) {
    return DELEGATE_OWNER;
  }
  return address;
}

const clientFor = (client: Subgraph) => (chainId: string) => {
  const network = networkFor(chainId);
  const endpoint = SUBGRAPHS[client].endpointFor(network);
  return new GraphQLClient(endpoint);
};

function wrapWithCache<T extends object>(obj: T): T {
  return new Proxy(obj, {
    get(target, propKey) {
      const origMethod = target[propKey as keyof T];
      if (typeof origMethod === "function") {
        return function (...args: unknown[]) {
          return withCache(origMethod.bind(target))(...args);
        };
      }
      return origMethod;
    },
  }) as T;
}

export const poolsWithoutCache = {
  client: clientFor(Subgraph.Balancer),
  gql: (chainId: number | string) =>
    balancerSdks[networkFor(chainId)](
      poolsWithoutCache.client(String(chainId)),
    ),
};

export const pools = {
  client: clientFor(Subgraph.Balancer),
  gql: (chainId: number | string) =>
    wrapWithCache(
      balancerSdks[networkFor(chainId)](pools.client(String(chainId))),
    ),
};

export const poolsMetadata = {
  client: clientFor(Subgraph.BalancerPoolsMetadata),
  gql: (chainId: number | string) =>
    poolMetadataSdks[networkFor(chainId)](
      poolsMetadata.client(String(chainId)),
    ),
};

export const gauges = {
  client: clientFor(Subgraph.BalancerGauges),
  gql: (chainId: number | string) =>
    wrapWithCache(
      gaugesSdks[networkFor(chainId)](gauges.client(String(chainId))),
    ),
};

export const internalBalances = {
  client: clientFor(Subgraph.Balancer),
  gql: (chainId: number | string) =>
    balancerSdks[networkFor(chainId)](internalBalances.client(String(chainId))),
};

export const rewards = {
  client: clientFor(Subgraph.BalancerRewards),
  gql: (chainId: string) =>
    rewardsSdks[networkFor(chainId)](rewards.client(chainId)),
};
