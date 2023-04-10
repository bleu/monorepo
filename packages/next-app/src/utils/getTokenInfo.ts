import tokensInfo from "public/tokens.json";

interface TokenInfo {
  [address: string]: { name: string; symbol: string; decimals: number };
}

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
      };
    }
  }

  return dictionary;
}

export const tokenDictionary = createTokenAddressInfoMapping(tokensInfo);
