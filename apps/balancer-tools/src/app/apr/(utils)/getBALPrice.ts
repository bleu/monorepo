import { DefiLlamaAPI } from "#/lib/coingecko";

export const getBALPrice = async (timestamp: number) => {
  const BAL = "ethereum:0xba100000625a3754423978a60c9317c58a424e3d";
  const api = new DefiLlamaAPI();
  const response = await api.getHistoricalPrice(timestamp, [BAL]);
  return response.coins[BAL].price;
};
