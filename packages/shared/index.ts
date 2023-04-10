export enum Network {
  Mainnet = "Mainnet",
  Polygon = "Polygon",
  Arbitrum = "Arbitrum",
  Goerli = "Goerli",
}

export const DELEGATE_OWNER = "0xBA1BA1ba1BA1bA1bA1Ba1BA1ba1BA1bA1ba1ba1B";

export const networkMultisigs = {
  [Network.Mainnet]: "0x10A19e7eE7d7F8a52822f6817de8ea18204F2e4f",
  [Network.Polygon]: "0xeE071f4B516F69a1603dA393CdE8e76C40E5Be85",
  [Network.Arbitrum]: "0xaF23DC5983230E9eEAf93280e312e57539D098D0",
};

export const networkIdEnumMap = {
  "1": Network.Mainnet,
  "5": Network.Goerli,
  "137": Network.Polygon,
  "42161": Network.Arbitrum,
};

export function networkFor(key: string | number) {
  return networkIdEnumMap[key.toString() as keyof typeof networkIdEnumMap];
}

export function networkIdFor(name?: string) {
  if (!name) {
    return "1";
  }

  return (
    Object.keys(networkIdEnumMap).find(
      (key) => networkIdEnumMap[key as keyof typeof networkIdEnumMap] === name
    ) || "1"
  );
}
