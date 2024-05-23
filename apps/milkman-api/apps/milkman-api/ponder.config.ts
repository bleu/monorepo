import { createConfig } from "@ponder/core";
import { http } from "viem";
import { milkmanAbi } from "./abis/Milkman";

export default createConfig({
  networks: {
    mainnet: {
      chainId: 1,
      transport: http(process.env.PONDER_RPC_URL_MAINNET),
    },
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
          startBlock: 8083917,
        },
        mainnet: {
          startBlock: 16124030,
        },
      },
    },
  },
});
