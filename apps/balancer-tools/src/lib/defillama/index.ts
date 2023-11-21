import { dateToEpoch } from "@bleu-fi/utils/date";
import { desc, eq, lte } from "drizzle-orm";
import invariant from "tiny-invariant";

import { db } from "#/db";
import { blocks, networks } from "#/db/schema";
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
    const dbBlock = await db
      .select()
      .from(blocks)
      .leftJoin(networks, eq(networks.slug, blocks.networkSlug))
      .where(eq(networks.slug, network))
      .where(lte(blocks.timestamp, new Date(timestamp * 1000)))
      .orderBy(desc(blocks.timestamp))
      .limit(1);

    if (dbBlock.length > 0) return dbBlock[0].blocks.number;

    const self = this.getInstance();
    const response = await fetcher<{ height: number; timestamp: number }>(
      `${self.baseURL}/block/${network
        .toLowerCase()
        .replace("-", "_")
        .replace("gnosis", "xdai")
        .replace("avalanche", "avax")}/${timestamp}`,
    );

    const dbNetwork = await db
      .insert(networks)
      .values({
        slug: network,
      })
      .onConflictDoUpdate({
        target: networks.slug,
        set: { slug: network },
      })
      .returning();

    await db
      .insert(blocks)
      .values({
        networkSlug: dbNetwork[0].slug,
        number: Number(response.height),
        timestamp: new Date(response.timestamp * 1000),
      })
      .onConflictDoNothing()
      .returning();
    return response.height;
  }
}
