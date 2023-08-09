import { DefiLlamaAPI } from "#/lib/coingecko";

import { Round } from "./rounds";

export const getBALPriceByRound = async (round: Round) => {
  const BAL = "ethereum:0xba100000625a3754423978a60c9317c58a424e3d";
  const relevantDateForPrice = Math.min(Date.now(), round.endDate.getTime());
  const api = new DefiLlamaAPI();

  const response = await api.getHistoricalPrice(
    new Date(relevantDateForPrice),
    [BAL],
  );

  return response.coins[BAL]?.price;
};
