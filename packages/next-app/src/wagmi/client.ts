import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { goerli, polygon } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

import { configureChains, createClient } from "#/wagmi";

const { chains, provider, webSocketProvider } = configureChains(
  [polygon, goerli],
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

export { chains };
