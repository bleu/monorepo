import {
  ENDPOINTS
} from "@balancer-pool-metadata/gauges-gql/codegen";
import { getSdkWithHooks as arbitrumSdk } from "@balancer-pool-metadata/gauges-gql/src/gql/__generated__/arbitrum";
import { getSdkWithHooks as goerliSdk } from "@balancer-pool-metadata/gauges-gql/src/gql/__generated__/goerli";
import { getSdkWithHooks as mainnetSdk } from "@balancer-pool-metadata/gauges-gql/src/gql/__generated__/mainnet";
import { getSdkWithHooks as polygonSdk } from "@balancer-pool-metadata/gauges-gql/src/gql/__generated__/polygon";
import { GraphQLClient } from "graphql-request";

  import { Network } from "@balancer-pool-metadata/shared";

  
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
  
  const client = (chainId: string) => new GraphQLClient(ENDPOINTS[networkFor(chainId)]);
  
  const gql = (chainId: string) => networkSdks[networkFor(chainId)](client(chainId));
  
  export default gql;
  