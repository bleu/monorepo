import { getDefaultWallets } from "@rainbow-me/rainbowkit";
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
import { publicProvider } from "wagmi/providers/public";

import { configureChains, createClient } from "#/wagmi";

const gnosis = {
  ...gnosisChain,
  iconUrl:
    "https://cdn.sanity.io/images/r2mka0oi/production/bf37b9c7fb36c7d3c96d3d05b45c76d89072b777-1800x1800.png",
};

const polygonZkEvm = {
  ...polygonZkEvmChain,
  iconUrl: "https://app.balancer.fi/assets/polygon-db738948.svg",
};

export const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, polygon, polygonZkEvm, arbitrum, gnosis, optimism, goerli, sepolia],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Balancer Pool Metadata",
  chains,
});

export const client = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});
