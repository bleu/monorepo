import { networkFor } from "@bleu-balancer-tools/utils";

import { DefiLlamaAPI } from "#/lib/coingecko";

const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000;
const BAL_TOKEN_ADDRESS = "0xba100000625a3754423978a60c9317c58a424e3d";
const BAL_TOKEN_NETWORK = 1;

/**
 * Calculates the number of days between two dates, inclusive of both start and end dates.
 */
const calculateDaysBetween = (startDate: Date, endDate: Date) =>
  Math.floor((endDate.getTime() - startDate.getTime()) / MILLISECONDS_IN_DAY) +
  1;

/**
 * Calculates the average of an array of numbers.
 */
const calculateAverage = (arr: number[]) =>
  arr.reduce((sum, val) => sum + val, 0) / arr.length;

export const getBALPriceByRound = async (startDate: Date, endDate: Date) => {
  const days = calculateDaysBetween(startDate, endDate);
  const pricePromises = Array.from({ length: days }, (_, i) =>
    getTokenPriceByDate(
      new Date(startDate.getTime() + i * MILLISECONDS_IN_DAY),
      BAL_TOKEN_ADDRESS,
      BAL_TOKEN_NETWORK,
    ),
  );
  try {
    const prices = await Promise.all(pricePromises);
    return calculateAverage(prices);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    throw error;
  }
};

export const getTokenPriceByDate = async (
  date: Date,
  tokenAddress: string,
  tokenNetwork: number,
) => {
  const token = `${networkFor(tokenNetwork).toLowerCase()}:${tokenAddress}`;
  const relevantDateForPrice = Math.min(Date.now(), date.getTime());
  const api = new DefiLlamaAPI();

  const response = await api.getHistoricalPrice(
    new Date(relevantDateForPrice),
    [token],
  );

  return response.coins[token]?.price;
};
