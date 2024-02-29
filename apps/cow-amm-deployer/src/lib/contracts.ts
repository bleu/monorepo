import { gnosis, mainnet, sepolia } from "viem/chains";

// These addresses are the same for all supported chains (mainnet and goerli)
export const COMPOSABLE_COW_ADDRESS =
  "0xfdaFc9d1902f4e0b84f65F49f244b32b31013b74" as const;
export const EXTENSIBLE_FALLBACK_ADDRESS =
  "0x2f55e8b20D0B9FEFA187AA7d00B6Cbe563605bF5" as const;
export const SETTLEMENT_CONTRACT_ADDRESS =
  "0x9008D19f58AAbD9eD0D60971565AA8510560ab41" as const;

export const COW_AMM_MODULE_ADDRESS = {
  [mainnet.id]: "0x49D3d6e387E0CD2AC08cBe2323B341E70ccA3561",
  [gnosis.id]: "0x758fe3195f6499fd64de2b96a0b97D0441c10bAB",
  [sepolia.id]: "0x311eCe22daa29dBe1F253aBFee9dD4b360257aA1",
} as const;

export const COW_AMM_HANDLER_ADDRESS = {
  [mainnet.id]: "0x34323b933096534e43958f6c7bf44f2bb59424da",
  [gnosis.id]: "0xb148f40fff05b5ce6b22752cf8e454b556f7a851",
  [sepolia.id]: "0x4bb23bf4802b4bbe9195637289bb4ffc835b221b",
} as const;
