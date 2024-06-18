import { createConfig, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { injected, safe } from "wagmi/connectors";

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}

export const config = createConfig({
  chains: [sepolia, mainnet],
  connectors: [
    injected(),
    safe({
      allowedDomains: [/app.safe.global$/],
      debug: true,
    }),
  ],
  transports: {
    [mainnet.id]: http(process.env.RPC_URL_MAINNET),
    [sepolia.id]: http(process.env.RPC_URL_SEPOLIA),
  },
});
