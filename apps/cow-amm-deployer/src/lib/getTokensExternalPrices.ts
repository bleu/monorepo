import { IToken } from "#/lib/fetchAmmData";
import { fetchTokenUsdPrice } from "#/lib/tokenUtils";
import { ChainId } from "#/utils/chainsPublicClients";

export async function getTokensExternalPrices([_, chainId, token0, token1]: [
  string,
  ChainId,
  IToken,
  IToken,
]) {
  const [token0ExternalUsdPrice, token1ExternalUsdPrice] = await Promise.all([
    fetchTokenUsdPrice({
      tokenAddress: token0.address,
      tokenDecimals: token0.decimals,
      chainId,
    }).catch(() => 0),
    fetchTokenUsdPrice({
      tokenAddress: token1.address,
      tokenDecimals: token1.decimals,
      chainId,
    }).catch(() => 0),
  ]);

  return {
    token0: {
      externalUsdPrice: token0ExternalUsdPrice,
    },
    token1: {
      externalUsdPrice: token1ExternalUsdPrice,
    },
  };
}
