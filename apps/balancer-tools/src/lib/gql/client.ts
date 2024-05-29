"use client";

import { Subgraph, SUBGRAPHS } from "@bleu/gql/codegen";
import balancerSdks from "@bleu/gql/src/balancer";
import balancerApiV3Sdks from "@bleu/gql/src/balancer-api-v3";
import gaugesSdks from "@bleu/gql/src/balancer-gauges";
import poolMetadataSdks from "@bleu/gql/src/balancer-pools-metadata";
import {
  Address,
  DELEGATE_OWNER,
  Network,
  networkFor,
  networkMultisigs,
} from "@bleu/utils";
import { GraphQLClient } from "graphql-request";

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

export const pools = {
  client: clientFor(Subgraph.Balancer),
  gql: (chainId: number | string) =>
    balancerSdks[networkFor(chainId)](pools.client(String(chainId))),
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
    gaugesSdks[networkFor(chainId)](gauges.client(String(chainId))),
};

export const internalBalances = {
  client: clientFor(Subgraph.Balancer),
  gql: (chainId: number | string) =>
    balancerSdks[networkFor(chainId)](internalBalances.client(String(chainId))),
};

export const balancerApiV3 = {
  client: clientFor(Subgraph.BalancerApiV3),
  gql: (chainId: string) =>
    balancerApiV3Sdks[networkFor(chainId)](balancerApiV3.client(chainId)),
};
