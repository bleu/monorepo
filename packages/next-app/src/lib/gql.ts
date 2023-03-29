import {
  ENDPOINTS,
  Network
} from "@balancer-pool-metadata/balancer-gql/codegen";
import { getSdkWithHooks as arbitrumSdk } from "@balancer-pool-metadata/balancer-gql/src/gql/__generated__/arbitrum";
import { getSdkWithHooks as goerliSdk } from "@balancer-pool-metadata/balancer-gql/src/gql/__generated__/goerli";
import { getSdkWithHooks as mainnetSdk } from "@balancer-pool-metadata/balancer-gql/src/gql/__generated__/mainnet";
import { getSdkWithHooks as polygonSdk } from "@balancer-pool-metadata/balancer-gql/src/gql/__generated__/polygon";
import { GraphQLClient } from "graphql-request";

export const DELEGATE_OWNER = '0xBA1BA1ba1BA1bA1bA1Ba1BA1ba1BA1bA1ba1ba1B';

const networkIdEnumMap = {
  "1": Network.mainnet,
  "5": Network.goerli,
  "137": Network.polygon,
  "42161": Network.arbitrum,
};

export function networkFor(key: string | number) {
  return (
    networkIdEnumMap[key.toString() as keyof typeof networkIdEnumMap] ||
    Network.mainnet
  );
}

export function networkIdFor(name: string){
  return Object.keys(networkIdEnumMap).find(
    key => networkIdEnumMap[key as keyof typeof networkIdEnumMap] === name
  ) || "1"
}

const networkSdks = {
  [Network.mainnet]: mainnetSdk,
  [Network.polygon]: polygonSdk,
  [Network.arbitrum]: arbitrumSdk,
  [Network.goerli]: goerliSdk,
};

export const networkMultisigs = {
  [Network.mainnet]: '0x10A19e7eE7d7F8a52822f6817de8ea18204F2e4f',
  [Network.polygon]: '0xeE071f4B516F69a1603dA393CdE8e76C40E5Be85',
  [Network.arbitrum]: '0xaF23DC5983230E9eEAf93280e312e57539D098D0',
};

const client = (chainId: string) => new GraphQLClient(ENDPOINTS[networkFor(chainId)]);

const gql = (chainId: string) => networkSdks[networkFor(chainId)](client(chainId));


export function impersonateWhetherDAO(chainId: string, address: `0x${string}` | undefined) {
  const network = networkFor(chainId);

  if (network !== Network.goerli && networkMultisigs[network] === address) {
    return DELEGATE_OWNER;
  }
  return address;
}

export default gql;
