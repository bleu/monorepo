import { Address } from "viem";

export enum PRICE_ORACLES {
  BALANCER = "Balancer",
  UNI = "Uniswap V2",
  SUSHI = "Sushi V2",
  CUSTOM = "Custom",
  CHAINLINK = "Chainlink",
}

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
