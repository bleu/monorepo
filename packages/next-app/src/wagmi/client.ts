import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { goerli, mainnet, polygon } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

import { configureChains, createClient } from "#/wagmi";

export function getWagmiClient(routerPath: string) {
  const walletChains = /^\/internalmanager/.test(routerPath)
    ? [mainnet, goerli, polygon]
    : [polygon, goerli];

  const { chains, provider, webSocketProvider } = configureChains(
    walletChains,
    [publicProvider()]
  );

  const { connectors } = getDefaultWallets({
    appName: "Balancer Pool Metadata",
    chains,
  });

  const client = createClient({
    autoConnect: true,
    connectors,
    provider,
    webSocketProvider,
  });

  return { client, chains };
}
