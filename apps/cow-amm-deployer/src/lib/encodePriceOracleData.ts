import { Address, encodeAbiParameters } from "viem";
import { gnosis, mainnet, sepolia } from "viem/chains";

import { PRICE_ORACLES, PriceOraclesValue } from "#/lib/types";
import { ChainId } from "#/utils/chainsPublicClients";

export interface IEncodePriceOracleData {
  priceOracle: PriceOraclesValue;
  balancerPoolId?: `0x${string}`;
  uniswapV2Pair?: Address;
  sushiV2Pair?: Address;
  customPriceOracleData?: `0x${string}`;
  chainlinkPriceFeed0?: Address;
  chainlinkPriceFeed1?: Address;
  chainlinkTimeThresholdInHours?: number;
}

export interface IGetPriceOracleAddress {
  chainId: ChainId;
  priceOracle: PriceOraclesValue;
  customPriceOracleAddress?: Address;
}

export function encodePriceOracleData({
  priceOracle,
  balancerPoolId,
  uniswapV2Pair,
  sushiV2Pair,
  customPriceOracleData,
  chainlinkPriceFeed0,
  chainlinkPriceFeed1,
  chainlinkTimeThresholdInHours,
}: IEncodePriceOracleData): `0x${string}` {
  switch (priceOracle) {
    case PRICE_ORACLES.BALANCER:
      if (!balancerPoolId) {
        throw new Error("Balancer Pool ID is required");
      }
      return encodeAbiParameters(
        [{ name: "poolId", type: "bytes32" }],
        [balancerPoolId],
      );
    case PRICE_ORACLES.UNI:
      if (!uniswapV2Pair) {
        throw new Error("Uniswap V2 Pool Address is required");
      }
      return encodeAbiParameters(
        [{ name: "pairAddress", type: "address" }],
        [uniswapV2Pair],
      );
    case PRICE_ORACLES.SUSHI:
      if (!sushiV2Pair) {
        throw new Error("Sushi V2 Pool Address is required");
      }
      return encodeAbiParameters(
        [{ name: "pairAddress", type: "address" }],
        [sushiV2Pair],
      );
    case PRICE_ORACLES.CHAINLINK:
      if (
        !chainlinkPriceFeed0 ||
        !chainlinkPriceFeed1 ||
        !chainlinkTimeThresholdInHours
      ) {
        throw new Error("Chainlink Oracle data is required");
      }
      return encodeAbiParameters(
        [
          {
            name: "token0Feed",
            type: "address",
          },
          {
            name: "token1Feed",
            type: "address",
          },
          { name: "timeThreshold", type: "uint256" },
          { name: "backoff", type: "uint256" },
        ],
        [
          chainlinkPriceFeed0,
          chainlinkPriceFeed1,
          BigInt((chainlinkTimeThresholdInHours * 3600).toFixed()), // transforming hours to seconds
          BigInt(1),
        ],
      );
    case PRICE_ORACLES.CUSTOM:
      if (!customPriceOracleData) {
        throw new Error("Custom price oracle data is required");
      }
      return customPriceOracleData;
    default:
      throw new Error("Unknown price oracle");
  }
}

export function getPriceOracleAddress({
  chainId,
  priceOracle,
  customPriceOracleAddress,
}: IGetPriceOracleAddress) {
  if (priceOracle === PRICE_ORACLES.CUSTOM) {
    if (!customPriceOracleAddress) {
      throw new Error("Custom price oracle address is required");
    }
    return customPriceOracleAddress;
  }
  return PRICE_ORACLES_ADDRESSES[chainId][priceOracle];
}

export const PRICE_ORACLES_ADDRESSES = {
  [mainnet.id]: {
    [PRICE_ORACLES.BALANCER]: "0xad37FE3dDedF8cdEE1022Da1b17412CFB6495596",
    [PRICE_ORACLES.UNI]: "0x573cC0c800048f94e022463b9214D92c2d65e97B",
    [PRICE_ORACLES.SUSHI]: "0x573cC0c800048f94e022463b9214D92c2d65e97B",
    [PRICE_ORACLES.CHAINLINK]: "0xF54c4bcc34a8750382B8fB0f0EC6f1A6C785af9c",
  },
  [gnosis.id]: {
    [PRICE_ORACLES.BALANCER]: "0xd3a84895080609e1163C80b2Bd65736DB1B86bEC",
    [PRICE_ORACLES.UNI]: "0xE089049027B95C2745D1a954BC1D245352D884e9",
    [PRICE_ORACLES.SUSHI]: "0xE089049027B95C2745D1a954BC1D245352D884e9",
    [PRICE_ORACLES.CHAINLINK]: "0xbd91a72dc3d9b5d9b16ee8638da1fc65311bd90a",
  },
  [sepolia.id]: {
    [PRICE_ORACLES.BALANCER]: "0xB2efb68Ab1798c04700AfD7f625C0FfbDe974756",
    [PRICE_ORACLES.UNI]: "0xE45AE383873F9F7e3e42deB12886F481999696b6",
    [PRICE_ORACLES.SUSHI]: "0xE45AE383873F9F7e3e42deB12886F481999696b6",
    [PRICE_ORACLES.CHAINLINK]: "0x79200763b5bc95d8d6a3b53be1e9a494bc301940",
  },
} as const;
