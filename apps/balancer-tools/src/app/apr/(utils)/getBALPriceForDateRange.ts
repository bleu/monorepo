import { networkFor } from "@bleu-fi/utils";
import { calculateDaysBetween, dateToEpoch } from "@bleu-fi/utils/date";
import { eq } from "drizzle-orm";

import { db } from "#/db";
import { tokenPrices } from "#/db/schema";
import { withCache } from "#/lib/cache";
import { DefiLlamaAPI } from "#/lib/defillama";

const BAL_TOKEN_ADDRESS = "0xba100000625a3754423978a60c9317c58a424e3d";
const BAL_TOKEN_NETWORK = 1;

/**
 * Calculates the average of an array of numbers.
 */
const calculateAverage = (arr: number[]) =>
  arr.reduce((sum, val) => sum + val, 0) / arr.length;

export const getBALPriceForDateRange = withCache(
  async function getBALPriceByRoundFn(
    startAtTimestamp: number,
    endAtTimestamp: number
  ) {
    const numberOfDays = calculateDaysBetween(startAtTimestamp, endAtTimestamp);
    const pricePromises = Array.from({ length: numberOfDays }, (_) => {
      return getTokenPriceByDate(
        endAtTimestamp,
        BAL_TOKEN_ADDRESS,
        BAL_TOKEN_NETWORK
      );
    });
    try {
      const prices = await Promise.all(pricePromises);
      return calculateAverage(prices);
    } catch (error) {
      // TODO: BAL-782 - Add sentry here
      // eslint-disable-next-line no-console
      console.error(
        `Error fetching BAL price between ${startAtTimestamp} and ${endAtTimestamp} - ${error}`
      );
      throw error;
    }
  }
);

export const getTokenPriceByDate = withCache(async function getTokenPriceByDate(
  dateTimestamp: number,
  tokenAddress: string,
  tokenNetwork: number
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
    [token]
  );

  const priceUSD = response.coins[token]?.price;

  if (!priceUSD) {
    throw new Error(
      `No price found for token ${token} at ${relevantDateForPrice}`
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
