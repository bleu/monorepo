import { Address } from "@bleu-fi/utils";

import { ChainId } from "#/utils/chainsPublicClients";

import { getCoingeckoUsdPrice } from "./coingeckoApi";
import { getCowProtocolUsdPrice } from "./getCowProtocolUsdPrice";

/**
 * Fetches USD price for a given currency from coingecko or CowProtocol
 * CoW Protocol Orderbook API is used as a fallback
 * When Coingecko rate limit is hit, CowProtocol will be used for 1 minute
 */
export async function fetchTokenUsdPrice({
  tokenAddress,
  tokenDecimals,
  chainId,
}: {
  tokenAddress: Address;
  tokenDecimals: number;
  chainId: ChainId;
}): Promise<number> {
  return getCoingeckoUsdPrice({
    chainId,
    address: tokenAddress,
  }).catch(() => {
    return getCowProtocolUsdPrice({ chainId, tokenAddress, tokenDecimals });
  });
}
