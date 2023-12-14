import { createConfig } from "@ponder/core";
import { http } from "viem";
import { milkmanAbi } from "./abis/Milkman";

export default createConfig({
  networks: {
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
    goerli: {
      chainId: 5,
      transport: http(process.env.PONDER_RPC_URL_GOERLI),
    },
  },
  contracts: {
    milkman: {
      abi: milkmanAbi,
      address: "0x11C76AD590ABDFFCD980afEC9ad951B160F02797",
      network: {
        goerli: {
          address: "0x11C76AD590ABDFFCD980afEC9ad951B160F02797",
          startBlock: 8083917
        }
      }
    }
  }
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
  }
);
