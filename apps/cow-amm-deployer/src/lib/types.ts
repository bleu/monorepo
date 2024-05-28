import { Address } from "viem";

export enum PRICE_ORACLES {
  BALANCER = "Balancer",
  UNI = "Uniswap V2",
  SUSHI = "Sushi V2",
  CUSTOM = "Custom",
  CHAINLINK = "Chainlink",
}

export interface IToken {
  address: Address;
  symbol: string;
  decimals: number;
}

export interface ITokenExtended extends IToken {
  balance: string;
  usdPrice: number;
  usdValue: number;
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
  id: string;
  token0: ITokenExtended;
  token1: ITokenExtended;
  constantProductAddress: Address;
  totalUsdValue: number;
  minTradedToken0: number;
  priceOracleData: `0x${string}`;
  priceOracleAddress: Address;
  disabled: boolean;
}
