import tokensInfo from "public/tokens/5.json";

export interface TokenInfo {
  [address: string]: {
    name: string;
    symbol: string;
    decimals: number;
    logoURI: string;
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createTokenAddressInfoMapping(json: any): TokenInfo {
  const dictionary: TokenInfo = {};

  for (const url in json) {
    const tokens = json[url].tokens;

    for (const token of tokens) {
      const address = token.address.toLowerCase();

      dictionary[address] = {
        name: token.name,
        symbol: token.symbol,
        decimals: token.decimals,
        logoURI: token.logoURI,
      };
    }
  }

  return dictionary;
}

export const tokenDictionary = createTokenAddressInfoMapping(tokensInfo);
