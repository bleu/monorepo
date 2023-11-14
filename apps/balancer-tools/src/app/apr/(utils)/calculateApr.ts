import { epochToDate } from "@bleu-fi/utils/date";
import { sql } from "drizzle-orm";

import { db } from "#/db";

export async function calculateAPRForDateRange(
  startAtTimestamp: number,
  endAtTimestamp: number,
  poolId: string,
) {
  // const [votingShare, [feeAPR, collectedFeesUSD], tokensAPR, rewardsAPR] =
  const [[feeAPR, collectedFeesUSD]] = await Promise.all([
    // getPoolRelativeWeight(poolId, endAtTimestamp),
    getFeeAprForDateRange(poolId, startAtTimestamp, endAtTimestamp),
    // getPoolTokensAprForDateRange(
    //   network,
    //   poolId as Address,
    //   startAtTimestamp,
    //   endAtTimestamp
    // ),
    // getRewardsAprForDateRange(
    //   poolId,
    //   network,
    //   startAtTimestamp,
    //   endAtTimestamp
    // ),
  ]);

  // const weeksApart = getWeeksBetweenDates(startAtTimestamp, endAtTimestamp);
  // let emissions;
  // if (weeksApart >= 1) {
  //   const weekArray = Array.from({ length: weeksApart }, (_, index) => {
  //     const weekStartDate = new Date(startAtTimestamp * 1000);
  //     weekStartDate.setDate(weekStartDate.getDate() + index * 7);
  //     const weekEndDate = new Date(weekStartDate);
  //     weekEndDate.setDate(weekStartDate.getDate() + 6);
  //     return { weekNumber: index + 1, weekStartDate, weekEndDate };
  //   });

  //   // Calculate the total balance emissions and count of weeks
  //   const { totalBalanceEmissions, weekCount } = weekArray.reduce(
  //     (acc, week) => {
  //       const weeklyBalanceEmissions = balEmissions.weekly(
  //         week.weekStartDate.getTime() / 1000
  //       );
  //       return {
  //         totalBalanceEmissions:
  //           acc.totalBalanceEmissions + weeklyBalanceEmissions,
  //         weekCount: acc.weekCount + 1,
  //       };
  //     },
  //     { totalBalanceEmissions: 0, weekCount: 0 }
  //   );

  //   // TODO: #BAL-876 - Fix calculation for big changes on year change
  //   emissions = totalBalanceEmissions / weekCount;
  // } else {
  //   emissions = balEmissions.weekly(endAtTimestamp);
  // }

  // const vebalAPR =
  //   balPriceUSD && tvl && votingShare
  //     ? ((WEEKS_IN_YEAR * (emissions * votingShare * balPriceUSD)) / tvl) * 100
  //     : null;

  // let tokenAPRTotal = 0;
  // if (tokensAPR != null) {
  //   tokenAPRTotal = tokensAPR.reduce(
  //     (acc, token) => acc + (token?.yield ?? 0),
  //     0
  //   );
  // }

  // const totalAprSum = (vebalAPR || 0) + feeAPR + tokenAPRTotal;

  // if (totalAprSum === null && tokensAPR != null) {
  //   Sentry.captureMessage("vebalAPR resulted in null", {
  //     level: "warning",
  //     extra: { balPriceUSD, tvl, votingShare, poolId },
  //   });
  // }

  // const rewardsAPRTotal = rewardsAPR.reduce(
  //   (acc, reward) => acc + (reward.apr ?? 0),
  //   0
  // );

  return {
    apr: {
      total: feeAPR,
      breakdown: {
        veBAL: 0,
        swapFee: feeAPR,
        tokens: {
          total: 0,
          breakdown: [
            ...([] ||
              (
                [{}] as { address: string; symbol: string; yield: number }[]
              ).map((token) => ({
                address: token.address,
                symbol: token.symbol,
                yield: token.yield,
              }))),
          ],
        },
        rewards: {
          total: 0,
          breakdown: [
            ...([] ||
              (
                [{}] as { address: string; symbol: string; yield: number }[]
              ).map((token) => ({
                address: token.address,
                symbol: token.symbol,
                yield: token.yield,
              }))),
          ],
        },
      },
    },
    collectedFeesUSD,
    votingShare: 0,
  };
}

export async function getFeeAprForDateRange(
  poolId: string,
  from: number,
  to: number,
) {
  const result = await db.execute(sql`
  WITH SnapshotDiffs AS (
    SELECT
      FIRST_VALUE(ps.swap_fees) OVER w AS start_swap_fees,
      LAST_VALUE(ps.swap_fees) OVER w AS end_swap_fees,
      LAST_VALUE(ps.liquidity) OVER w AS end_liquidity,
      LAST_VALUE(p.protocol_swap_fee_cache) OVER w AS protocol_swap_fee_cache,
      MIN(ps.timestamp) OVER w AS start_timestamp,
      MAX(ps.timestamp) OVER w AS end_timestamp
    FROM
      pool_snapshots ps
      JOIN pools p ON p.external_id = ps.pool_external_id
    WHERE
      ps.pool_external_id = '${sql.raw(poolId)}'
      AND ps.timestamp BETWEEN '${sql.raw(
        epochToDate(from).toISOString(),
      )}' AND '${sql.raw(epochToDate(to).toISOString())}'
    WINDOW w AS (ORDER BY ps.timestamp RANGE BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)
  ), Calculations AS (
    SELECT
      (CAST(end_swap_fees AS NUMERIC) - CAST(start_swap_fees AS NUMERIC)) AS fee_diff,
      CAST(end_liquidity AS NUMERIC) AS liquidity,
      COALESCE(CAST(protocol_swap_fee_cache AS NUMERIC), 0.5) AS protocol_swap_fee,
      EXTRACT(EPOCH FROM end_timestamp) - EXTRACT(EPOCH FROM start_timestamp) AS time_diff_secs
    FROM
      SnapshotDiffs
  )
  SELECT
    fee_diff,
    CASE
      WHEN time_diff_secs = 0 THEN 0
      ELSE ((fee_diff * (1 - protocol_swap_fee)) / liquidity) * 365 *100
    END AS annualized_fee_apr
  FROM
    Calculations
  LIMIT 1;`);
  const { fee_diff: feeDiff, annualized_fee_apr: apr } = result[0];

  return [Number(apr), Number(feeDiff)];
}
