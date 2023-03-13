import {
  ENDPOINTS,
  Network,
} from "@balancer-pool-metadata/pool-metadata-gql/codegen";
import { getSdkWithHooks as goerliSdk } from "@balancer-pool-metadata/pool-metadata-gql/src/gql/__generated__/goerli";
import { GraphQLClient } from "graphql-request";

const currentNetwork =
  typeof localStorage !== "undefined"
    ? localStorage.getItem("networkId") ?? "5"
    : "5";

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

const client = new GraphQLClient(ENDPOINTS[networkFor(currentNetwork)]);

const gql = networkSdks[networkFor(currentNetwork)](client);

export async function getPool(poolId: string) {
  gql.MetadataPool({ poolId }).then((data) => {
    return data;
  });
}

export default gql;
