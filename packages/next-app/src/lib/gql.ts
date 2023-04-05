import {
  ENDPOINTS,
} from "@balancer-pool-metadata/balancer-gql/codegen";
import { getSdkWithHooks as arbitrumSdk } from "@balancer-pool-metadata/balancer-gql/src/gql/__generated__/arbitrum";
import { getSdkWithHooks as goerliSdk } from "@balancer-pool-metadata/balancer-gql/src/gql/__generated__/goerli";
import { getSdkWithHooks as mainnetSdk } from "@balancer-pool-metadata/balancer-gql/src/gql/__generated__/mainnet";
import { getSdkWithHooks as polygonSdk } from "@balancer-pool-metadata/balancer-gql/src/gql/__generated__/polygon";
import { GraphQLClient } from "graphql-request";
import { networkFor, DELEGATE_OWNER } from "./networkFor";
import { Network, networkMultisigs } from "@balancer-pool-metadata/shared";

const networkSdks = {
  [Network.Mainnet]: mainnetSdk,
  [Network.Polygon]: polygonSdk,
  [Network.Arbitrum]: arbitrumSdk,
  [Network.Goerli]: goerliSdk,
};

const client = (chainId: string) => new GraphQLClient(ENDPOINTS[networkFor(chainId)]);

const gql = (chainId: string) => networkSdks[networkFor(chainId)](client(chainId));


export function impersonateWhetherDAO(chainId: string, address: `0x${string}` | undefined) {
  const network = networkFor(chainId);

  if (network !== Network.Goerli && networkMultisigs[network] === address) {
    return DELEGATE_OWNER;
  }
  return address;
}

export default gql;
