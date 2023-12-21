/** @type {import('@wagmi/cli').Config} */
import { defineConfig } from "@wagmi/cli";
import { foundry, react } from "@wagmi/cli/plugins";
import * as chains from "wagmi/chains";

import { checkGaugeMintAbi } from "./src/abis/checkGaugeMint";
import { vaultAbi } from "./src/abis/vault";

export default defineConfig({
  out: "src/wagmi/generated.ts",
  contracts: [
    {
      name: "vault",
      abi: vaultAbi,
      address: {
        [chains.mainnet.id]: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
        [chains.sepolia.id]: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
        [chains.goerli.id]: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
        [chains.polygon.id]: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
        [chains.optimism.id]: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
        [chains.arbitrum.id]: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
        [chains.gnosis.id]: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
        [chains.polygonZkEvm.id]: "0xBA12222222228d8Ba445958a75a0704d566BF2C8",
      },
    },
    {
      name: "CheckGaugeMint",
      abi: checkGaugeMintAbi,
      address: {
        [chains.mainnet.id]: "0x6a24a03a2209a1513fe99fce2e06aac8c8e84880",
      },
    },
  ],
  plugins: [
    foundry({
      artifacts: "out/PoolMetadataRegistry.sol",
      deployments: {
        PoolMetadataRegistry: {
          [chains.mainnet.id]: "0xfffa983f4037Faa2e93613d44749280B7F54f62D",
          [chains.sepolia.id]: "0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b",
          [chains.goerli.id]: "0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b",
          [chains.polygon.id]: "0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b",
          [chains.optimism.id]: "0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b",
          [chains.arbitrum.id]: "0xb1631f708a7a9cd30ae55ea8f085af7cc275d2a2",
          [chains.gnosis.id]: "0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b",
          [chains.polygonZkEvm.id]:
            "0x566b0f1dDE5ad7AB3C2cD3EbBAA07622283E818b",
        },
      },
      exclude: ["../pool-metadata/contracts/lib/**"],
      project: "../pool-metadata/contracts",
    }),
    react(),
  ],
});
