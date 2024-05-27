import { TokenBalance } from "@gnosis.pm/safe-apps-sdk";
import { Address } from "viem";

export enum PRICE_ORACLES {
  BALANCER = "Balancer",
  UNI = "Uniswap V2",
  SUSHI = "Sushi V2",
  CUSTOM = "Custom",
  CHAINLINK = "Chainlink",
}

export interface IToken {
  address: string;
  symbol: string;
  decimals: number;
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
export interface ICowAmm {
  token0: TokenBalance & {
    externalUsdPrice: number;
    externalUsdValue: number;
  };
  token1: TokenBalance & {
    externalUsdPrice: number;
    externalUsdValue: number;
  };
  totalUsdValue: number;
  minTradedToken0: number;
  priceOracle: PRICE_ORACLES;
  priceOracleData: PriceOracleData;
  hash: `0x${string}`;
  priceOracleAddress: Address;
}
