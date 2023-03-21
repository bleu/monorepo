import {
  ENDPOINTS,
  Network
} from "@balancer-pool-metadata/pool-metadata-gql/codegen";
import { getSdkWithHooks as arbitrumSdk } from "@balancer-pool-metadata/pool-metadata-gql/src/gql/__generated__/arbitrum";
import { getSdkWithHooks as goerliSdk } from "@balancer-pool-metadata/pool-metadata-gql/src/gql/__generated__/goerli";
import { getSdkWithHooks as mainnetSdk } from "@balancer-pool-metadata/pool-metadata-gql/src/gql/__generated__/mainnet";
import { getSdkWithHooks as polygonSdk } from "@balancer-pool-metadata/pool-metadata-gql/src/gql/__generated__/polygon";
import { GraphQLClient } from "graphql-request";

const networkIdEnumMap = {
  "1": Network.mainnet,
  "5": Network.goerli,
  "137": Network.polygon,
  "42161": Network.arbitrum,
};

function networkFor(key: string | number) {
  return (
    networkIdEnumMap[key.toString() as keyof typeof networkIdEnumMap] || ""
  );
}

const networkSdks = {
  [Network.mainnet]: mainnetSdk,
  [Network.polygon]: polygonSdk,
  [Network.arbitrum]: arbitrumSdk,
  [Network.goerli]: goerliSdk,
};

const client = (chainId: string) => new GraphQLClient(ENDPOINTS[networkFor(chainId)]);

const gql = (chainId: string) => networkSdks[networkFor(chainId)](client(chainId));

export default gql;
