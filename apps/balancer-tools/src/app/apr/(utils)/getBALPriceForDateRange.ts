import { db } from "@bleu/balancer-apr/src/db";
import { tokenPrices } from "@bleu/balancer-apr/src/db/schema";
import { formatNumber } from "@bleu/utils/formatNumber";
import { and, between, eq, sql } from "drizzle-orm";

const BAL_TOKEN_ADDRESS = "0xba100000625a3754423978a60c9317c58a424e3d";

/**
 * Calculates the average of an array of numbers.
 */
export async function getBALPriceForDateRange(startAt: Date, endAt: Date) {
  const result = await db
    .select({
      averagePriceUSD: sql<number>`cast(avg(${tokenPrices.priceUSD}) as decimal)`,
    })
    .from(tokenPrices)
    .where(
      and(
        eq(tokenPrices.tokenAddress, BAL_TOKEN_ADDRESS),
        between(tokenPrices.timestamp, startAt, endAt)
      )
    )
    .groupBy(tokenPrices.tokenAddress)
    .execute();

  //TODO when there is no price on db
  const { averagePriceUSD } = result[0];
  return `$ ${formatNumber(averagePriceUSD ?? "", 2)}`;
}
