import { createConfig } from "@ponder/core";
import { http } from "viem";
import { composableCowAbi } from "./abis/ComposableCow";

export default createConfig({
  networks: {
    sepolia: {
      chainId: 11155111,
      transport: http(process.env.PONDER_RPC_URL_SEPOLIA),
    },
    gnosis: {
      chainId: 100,
      transport: http(process.env.PONDER_RPC_URL_GNOSIS),
    },
  },
  contracts: {
    composable: {
      abi: composableCowAbi,
      address: "0xfdaFc9d1902f4e0b84f65F49f244b32b31013b74",
      network: {
        sepolia: {
          startBlock: 5245332, //contract creation block
        },
        gnosis: {
          startBlock: 31005430,
        },
      },
    },
  },
});
