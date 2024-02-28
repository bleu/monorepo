import { Address, encodeAbiParameters } from "viem";

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
  // TODO: COW-161 Add mainnet addresses
  [PRICE_ORACLES.BALANCER]: "0xd3a84895080609e1163C80b2Bd65736DB1B86bEC",
  [PRICE_ORACLES.UNI]: "0xE089049027B95C2745D1a954BC1D245352D884e9",
};
