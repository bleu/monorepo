import { Address, encodeAbiParameters } from "viem";
import { gnosis, mainnet, sepolia } from "viem/chains";

import { PRICE_ORACLES } from "#/lib/types";

export function encodePriceOracleData({
  priceOracle,
  balancerPoolId,
  uniswapV2Pair,
}: {
  priceOracle: PRICE_ORACLES;
  balancerPoolId?: `0x${string}`;
  uniswapV2Pair?: Address;
}): `0x${string}` {
  if (priceOracle === PRICE_ORACLES.BALANCER) {
    if (!balancerPoolId) {
      throw new Error("Balancer Pool Id is required");
    }
    return encodeAbiParameters(
      [{ name: "poolId", type: "bytes32" }],
      [balancerPoolId],
    );
  }
  if (priceOracle === PRICE_ORACLES.UNI) {
    if (!uniswapV2Pair) {
      throw new Error("Uniswap V2 Pool Address is required");
    }
    return encodeAbiParameters(
      [{ name: "pairAddress", type: "address" }],
      [uniswapV2Pair],
    );
  }
  throw new Error("Unknown price oracle");
}

export const PRICE_ORACLES_ADDRESSES = {
  [mainnet.id]: {
    [PRICE_ORACLES.BALANCER]: "0xad37FE3dDedF8cdEE1022Da1b17412CFB6495596",
    [PRICE_ORACLES.UNI]: "0x573cC0c800048f94e022463b9214D92c2d65e97B",
  },
  [gnosis.id]: {
    [PRICE_ORACLES.BALANCER]: "0xd3a84895080609e1163C80b2Bd65736DB1B86bEC",
    [PRICE_ORACLES.UNI]: "0xE089049027B95C2745D1a954BC1D245352D884e9",
  },
  [sepolia.id]: {
    [PRICE_ORACLES.BALANCER]: "0xB2efb68Ab1798c04700AfD7f625C0FfbDe974756",
    [PRICE_ORACLES.UNI]: "0xE45AE383873F9F7e3e42deB12886F481999696b6",
  },
} as const;
