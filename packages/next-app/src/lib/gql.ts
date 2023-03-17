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

const currentNetwork: string =
  typeof localStorage !== "undefined"
    ? localStorage.getItem("networkId") ?? "1"
    : "1";

const networkIdEnumMap = {
  "1": Network.mainnet,
  "5": Network.goerli,
  "137": Network.polygon,
  "42161": Network.arbitrum,
};

function networkFor(key: string | number) {
  return (
    networkIdEnumMap[key.toString() as keyof typeof networkIdEnumMap] ||
    Network.mainnet
  );
}

const networkSdks = {
  [Network.mainnet]: mainnetSdk,
  [Network.polygon]: polygonSdk,
  [Network.arbitrum]: arbitrumSdk,
  [Network.goerli]: goerliSdk,
};


const mainnetMultisig = [
  '0x7c68c42De679ffB0f16216154C996C354cF1161B',
  '0xf4A80929163C5179Ca042E1B292F5EFBBE3D89e6',
  '0x10A19e7eE7d7F8a52822f6817de8ea18204F2e4f',
  '0xc38c5f97B34E175FFd35407fc91a937300E33860',
  '0x75a52c0e32397A3FC0c052E2CeB3479802713Cf4',
  '0x166f54F44F271407f24AA1BE415a730035637325',
  '0x0EFcCBb9E2C09Ea29551879bd9Da32362b32fc89',
]

const arbitrumMultisig = [
  '0x7c68c42De679ffB0f16216154C996C354cF1161B',
  '0xc38c5f97B34E175FFd35407fc91a937300E33860',
  '0xaF23DC5983230E9eEAf93280e312e57539D098D0',
]

const polygonMultisig = [
  '0x7c68c42De679ffB0f16216154C996C354cF1161B',
  '0xc38c5f97B34E175FFd35407fc91a937300E33860',
  '0xeE071f4B516F69a1603dA393CdE8e76C40E5Be85',
]

const networkMultisig: {
  [key: string]: string[]
} = {
  [Network.mainnet]: mainnetMultisig,
  [Network.polygon]: polygonMultisig,
  [Network.arbitrum]: arbitrumMultisig,
};

const client = new GraphQLClient(ENDPOINTS[networkFor(currentNetwork)]);

const gql = networkSdks[networkFor(currentNetwork)](client);

export function impersonateWhetherDAO(address: `0x${string}` | undefined) {
  if (networkMultisig[networkFor(currentNetwork)].includes(address as string)) {
    return DELEGATE_OWNER
  }

  return address
}

export default gql;
