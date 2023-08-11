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
    this.baseURL = "https://coins.llama.fi";
  }

  async getHistoricalPrice(
    date: Date,
    coins: string[],
    searchWidth: string = "6h",
  ): Promise<HistoricalPriceResponse> {
    invariant(coins.length > 0, "coins must not be empty");
    invariant(
      coins.every((coin) => coin.split(":").length === 2),
      'coins must be in format "chain:address"',
    );
    invariant(date <= new Date(), "date must be in the past");

    const url = `${this.baseURL}/prices/historical/${Math.floor(
      date.getTime() / 1000,
    )}/${coins.join(",")}?searchWidth=${searchWidth}`;

    return await fetcher<HistoricalPriceResponse>(url);
  }
}
