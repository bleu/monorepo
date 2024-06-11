import { gnosis, mainnet, sepolia } from "viem/chains";

import GnosisChainLogo from "#/assets/cow-swap/network-gnosis-chain-logo.svg";
import EthereumLogo from "#/assets/cow-swap/network-mainnet-logo.svg";
import SepoliaLogo from "#/assets/cow-swap/network-sepolia-logo.svg";
import { ChainId } from "#/utils/chainsPublicClients";

export const COW_PROTOCOL_LINK = "https://cow.fi/";

import { NATIVE_CURRENCIES } from "./nativeAndWrappedTokens";
import { TokenWithLogo } from "./tokenWithLogo";

export interface BaseChainInfo {
  readonly docs: string;
  readonly bridge?: string;
  readonly explorer: string;
  readonly infoLink: string;
  readonly logo: { light: string; dark: string };
  readonly name: string;
  readonly addressPrefix: string;
  readonly label: string;
  readonly urlAlias: string;
  readonly helpCenterUrl?: string;
  readonly explorerTitle: string;
  readonly color: string;
  readonly nativeCurrency: TokenWithLogo;
}

export type ChainInfoMap = Record<ChainId, BaseChainInfo>;

export const CHAIN_INFO: ChainInfoMap = {
  [mainnet.id]: {
    docs: "https://docs.cow.fi",
    explorer: "https://etherscan.io",
    infoLink: COW_PROTOCOL_LINK,
    label: "Ethereum",
    name: "mainnet",
    addressPrefix: "eth",
    explorerTitle: "Etherscan",
    urlAlias: "",
    logo: { light: EthereumLogo, dark: EthereumLogo },
    color: "#62688F",
    nativeCurrency: NATIVE_CURRENCIES[mainnet.id],
  },
  // [arbitrum.id]: {
  //   docs: "https://docs.arbitrum.io",
  //   bridge: "https://bridge.arbitrum.io",
  //   explorer: "https://arbiscan.io",
  //   infoLink: "https://arbitrum.io",
  //   label: "Arbitrum One",
  //   addressPrefix: "arb1",
  //   name: "arbitrum_one",
  //   explorerTitle: "Arbiscan",
  //   urlAlias: "arb1",
  //   logo: { light: ArbitrumOneLogoLight, dark: ArbitrumOneLogoDark },
  //   color: "#1B4ADD",
  //   nativeCurrency: NATIVE_CURRENCIES[arbitrum.id],
  // },
  [gnosis.id]: {
    docs: "https://docs.gnosischain.com",
    bridge: "https://bridge.gnosischain.com/",
    explorer: "https://gnosisscan.io",
    infoLink: "https://www.gnosischain.com",
    label: "Gnosis Chain",
    name: "gnosis_chain",
    addressPrefix: "gno",
    explorerTitle: "Gnosisscan",
    urlAlias: "gc",
    logo: { light: GnosisChainLogo, dark: GnosisChainLogo },
    color: "#07795B",
    nativeCurrency: NATIVE_CURRENCIES[gnosis.id],
  },
  [sepolia.id]: {
    docs: "https://docs.cow.fi",
    explorer: "https://sepolia.etherscan.io",
    infoLink: COW_PROTOCOL_LINK,
    label: "Sepolia",
    name: "sepolia",
    addressPrefix: "sep",
    explorerTitle: "Etherscan",
    urlAlias: "sepolia",
    logo: { light: SepoliaLogo, dark: SepoliaLogo },
    color: "#C12FF2",
    nativeCurrency: NATIVE_CURRENCIES[sepolia.id],
  },
};

export const CHAIN_INFO_ARRAY: BaseChainInfo[] = Object.values(CHAIN_INFO);

export function getChainInfo(chainId: ChainId): BaseChainInfo {
  return CHAIN_INFO[chainId];
}
