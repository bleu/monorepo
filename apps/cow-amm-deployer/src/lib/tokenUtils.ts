import { Address } from "@bleu/utils";
import { formatUnits } from "viem";

import { IToken } from "#/lib/fetchAmmData";
import { ChainId, publicClientsFromIds } from "#/utils/chainsPublicClients";

import { erc20ABI } from "./abis/erc20";
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
  try {
    return await getCoingeckoUsdPrice({
      chainId,
      address: tokenAddress,
    });
  } catch (error) {
    return getCowProtocolUsdPrice({ chainId, tokenAddress, tokenDecimals });
  }
}

export async function fetchWalletTokenBalance({
  token,
  walletAddress,
  chainId,
}: {
  token: IToken;
  walletAddress: Address;
  chainId: ChainId;
}): Promise<string> {
  const publicClient = publicClientsFromIds[chainId];
  const bigIntBalance = await publicClient.readContract({
    abi: erc20ABI,
    address: token.address as Address,
    functionName: "balanceOf",
    args: [walletAddress],
  });
  return formatUnits(bigIntBalance, token.decimals);
}
