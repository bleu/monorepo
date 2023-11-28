import { epochToDate } from "@bleu-fi/utils/date";
import { and, eq } from "drizzle-orm";

import { db } from "@bleu-fi/balancer-apr/src/db";
import { swapFeeApr, vebalApr } from "@bleu-fi/balancer-apr/src/db/schema";

export async function calculateAPRForDateRange(
  endAtTimestamp: number,
  poolId: string,
) {
  // const [votingShare, [feeAPR, collectedFeesUSD], tokensAPR, rewardsAPR] =
  const [vebalAPR, [feeAPR, collectedFeesUSD]] = await Promise.all([
    // getPoolRelativeWeight(poolId, endAtTimestamp),
    getVebalAprForDate(poolId, endAtTimestamp),
    getFeeAprForDate(poolId, endAtTimestamp),
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
      total: vebalAPR + feeAPR,
      breakdown: {
        veBAL: vebalAPR,
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

export async function getFeeAprForDate(poolId: string, date: number) {
  const result = await db
    .select()
    .from(swapFeeApr)
    .where(
      and(
        eq(swapFeeApr.poolExternalId, poolId),
        eq(swapFeeApr.timestamp, epochToDate(date)),
      ),
    );
  const { value: apr, collectedFeesUSD } = result[0];

  return [Number(apr), Number(collectedFeesUSD)];
}

export async function getVebalAprForDate(poolId: string, date: number) {
  const result = await db
    .select()
    .from(vebalApr)
    .where(
      and(
        eq(vebalApr.poolExternalId, poolId),
        eq(vebalApr.timestamp, epochToDate(date)),
      ),
    );
  const { value: apr } = result[0];

  return Number(apr);
}
