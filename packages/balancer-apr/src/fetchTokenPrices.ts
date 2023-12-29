import { epochToDate } from "@bleu-fi/utils/date";
import { and, eq, gte, isNull, min, sql } from "drizzle-orm";
import pThrottle from "p-throttle";

import { db } from "./db/index";
import { calendar, pools, poolTokens, tokenPrices, tokens } from "./db/schema";
import { addToTable, logIfVerbose } from "./index";
import { DefiLlamaAPI } from "./lib/defillama";

const throttle = pThrottle({
  limit: 4,
  interval: 1000,
});
export async function fetchTokenPrices() {
  logIfVerbose("Start fetching token prices process");

  const tokenList = await db
    .selectDistinct({
      networkSlug: tokens.networkSlug,
      address: tokens.address,
      firstPoolCreatedAt: min(pools.externalCreatedAt),
    })
    .from(tokens)
    .fullJoin(calendar, sql`true`)
    .leftJoin(
      poolTokens,
      and(
        eq(poolTokens.tokenAddress, tokens.address),
        eq(poolTokens.networkSlug, tokens.networkSlug),
      ),
    )
    .leftJoin(
      pools,
      and(
        eq(pools.externalId, poolTokens.poolExternalId),
        eq(pools.networkSlug, tokens.networkSlug),
      ),
    )
    .leftJoin(
      tokenPrices,
      and(
        eq(tokenPrices.networkSlug, tokens.networkSlug),
        eq(tokenPrices.tokenAddress, tokens.address),
        eq(tokenPrices.timestamp, calendar.timestamp),
      ),
    )
    .where(
      and(
        isNull(tokenPrices.tokenAddress),
        gte(calendar.timestamp, pools.externalCreatedAt),
      ),
    )
    .groupBy(tokens.address, tokens.networkSlug);

  const allTokenPrices = await Promise.all(
    tokenList.map(({ networkSlug, address, firstPoolCreatedAt }) =>
      throttle(async () => {
        try {
          const prices = await fetchTokenPrice(
            networkSlug!,
            address!,
            firstPoolCreatedAt!,
          );
          return prices;
        } catch (error) {
          logIfVerbose(
            // @ts-expect-error
            `Failed to fetch prices for ${address} on ${networkSlug}: ${error.message}`,
          );
        }
      })(),
    ),
  );

  await addToTable(tokenPrices, allTokenPrices.filter(Boolean).flat());

  logIfVerbose("Fetching token prices process completed");
  return;
}

function getNetworkSlug(network: string) {
  const networkMapping = {
    avalanche: "avax",
    avax: "avalanche",
  };
  // @ts-expect-error
  return networkMapping[network] ?? network;
}

function adjustTimestamp(entryTimestamp: number) {
  let timestamp = new Date(epochToDate(entryTimestamp));
  if (timestamp.getUTCHours() === 23 && timestamp.getUTCMinutes() >= 58) {
    timestamp = new Date(timestamp.setUTCDate(timestamp.getUTCDate() + 1));
  }
  timestamp.setUTCHours(0, 0, 0, 0);
  return timestamp;
}

export async function fetchTokenPrice(
  network: string,
  tokenAddress: string,
  start: Date,
) {
  let prices;
  try {
    logIfVerbose(`Fetching price for ${network}:${tokenAddress}`);
    prices = await DefiLlamaAPI.getHistoricalPrice(
      start,
      `${getNetworkSlug(network)}:${tokenAddress}`,
    );
  } catch (error) {
    logIfVerbose(
      // @ts-expect-error
      `Failed to fetch prices for ${tokenAddress} on ${network}: ${error.message}`,
    );
    return [];
  }

  if (!prices || !prices.coins) {
    throw new Error("No price data available");
  }

  const pricesArray = Object.values(prices.coins)[0]?.prices;

  if (!pricesArray || !pricesArray?.length) {
    throw new Error("No price data available");
  }

  const [networkSlug, address] = Object.keys(prices.coins)[0].split(":");

  logIfVerbose(`Fetched price for ${network}:${tokenAddress}`);
  return pricesArray.map((entry) => ({
    tokenAddress: address,
    networkSlug: getNetworkSlug(networkSlug),
    priceUSD: entry.price,
    timestamp: adjustTimestamp(entry.timestamp),
  }));
}
