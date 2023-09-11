import { networkFor } from "@bleu-balancer-tools/utils";

import { DefiLlamaAPI } from "#/lib/coingecko";

import { Round } from "./rounds";

const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000;

export const getBALPriceByRound = async (round: Round) =>
  Promise.all(
    Array.from(
      {
        length:
          Math.floor(
            (round.endDate.getTime() -
              round.startDate.getTime()) /
              MILLISECONDS_IN_DAY,
          ) + 1,
      },
      (_, i) =>
        getTokenPriceByDate(
          new Date(
            round.startDate.getTime() +
              i * MILLISECONDS_IN_DAY,
          ),
          "0xba100000625a3754423978a60c9317c58a424e3d",
          1,
        ),
    ),
  )
    .then((prices) => {
      const total = prices.reduce((sum, price) => sum + price, 0);
      return total / prices.length;
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error);
      throw error;
    });

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
