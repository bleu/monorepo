export enum Network {
  Mainnet = "Mainnet",
  Polygon = "Polygon",
  Arbitrum = "Arbitrum",
  Goerli = "Goerli",
}

export const networkMultisigs = {
  [Network.Mainnet]: "0x10A19e7eE7d7F8a52822f6817de8ea18204F2e4f",
  [Network.Polygon]: "0xeE071f4B516F69a1603dA393CdE8e76C40E5Be85",
  [Network.Arbitrum]: "0xaF23DC5983230E9eEAf93280e312e57539D098D0",
};
