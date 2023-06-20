import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import {
  arbitrum,
  gnosis,
  goerli,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

import { configureChains, createClient } from "#/wagmi";

const Gnosis = {
  ...gnosis,
  iconUrl:
    "https://cdn.sanity.io/images/r2mka0oi/production/bf37b9c7fb36c7d3c96d3d05b45c76d89072b777-1800x1800.png",
};

export const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, polygon, arbitrum, Gnosis, optimism, goerli, sepolia],
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
