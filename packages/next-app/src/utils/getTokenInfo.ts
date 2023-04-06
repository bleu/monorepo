import tokensInfo from "public/tokens.json";

function getTokenDictionary(json: any): {
  [address: string]: { name: string; symbol: string; decimals: number };
} {
  const dictionary: {
    [address: string]: { name: string; symbol: string; decimals: number };
  } = {};

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

export const tokenDictionary = getTokenDictionary(tokensInfo);
