import { networkFor } from "@bleu-fi/utils";
import { dateToEpoch } from "@bleu-fi/utils/date";
import { formatNumber } from "@bleu-fi/utils/formatNumber";
import { eq, sql } from "drizzle-orm";

import { db } from "#/db";
import { tokenPrices } from "#/db/schema";
import { withCache } from "#/lib/cache";
import { DefiLlamaAPI } from "#/lib/defillama";

const BAL_TOKEN_ADDRESS = "0xba100000625a3754423978a60c9317c58a424e3d";

/**
 * Calculates the average of an array of numbers.
 */
export async function getBALPriceForDateRange(startAt: Date, endAt: Date) {
  const result = await db.execute(sql`

      SELECT
      AVG(price_usd) AS average_price_usd
    FROM
      (SELECT
        price_usd
       FROM
        token_prices
       WHERE
       token_address = '${sql.raw(BAL_TOKEN_ADDRESS)}'
       AND timestamp >= '${sql.raw(startAt.toISOString())}'
       AND timestamp <= '${sql.raw(endAt.toISOString())}'
      ) AS subquery
  `);
  //TODO when there is no price on db
  const { average_price_usd: priceUSD } = result[0];
  return `$ ${formatNumber((priceUSD as string) ?? "", 2)}`;
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
    .where(eq(tokenPrices.networkSlug, networkName))
    .where(eq(tokenPrices.tokenAddress, tokenAddress));

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
