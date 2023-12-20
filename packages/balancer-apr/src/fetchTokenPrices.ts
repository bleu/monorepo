import { epochToDate } from "@bleu-fi/utils/date";
import { and, eq, isNull } from "drizzle-orm";
import pThrottle from "p-throttle";

import { db } from "./db/index";
import { tokenPrices, tokens } from "./db/schema";
import { addToTable, BALANCER_START_DATE, logIfVerbose } from "./index";
import { DefiLlamaAPI } from "./lib/defillama";

const throttle = pThrottle({
  limit: 20,
  interval: 200,
});

export async function fetchTokenPrices() {
  logIfVerbose("Start fetching token prices process");

  const tokensWithPrices = db
    .selectDistinctOn([tokenPrices.tokenAddress, tokenPrices.networkSlug])
    .from(tokenPrices)
    .as("tokensWithPrices");

  const tokenList = await db
    .select({
      networkSlug: tokens.networkSlug,
      address: tokens.address,
    })
    .from(tokens)
    .leftJoin(
      tokensWithPrices,
      and(
        eq(tokensWithPrices.tokenAddress, tokens.address),
        eq(tokensWithPrices.networkSlug, tokens.networkSlug),
      ),
    )
    .where(isNull(tokensWithPrices.tokenAddress));

  const allTokenPrices = await Promise.all(
    tokenList.map(({ networkSlug, address }) =>
      throttle(async () => {
        try {
          const prices = await fetchTokenPrice(
            networkSlug!,
            address!,
            new Date(BALANCER_START_DATE),
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
