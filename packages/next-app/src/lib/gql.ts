import { GraphQLClient } from "graphql-request";
import {
  ENDPOINTS,
  Network,
} from "@balancer-pool-metadata/balancer-gql/codegen";
import { getSdkWithHooks as mainnetSdk } from "@balancer-pool-metadata/balancer-gql/src/gql/__generated__/mainnet";
import { getSdkWithHooks as goerliSdk } from "@balancer-pool-metadata/balancer-gql/src/gql/__generated__/goerli";
import { getSdkWithHooks as polygonSdk } from "@balancer-pool-metadata/balancer-gql/src/gql/__generated__/polygon";
import { getSdkWithHooks as arbitrumSdk } from "@balancer-pool-metadata/balancer-gql/src/gql/__generated__/arbitrum";

const currentNetwork =
  typeof localStorage !== "undefined"
    ? localStorage.getItem("networkId") ?? "1"
    : "1";

function networkFor(key: string | number): Network {
  switch (key.toString()) {
    case "1":
      return Network.mainnet;
    case "5":
      return Network.goerli;
    case "137":
      return Network.polygon;
    case "42161":
      return Network.arbitrum;
    default:
      return Network.mainnet;
  }
}

const networkSdks = {
  [Network.mainnet]: mainnetSdk,
  [Network.polygon]: polygonSdk,
  [Network.arbitrum]: arbitrumSdk,
  [Network.goerli]: goerliSdk,
};

const client = new GraphQLClient(ENDPOINTS[networkFor(currentNetwork)]);

const gql = networkSdks[networkFor(currentNetwork)](client);

export default gql;
