"use client";

import poolsSdks from "@balancer-pool-metadata/gql/src/balancer-pools";
import {
  Address,
  DELEGATE_OWNER,
  Network,
  networkFor,
  networkMultisigs,
} from "@balancer-pool-metadata/shared";
import { GraphQLClient } from "graphql-request";
import gaugesSdks from "@balancer-pool-metadata/gql/src/balancer-gauges";
import { SUBGRAPHS, Subgraph } from "@balancer-pool-metadata/gql/codegen";
import poolMetadataSdks from "@balancer-pool-metadata/gql/src/balancer-pools-metadata";

export function impersonateWhetherDAO(
  chainId: string,
  address: Address | undefined
) {
  const network = networkFor(chainId);

  if (
    network !== Network.Goerli &&
    network !== Network.Sepolia &&
    network !== Network.Gnosis &&
    network !== Network.Optimism &&
    network !== Network.Arbitrum &&
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

export const pools = {
  client: clientFor(Subgraph.BalancerPools),
  gql: (chainId: string) =>
    poolsSdks[networkFor(chainId)](pools.client(chainId)),
};

export const poolsMetadata = {
  client: clientFor(Subgraph.BalancerPoolsMetadata),
  gql: (chainId: string) =>
    poolMetadataSdks[networkFor(chainId)](poolsMetadata.client(chainId)),
};

export const gauges = {
  client: clientFor(Subgraph.BalancerGauges),
  gql: (chainId: string) =>
    gaugesSdks[networkFor(chainId)](gauges.client(chainId)),
};
