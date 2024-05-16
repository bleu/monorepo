import { Subgraph, SUBGRAPHS } from "@bleu-fi/gql/codegen";
import sushiSdks from "@bleu-fi/gql/src/sushi";
import { Network, networkFor } from "@bleu-fi/utils";
import { GraphQLClient } from "graphql-request";
import { sepolia } from "viem/chains";

const clientFor = (client: Subgraph) => (chainId: string) => {
  if (chainId == String(sepolia.id)) throw new Error("Sepolia isn't supported");
  const network = networkFor(chainId);
  const endpoint = SUBGRAPHS[client].endpointFor(network);
  return new GraphQLClient(endpoint);
};

type SushiSupportedNetworks = Network.Ethereum | Network.Gnosis;

export const pairs = {
  client: clientFor(Subgraph.Sushi),
  gql: (chainId: string) => {
    if (chainId == String(sepolia.id))
      throw new Error("Sepolia isn't supported");
    return sushiSdks[networkFor(chainId) as SushiSupportedNetworks](
      pairs.client(chainId),
    );
  },
};
