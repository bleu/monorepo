import { desc, eq } from "drizzle-orm";

import { db } from "../../../db";
import { tokenPrices } from "../../../db/schema";
import { addToTable, BALANCER_START_DATE, logIfVerbose } from "../../../index";
import { fetchTokenPrice } from "./fetchTokenPrices";

const BAL_ADDRESS = "0xba100000625a3754423978a60c9317c58a424e3d";
export async function fetchBalPrices() {
  logIfVerbose("Start fetching BAL prices process");

  const latestBalPriceTimestamp = await db
    .select({ timestamp: tokenPrices.timestamp })
    .from(tokenPrices)
    .where(eq(tokenPrices.tokenAddress, BAL_ADDRESS))
    .orderBy(desc(tokenPrices.timestamp))
    .limit(1);

  if (
    latestBalPriceTimestamp[0].timestamp?.toDateString() ===
    new Date().toDateString()
  ) {
    logIfVerbose("BAL prices are up to date");
  }

  const prices = await fetchTokenPrice(
    "ethereum",
    BAL_ADDRESS,
    new Date(latestBalPriceTimestamp[0]?.timestamp || BALANCER_START_DATE),
  );

  return await addToTable(tokenPrices, prices);
}
