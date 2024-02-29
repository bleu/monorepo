import { Subgraph, SUBGRAPHS } from "@bleu-fi/gql/codegen";
import uniswapV2Sdks from "@bleu-fi/gql/src/uniswap-v2";
import { Network, networkFor } from "@bleu-fi/utils";
import { GraphQLClient } from "graphql-request";

const clientFor = (client: Subgraph) => (chainId: string) => {
  if (chainId != "1") throw new Error("Only mainnet is supported");
  const network = networkFor(chainId);
  const endpoint = SUBGRAPHS[client].endpointFor(network);
  return new GraphQLClient(endpoint);
};

export const pairs = {
  client: clientFor(Subgraph.UniswapV2),
  gql: (chainId: string) => {
    if (chainId != "1") throw new Error("Only mainnet is supported");
    return uniswapV2Sdks[Network.Ethereum](pairs.client("1"));
  },
};
