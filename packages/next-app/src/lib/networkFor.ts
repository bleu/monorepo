import { Network } from "@balancer-pool-metadata/shared";


export const DELEGATE_OWNER = '0xBA1BA1ba1BA1bA1bA1Ba1BA1ba1BA1bA1ba1ba1B';

export const networkIdEnumMap = {
  "1": Network.Mainnet,
  "5": Network.Goerli,
  "137": Network.Polygon,
  "42161": Network.Arbitrum,
};

export function networkFor(key?: string | number) {
  return (key &&
    networkIdEnumMap[key.toString() as keyof typeof networkIdEnumMap] ||
    Network.Mainnet
  );
}

export function networkIdFor(name: string) {
  return Object.keys(networkIdEnumMap).find(
    key => networkIdEnumMap[key as keyof typeof networkIdEnumMap] === name
  ) || "1";
}
