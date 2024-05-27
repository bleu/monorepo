import { createConfig } from "@ponder/core";
import { http } from "viem";
import { composableCowAbi } from "./abis/ComposableCow";
import { standaloneConstantProductAbi } from "./abis/StandaloneConstantProduct";
import { standaloneConstantProductFactoryAbi } from "./abis/StandaloneContantProductFactory";

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
    mainnet: {
      chainId: 1,
      transport: http(process.env.PONDER_RPC_URL_MAINNET),
    },
  },
  contracts: {
    composable: {
      abi: composableCowAbi,
      address: "0xfdaFc9d1902f4e0b84f65F49f244b32b31013b74",
      network: {
        sepolia: {
          startBlock: 5245332,
        },
        gnosis: {
          startBlock: 31005430,
        },
        mainnet: {
          startBlock: 18937172,
        },
      },
    },
    standaloneConstantProductFactoryAbi: {
      abi: standaloneConstantProductFactoryAbi,
      network: {
        sepolia: {
          startBlock: 5874562,
          address: "0xb808E8183e3a72d196457D127c7fd4bEfa0D7Fd3",
        },
        gnosis: {
          startBlock: 33874317,
          address: "0xdb1Cba3a87f2db53b6E1E6Af48e28Ed877592Ec0",
        },
        mainnet: {
          startBlock: 19861952,
          address: "0x40664207e3375fb4b733d4743ce9b159331fd034",
        },
      },
    },
  },
});
