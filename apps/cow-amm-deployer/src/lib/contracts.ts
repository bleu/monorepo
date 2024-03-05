import { gnosis, mainnet, sepolia } from "viem/chains";

// These addresses are the same for all supported chains (mainnet and goerli)
export const COMPOSABLE_COW_ADDRESS =
  "0xfdaFc9d1902f4e0b84f65F49f244b32b31013b74" as const;
export const SETTLEMENT_CONTRACT_ADDRESS =
  "0x9008D19f58AAbD9eD0D60971565AA8510560ab41" as const;

export const COW_AMM_MODULE_ADDRESS = {
  [mainnet.id]: "0x413e10D3A38F002eDd45d57Be1833ea133f5F5a4",
  [gnosis.id]: "0xAa06a7274c97Bdb8375f403A4db565E7375De94e",
  [sepolia.id]: "0x5660096d77dE391bAad64481C0f5241542f1a14a",
} as const;

export const COW_AMM_HANDLER_ADDRESS = {
  [mainnet.id]: "0x34323b933096534e43958f6c7bf44f2bb59424da",
  [gnosis.id]: "0xb148f40fff05b5ce6b22752cf8e454b556f7a851",
  [sepolia.id]: "0x4bb23bf4802b4bbe9195637289bb4ffc835b221b",
} as const;
