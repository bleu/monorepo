export enum Network {
  Ethereum = "ethereum",
  Polygon = "polygon",
  Arbitrum = "arbitrum",
  Goerli = "goerli",
  Sepolia = "sepolia",
}

export enum NetworkChainId {
  ETHEREUM = 1,
  GOERLI = 5,
  POLYGON = 137,
  ARBITRUM = 42161,
  SEPOLIA = 11155111,
}

export const networkUrls = {
  [NetworkChainId.ETHEREUM]: {
    url: "https://etherscan.io/",
    name: "Etherscan",
  },
  [NetworkChainId.GOERLI]: {
    url: "https://goerli.etherscan.io/",
    name: "Goerli Etherscan",
  },
  [NetworkChainId.POLYGON]: {
    url: "https://polygonscan.com/",
    name: "PolygonScan",
  },
  [NetworkChainId.ARBITRUM]: { url: "https://arbiscan.io/", name: "Arbiscan" },
  [NetworkChainId.SEPOLIA]: {
    url: "https://sepolia.etherscan.io/",
    name: "Sepolia Etherscan",
  },
};

export function buildBlockExplorerTxURL({
  chainId,
  txHash,
}: {
  chainId: NetworkChainId;
  txHash: `0x${string}`;
}) {
  const networkUrl = networkUrls[chainId as keyof typeof networkUrls];
  return `${networkUrl.url}tx/${txHash}`;
}

export function buildExplorerAddressURL({
  chainId,
  address,
}: {
  chainId: NetworkChainId;
  address: `0x${string}`;
}) {
  const networkUrl = networkUrls[chainId as keyof typeof networkUrls];
  return {
    url: `${networkUrl.url}address/${address}`,
    name: networkUrl.name,
  };
}

export const DELEGATE_OWNER = "0xBA1BA1ba1BA1bA1bA1Ba1BA1ba1BA1bA1ba1ba1B";

export const networkMultisigs = {
  [Network.Ethereum]: "0x10A19e7eE7d7F8a52822f6817de8ea18204F2e4f",
  [Network.Polygon]: "0xeE071f4B516F69a1603dA393CdE8e76C40E5Be85",
  [Network.Arbitrum]: "0xaF23DC5983230E9eEAf93280e312e57539D098D0",
};

export const networkIdEnumMap = {
  "1": Network.Ethereum,
  "5": Network.Goerli,
  "137": Network.Polygon,
  "42161": Network.Arbitrum,
  "11155111": Network.Sepolia,
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
