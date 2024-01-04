import { dateToEpoch, epochToDate } from "@bleu-fi/utils/date";
import { sql } from "drizzle-orm";
import pThrottle from "p-throttle";

import { db } from "./db/index";
import { tokenPrices } from "./db/schema";
import { addToTable, logIfVerbose } from "./index";
import { DefiLlamaAPI } from "./lib/defillama";

const throttle = pThrottle({
  limit: 6,
  interval: 1000,
});
export async function fetchTokenPrices() {
  logIfVerbose("Start fetching token prices process");

  const tokenList = await db.execute<{
    network_slug: string;
    address: string;
    timestamp: Date;
  }>(
    sql.raw(`
    SELECT
    *
  FROM (
    SELECT
      t.address,
      t.network_slug,
      CASE WHEN min(ps.timestamp) < min(tp.timestamp) THEN
        min(ps.timestamp)
      ELSE
        least(max(tp. "timestamp"), now()::date)
      END AS timestamp
    FROM
      tokens t
      JOIN (
        SELECT
          min(ps.timestamp)
          timestamp,
          pt.token_address,
          pt.network_slug
        FROM
          pool_snapshots ps
          JOIN pool_tokens pt ON pt.pool_external_id = ps.pool_external_id
            AND ps.network_slug = pt.network_slug
          GROUP BY
            pt.token_address,
            pt.network_slug) ps ON t.network_slug = ps.network_slug
          AND t.address = ps.token_address
      LEFT JOIN (
        SELECT
          min(tp. "timestamp")
          timestamp,
          token_address,
          network_slug
        FROM
          token_prices tp
        GROUP BY
          network_slug,
          token_address) tp ON tp.token_address = t.address
        AND tp.network_slug = t.network_slug
      GROUP BY
        t.address,
        t.network_slug) sq
  WHERE
    sq.timestamp < now() - interval '1 day';
`),
  );

  const allTokenPrices = await Promise.all(
    tokenList.map(({ network_slug: networkSlug, address, timestamp }, idx) => {
      logIfVerbose(
        `${networkSlug}:${address}:${dateToEpoch(timestamp)} Fetching prices: ${
          idx + 1
        }/${tokenList.length}`,
      );
      return throttle(async () => {
        try {
          const prices = await fetchTokenPrice(
            networkSlug,
            address!,
            timestamp!,
          );
          return prices;
        } catch (error) {
          logIfVerbose(
            `${networkSlug}:${address}:${dateToEpoch(
              timestamp,
              // @ts-expect-error
            )} Failed fetching price: ${error.message}`,
          );
        }
      })();
    }),
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
  if (!tokenAddress || !network || !start) return [];

  let prices;
  try {
    logIfVerbose(
      `${network}:${tokenAddress}:${dateToEpoch(start)} Fetching price`,
    );
    prices = await DefiLlamaAPI.getHistoricalPrice(
      start,
      `${getNetworkSlug(network)}:${tokenAddress}`,
    );
  } catch (error) {
    // @ts-expect-error
    if (error?.message?.includes?.("No price data available")) return [];

    logIfVerbose(
      `${network}:${tokenAddress}:${dateToEpoch(
        start,
        // @ts-expect-error
      )} Failed fetching price: ${error.message}`,
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

  return pricesArray.map((entry) => ({
    tokenAddress: address,
    networkSlug: getNetworkSlug(networkSlug),
    priceUSD: entry.price,
    timestamp: adjustTimestamp(entry.timestamp),
  }));
}
