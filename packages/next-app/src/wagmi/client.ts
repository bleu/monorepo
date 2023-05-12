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

export const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, polygon, arbitrum, gnosis, optimism, goerli, sepolia],
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
