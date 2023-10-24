import type { Config } from "@ponder/core";
import { http } from "viem";

export const config: Config = {
  networks: [
    // {
    //   name: "mainnet",
    //   chainId: 1,
    //   rpcUrl: process.env.PONDER_RPC_URL_MAINNET,
    // },
    // {
    //   name: "gnosis",
    //   chainId: 100,
    //   rpcUrl: process.env.PONDER_RPC_URL_GNOSIS,
    // },
    {
      name: "goerli",
      chainId: 5,
      rpcUrl: process.env.PONDER_RPC_URL_GOERLI,
    },
  ],
  contracts: [
    // {
    //   name: "Milkman",
    //   network: "mainnet",
    //   abi: "./abis/Milkman.json",
    //   address: "0x11C76AD590ABDFFCD980afEC9ad951B160F02797",
    //   startBlock: 16124030,
    // },
    // {
    //   name: "Milkman",
    //   network: "gnosis",
    //   abi: "./abis/Milkman.json",
    //   address: "0x11C76AD590ABDFFCD980afEC9ad951B160F02797",
    //   startBlock: 26367139,
    // },
    {
      name: "Milkman",
      network: "goerli",
      abi: "./abis/Milkman.json",
      address: "0x11C76AD590ABDFFCD980afEC9ad951B160F02797",
      startBlock: 8083917,
    },
  ],
};
