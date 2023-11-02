import invariant from "tiny-invariant";

import { dateToEpoch } from "@bleu-balancer-tools/utils/date";
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
  public static instance: DefiLlamaAPI;
  public baseURL: string = "https://coins.llama.fi";

  private constructor() {}

  public static getInstance(): DefiLlamaAPI {
    if (!DefiLlamaAPI.instance) {
      DefiLlamaAPI.instance = new DefiLlamaAPI();
    }
    return DefiLlamaAPI.instance;
  }

  public static async getHistoricalPrice(
    date: Date,
    coins: string[],
    searchWidth: string = "6h",
  ): Promise<HistoricalPriceResponse> {
    const self = this.getInstance();
    invariant(coins.length > 0, "coins must not be empty");
    invariant(
      coins.every((coin) => coin.split(":").length === 2),
      'coins must be in format "chain:address"',
    );
    invariant(date <= new Date(), "date must be in the past");

    const url = `${self.baseURL}/prices/historical/${dateToEpoch(
      date,
    )}/${coins.join(",")}?searchWidth=${searchWidth}`;
    return await fetcher<HistoricalPriceResponse>(url);
  }

  public static async findBlockNumber(network: string, timestamp: number) {
    const self = this.getInstance();
    const response = await fetcher<{ height: number; timestamp: number }>(
      `${self.baseURL}/block/${network
        .toLowerCase()
        .replace("-", "_")
        .replace("gnosis", "xdai")
        .replace("avalanche", "avax")}/${timestamp}`,
    );
    return response.height;
  }
}
