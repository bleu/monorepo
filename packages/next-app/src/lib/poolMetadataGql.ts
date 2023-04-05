
import { getSdkWithHooks as mainnetSdk } from "@balancer-pool-metadata/gql/src/__generated__/balancer-pools-metadata/Mainnet";
import { getSdkWithHooks as goerliSdk } from "@balancer-pool-metadata/gql/src/__generated__/balancer-pools-metadata/Goerli";
import { getSdkWithHooks as arbitrumSdk } from "@balancer-pool-metadata/gql/src/__generated__/balancer-pools-metadata/Arbitrum";
import { getSdkWithHooks as polygonSdk } from "@balancer-pool-metadata/gql/src/__generated__/balancer-pools-metadata/Polygon";
import { GraphQLClient } from "graphql-request";
import { Network } from "@balancer-pool-metadata/shared";
import { SUBGRAPHS, Subgraph } from "@balancer-pool-metadata/gql/codegen";

const networkIdEnumMap = {
  "1": Network.Mainnet,
  "5": Network.Goerli,
  "137": Network.Polygon,
  "42161": Network.Arbitrum,
};

function networkFor(key: string | number) {
  return (
    networkIdEnumMap[key.toString() as keyof typeof networkIdEnumMap] || ""
  );
}


const networkSdks = {
  [Network.Mainnet]: mainnetSdk,
  [Network.Polygon]: polygonSdk,
  [Network.Arbitrum]: arbitrumSdk,
  [Network.Goerli]: goerliSdk,
};

const client = (chainId: string) => {
  const network = networkFor(chainId)
  const endpoint = SUBGRAPHS[Subgraph.BalancerPoolsMetadata].endpointFor(network);
  return new GraphQLClient(endpoint)
}

const gql = (chainId: string) => networkSdks[networkFor(chainId)](client(chainId));

export default gql;
