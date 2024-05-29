import { Address } from "viem";

export const PRICE_ORACLES = {
  UNI: "Uniswap V2",
  BALANCER: "Balancer",
  SUSHI: "Sushi V2",
  CHAINLINK: "Chainlink",
  CUSTOM: "Custom",
} as const;

export type PriceOraclesValue =
  (typeof PRICE_ORACLES)[keyof typeof PRICE_ORACLES];

export interface PriceOracleData {
  balancerPoolId?: `0x${string}`;
  uniswapV2PairAddress?: Address;
  sushiSwapPairAddress?: Address;
  chainlinkPriceFeed0?: Address;
  chainlinkPriceFeed1?: Address;
  chainlinkTimeThresholdInHours?: number;
  customPriceOracleAddress?: Address;
  customPriceOracleData?: `0x${string}`;
}
