import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { goerli, mainnet, polygon, sepolia } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

import { configureChains, createClient } from "#/wagmi";

export const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, goerli, polygon, sepolia],
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
