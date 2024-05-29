import { dateToEpoch } from "@bleu/utils/date";
import { fetcher } from "@bleu/utils/fetcher";
import invariant from "tiny-invariant";

type HistoricalPriceResponse = {
  coins: {
    [key: string]: {
      decimals: number;
      symbol: string;
      confidence: number;
      prices: {
        price: number;
        timestamp: number;
      }[];
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
    startDate: Date,
    coin: string,
    searchWidth: string = "600",
    span: string = "2000",
    periodStep: string = "1d",
  ): Promise<HistoricalPriceResponse> {
    const self = this.getInstance();
    invariant(
      coin.split(":").length === 2,
      'coins must be in format "chain:address"',
    );
    invariant(startDate <= new Date(), "date must be in the past");

    const url = `${self.baseURL}/chart/${coin}?start=${dateToEpoch(
      startDate,
    )}&span=${span}&period=${periodStep}&searchWidth=${searchWidth}`;
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
