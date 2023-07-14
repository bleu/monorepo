import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { publicProvider } from "@wagmi/core/providers/public";
import { configureChains, createConfig } from "wagmi";
import {
  arbitrum,
  gnosis as gnosisChain,
  goerli,
  mainnet,
  optimism,
  polygon,
  polygonZkEvm as polygonZkEvmChain,
  sepolia,
} from "wagmi/chains";

const projectId = "4f98524b2b9b5a80d14a519a8dcbecc2";

const gnosis = {
  ...gnosisChain,
  iconUrl:
    "https://cdn.sanity.io/images/r2mka0oi/production/bf37b9c7fb36c7d3c96d3d05b45c76d89072b777-1800x1800.png",
};

const polygonZkEvm = {
  ...polygonZkEvmChain,
  iconUrl: "https://app.balancer.fi/assets/polygon-db738948.svg",
};

export const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, polygon, gnosis, arbitrum, optimism, polygonZkEvm, goerli, sepolia],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Balancer Tools",
  projectId,
  chains,
});

export const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});
