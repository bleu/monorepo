import { TokenBalance } from "@gnosis.pm/safe-apps-sdk";
import { Address } from "viem";

export enum PRICE_ORACLES {
  BALANCER = "Balancer",
  UNI = "Uniswap",
  SUSHI = "Sushi",
  CUSTOM = "Custom",
}

export enum FALLBACK_STATES {
  HAS_DOMAIN_VERIFIER = "HAS_DOMAIN_VERIFIER",
  HAS_EXTENSIBLE_FALLBACK = "HAS_EXTENSIBLE_FALLBACK",
  HAS_NOTHING = "HAS_NOTHING",
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
