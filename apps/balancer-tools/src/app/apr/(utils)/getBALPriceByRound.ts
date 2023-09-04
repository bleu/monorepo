import { networkFor } from "@bleu-balancer-tools/utils";

import { DefiLlamaAPI } from "#/lib/coingecko";

import { Round } from "./rounds";

export const getBALPriceByRound = async (round: Round) => {
  return getTokenPriceByRound(
    round,
    "0xba100000625a3754423978a60c9317c58a424e3d",
    1,
  );
};

export const getTokenPriceByRound = async (
  round: Round,
  tokenAddress: string,
  tokenNetwork: number,
) => {
  const token = `${networkFor(tokenNetwork)}:${tokenAddress}`;
  const relevantDateForPrice = Math.min(Date.now(), round.endDate.getTime());
  const api = new DefiLlamaAPI();

  const response = await api.getHistoricalPrice(
    new Date(relevantDateForPrice),
    [token],
  );

  return response.coins[token]?.price;
};
