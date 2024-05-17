import { and, asc, eq } from "drizzle-orm";
import { addToTable } from "lib/db/addToTable";
import { logIfVerbose } from "lib/logIfVerbose";

import { db } from "../../../db";
import { calendar, tokenPrices } from "../../../db/schema";
import { BALANCER_START_DATE } from "../../../index";
import { fetchTokenPrice } from "./fetchTokenPrices";

const BAL_ADDRESS = "0xba100000625a3754423978a60c9317c58a424e3d";
export async function fetchBalPrices() {
  logIfVerbose("Start fetching BAL prices process");

  const firstTimestampWithoutBalPrice = await db
    .select({ timestamp: calendar.timestamp })
    .from(calendar)
    .leftJoin(
      tokenPrices,
      and(
        eq(calendar.timestamp, tokenPrices.timestamp),
        eq(tokenPrices.tokenAddress, BAL_ADDRESS),
      ),
    )
    .orderBy(asc(calendar.timestamp))
    .limit(1);

  if (
    firstTimestampWithoutBalPrice.length &&
    firstTimestampWithoutBalPrice?.[0]?.timestamp?.toDateString() ===
      new Date().toDateString()
  ) {
    logIfVerbose("BAL prices are up to date");
  }

  const prices = await fetchTokenPrice(
    "ethereum",
    BAL_ADDRESS,
    new Date(firstTimestampWithoutBalPrice[0].timestamp || BALANCER_START_DATE),
  );

  await addToTable(tokenPrices, prices);

  return;
}
