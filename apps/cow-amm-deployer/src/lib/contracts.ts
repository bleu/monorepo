import { gnosis, mainnet, sepolia } from "viem/chains";

// These addresses are the same for all supported chains (mainnet and goerli)
export const COMPOSABLE_COW_ADDRESS =
  "0xfdaFc9d1902f4e0b84f65F49f244b32b31013b74" as const;

export const UNISWAP_V2_FACTORY_ADDRESS =
  "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f" as const;

export const SUSHI_V2_FACTORY_ADDRESS = {
  [mainnet.id]: "0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac",
  [gnosis.id]: "0xc35DADB65012eC5796536bD9864eD8773aBc74C4",
  [sepolia.id]: "0x734583f62Bb6ACe3c9bA9bd5A53143CA2Ce8C55A",
} as const;

export const COW_AMM_MODULE_ADDRESS = {
  [mainnet.id]: "0x413e10D3A38F002eDd45d57Be1833ea133f5F5a4",
  [gnosis.id]: "0xAa06a7274c97Bdb8375f403A4db565E7375De94e",
  [sepolia.id]: "0x5660096d77dE391bAad64481C0f5241542f1a14a",
} as const;

export const COW_AMM_HANDLER_ADDRESS = {
  [mainnet.id]: "0x34323B933096534e43958F6c7Bf44F2Bb59424DA",
  [gnosis.id]: "0xB148F40fff05b5CE6B22752cf8E454B556f7a851",
  [sepolia.id]: "0x4Bb23BF4802B4Bbe9195637289Bb4FfC835b221b",
} as const;

export const COW_CONSTANT_PRODUCT_FACTORY = {
  [mainnet.id]: "0x40664207e3375FB4b733d4743CE9b159331fd034",
  [gnosis.id]: "0xdb1cba3a87f2db53b6e1e6af48e28ed877592ec0",
  [sepolia.id]: "0xb808e8183e3a72d196457d127c7fd4befa0d7fd3",
} as const;
