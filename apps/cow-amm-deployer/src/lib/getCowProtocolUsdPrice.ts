import { Address } from "viem";
import { gnosis, mainnet, sepolia } from "viem/chains";

import { ChainId } from "#/utils/chainsPublicClients";

import { IToken } from "./fetchAmmData";
import { getNativePrice } from "./orderBookApi/fetchNativePrice";

export const USDC: Record<ChainId, IToken> = {
  [mainnet.id]: {
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    decimals: 6,
    symbol: "USDC",
  },
  [gnosis.id]: {
    address: "0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83",
    decimals: 6,
    symbol: "USDC",
  },
  [sepolia.id]: {
    address: "0xbe72E441BF55620febc26715db68d3494213D8Cb",
    decimals: 18,
    symbol: "USDC (test)",
  },
};

export async function getCowProtocolUsdPrice({
  chainId,
  tokenAddress,
  tokenDecimals,
}: {
  chainId: ChainId;
  tokenAddress: Address;
  tokenDecimals: number;
}): Promise<number> {
  const usdcToken = USDC[chainId];
  const [usdNativePrice, tokenNativePrice] = await Promise.all([
    getNativePrice(USDC[chainId].address as Address, chainId),
    getNativePrice(tokenAddress, chainId),
  ]);

  if (usdNativePrice && tokenNativePrice) {
    const usdPrice = invertNativeToTokenPrice(
      usdNativePrice,
      usdcToken.decimals,
    );
    const tokenPrice = invertNativeToTokenPrice(
      tokenNativePrice,
      tokenDecimals,
    );

    if (!tokenPrice) throw new Error("Token price is 0");

    return usdPrice / tokenPrice;
  }

  throw new Error("Failed to fetch native price");
}

/**
 * API response value represents the amount of native token atoms needed to buy 1 atom of the specified token
 * This function inverts the price to represent the amount of specified token atoms needed to buy 1 atom of the native token
 */
function invertNativeToTokenPrice(value: number, decimals: number): number {
  const inverted = 1 / value;
  return inverted * 10 ** (18 - decimals);
}
