import { networkFor } from "@bleu-balancer-tools/utils";

import { withCache } from "#/lib/cache";
import { DefiLlamaAPI } from "#/lib/coingecko";

import { calculateDaysBetween } from "../api/(utils)/date";

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
    endAtTimestamp: number,
  ) {
    const numberOfDays = calculateDaysBetween(
      startAtTimestamp * 1000,
      endAtTimestamp * 1000,
    );
    const pricePromises = Array.from({ length: numberOfDays }, (_) => {
      return getTokenPriceByDate(
        endAtTimestamp * 1000,
        BAL_TOKEN_ADDRESS,
        BAL_TOKEN_NETWORK,
      );
    });
    try {
      const prices = await Promise.all(pricePromises);
      return calculateAverage(prices);
    } catch (error) {
      // TODO: BAL-782 - Add sentry here
      // eslint-disable-next-line no-console
      console.error(
        `Error fetching BAL price between ${startAtTimestamp} and ${endAtTimestamp}`,
      );
      throw error;
    }
  },
);

export const getTokenPriceByDate = withCache(async function getTokenPriceByDate(
  dateTimestamp: number,
  tokenAddress: string,
  tokenNetwork: number,
) {
  const token = `${networkFor(tokenNetwork).toLowerCase()}:${tokenAddress}`;
  const relevantDateForPrice = Math.min(Date.now(), dateTimestamp);
  const response = await new DefiLlamaAPI().getHistoricalPrice(
    new Date(relevantDateForPrice),
    [token],
  );

  return response.coins[token]?.price;
});
