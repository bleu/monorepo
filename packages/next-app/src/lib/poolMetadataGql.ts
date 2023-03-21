import {
  ENDPOINTS,
  Network,
} from "@balancer-pool-metadata/pool-metadata-gql/codegen";
import { getSdkWithHooks as goerliSdk } from "@balancer-pool-metadata/pool-metadata-gql/src/gql/__generated__/goerli";
import { GraphQLClient } from "graphql-request";

const networkIdEnumMap = {
  "5": Network.goerli,
};

function networkFor(key: string | number) {
  return (
    networkIdEnumMap[key.toString() as keyof typeof networkIdEnumMap] || ""
  );
}

const networkSdks = {
  [Network.goerli]: goerliSdk,
};

const client = (chainId: string) => new GraphQLClient(ENDPOINTS[networkFor(chainId)]);

const gql = (chainId: string) => networkSdks[networkFor(chainId)](client(chainId));

export default gql;
