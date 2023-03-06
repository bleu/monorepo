import { GraphQLClient } from "graphql-request";
import {ENDPOINTS} from "@balancer-pool-metadata/balancer-gql/codegen";
// import { getSdkWithHooks as mainnetSdk  } from "@balancer-pool-metadata/balancer-gql/src/gql/__generated__/mainnet";
import { getSdkWithHooks as goerliSdk  } from "@balancer-pool-metadata/balancer-gql/src/gql/__generated__/goerli";
// import { getSdkWithHooks as polygonSdk  } from "@balancer-pool-metadata/balancer-gql/src/gql/__generated__/polygon";
// import { getSdkWithHooks as arbitrumSdk  } from "@balancer-pool-metadata/balancer-gql/src/gql/__generated__/arbitrum";


const client = new GraphQLClient(
// TODO: replace by actual selected network
ENDPOINTS.goerli
);

const gql = goerliSdk(client);

export default gql