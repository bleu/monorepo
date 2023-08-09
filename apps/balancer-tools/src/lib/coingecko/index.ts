import invariant from "tiny-invariant";

import { fetcher } from "#/utils/fetcher";

type HistoricalPriceResponse = {
    coins: {
      [key: string]: {
        decimals: number;
        price: number;
        symbol: string;
        timestamp: number;
      };
    };
  };

export class DefiLlamaAPI {
  private baseURL: string;

  constructor() {
    this.baseURL = 'https://coins.llama.fi';
  }

  async getHistoricalPrice(
    timestamp: number,
    coins: string[],
    searchWidth: string = '6h'
  ): Promise<HistoricalPriceResponse> {
    invariant(coins.length > 0, 'coins must not be empty')
    invariant(coins.every(coin => coin.includes(':')), 'coins must be in format "chain:address"')

    const url = `${this.baseURL}/prices/historical/${timestamp}/${coins.join(",")}?searchWidth=${searchWidth}`;

    return await fetcher<HistoricalPriceResponse>(url);
  }
}
