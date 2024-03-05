import { gnosis, mainnet, sepolia } from "viem/chains";

import { ChainId } from "#/utils/chainsPublicClients";

const BASE_URL = "https://api.coingecko.com/api/v3/simple/token_price";
const VS_CURRENCY = "usd";

export interface CoinGeckoUsdQuote {
  [address: string]: {
    usd: number;
  };
}

export const COINGECK_PLATFORMS: Record<ChainId, string | null> = {
  [mainnet.id]: "ethereum",
  [gnosis.id]: "xdai",
  [sepolia.id]: null,
};

export async function getCoingeckoUsdPrice({
  address,
  chainId,
}: {
  address: string;
  chainId: ChainId;
}): Promise<number> {
  const platform = COINGECK_PLATFORMS[chainId];

  if (!platform) throw new Error("UnsupporedCoingeckoPlatformError");

  const params = {
    contract_addresses: address,
    vs_currencies: VS_CURRENCY,
  };

  const url = `${BASE_URL}/${platform}?${new URLSearchParams(params)}`;

  return fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((res: CoinGeckoUsdQuote) => {
      const value = res[address.toLowerCase()]?.usd;

      // If coingecko API returns an empty response
      // It means Coingecko doesn't know about the currency
      if (value === undefined) {
        throw new Error("CoingeckoUnknownCurrency");
      }

      return value;
    });
}
