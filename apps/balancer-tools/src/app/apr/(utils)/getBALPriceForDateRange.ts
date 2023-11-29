import { db } from "@bleu-fi/balancer-apr/src/db";
import { tokenPrices } from "@bleu-fi/balancer-apr/src/db/schema";
import { DefiLlamaAPI } from "@bleu-fi/balancer-apr/src/lib/defillama";
import { networkFor } from "@bleu-fi/utils";
import { dateToEpoch } from "@bleu-fi/utils/date";
import { formatNumber } from "@bleu-fi/utils/formatNumber";
import { and, between, eq, sql } from "drizzle-orm";

import { withCache } from "#/lib/cache";

const BAL_TOKEN_ADDRESS = "0xba100000625a3754423978a60c9317c58a424e3d";

/**
 * Calculates the average of an array of numbers.
 */
export async function getBALPriceForDateRange(startAt: Date, endAt: Date) {
  const result = await db
    .select({
      averagePriceUSD: sql<number>`cast(avg(${tokenPrices.priceUSD}) as decimal)`,
    })
    .from(tokenPrices)
    .where(
      and(
        eq(tokenPrices.tokenAddress, BAL_TOKEN_ADDRESS),
        between(tokenPrices.timestamp, startAt, endAt),
      ),
    )
    .groupBy(tokenPrices.tokenAddress)
    .execute();

  //TODO when there is no price on db
  const { averagePriceUSD } = result[0];
  return `$ ${formatNumber(averagePriceUSD ?? "", 2)}`;
}

export const getTokenPriceByDate = withCache(async function getTokenPriceByDate(
  dateTimestamp: number,
  tokenAddress: string,
  tokenNetwork: number,
) {
  let networkName = networkFor(tokenNetwork).toLowerCase();

  if (networkName === "polygon-zkevm") {
    networkName = networkName.replace("-", "_");
  }

  const dbTokenPrice = await db
    .select()
    .from(tokenPrices)
    .where(
      and(
        eq(tokenPrices.networkSlug, networkName),
        eq(tokenPrices.tokenAddress, tokenAddress),
      ),
    );

  if (dbTokenPrice.length > 0) return dbTokenPrice[0].priceUSD;

  const token = `${networkName}:${tokenAddress}`;
  const relevantDateForPrice = Math.min(dateToEpoch(new Date()), dateTimestamp);
  const response = await DefiLlamaAPI.getHistoricalPrice(
    new Date(relevantDateForPrice * 1000),
    [token],
  );

  const priceUSD = response.coins[token]?.price;

  if (!priceUSD) {
    throw new Error(
      `No price found for token ${token} at ${relevantDateForPrice}`,
    );
  }

  const insertedTokenPrice = await db
    .insert(tokenPrices)
    .values({
      tokenAddress,
      timestamp: new Date(relevantDateForPrice * 1000),
      priceUSD: String(priceUSD),
      networkSlug: networkName,
      rawData: response,
    })
    .onConflictDoNothing()
    .returning();

  return insertedTokenPrice[0].priceUSD;
});
