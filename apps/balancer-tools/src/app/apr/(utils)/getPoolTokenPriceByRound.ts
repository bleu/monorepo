import { networkFor } from "@bleu-balancer-tools/utils";

import { DefiLlamaAPI } from "#/lib/coingecko";

import { Round } from "./rounds";
import { Pool } from "#/lib/balancer/gauges";

export const getPoolTokenPriceByRound = async (
  poolId: string,
  round: Round,
) => {
  const pool = new Pool(poolId);
  const coinsAdd = pool.tokens
    .map((token) => networkFor(pool.network) + ":" + token.address)
    .reverse();
  const relevantDateForPrice = Math.min(Date.now(), round.endDate.getTime());
  const api = new DefiLlamaAPI();

  const response = await api.getHistoricalPrice(
    new Date(relevantDateForPrice),
    coinsAdd,
  );

  return Object.values(response.coins).map((coin) => coin.price);
};
