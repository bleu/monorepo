import { dateToEpoch, epochToDate, SECONDS_IN_YEAR } from "@bleu-fi/utils/date";
import { and, eq, gte, lte } from "drizzle-orm";

import { db } from "#/db";
import { pools, poolSnapshots, swapFeeApr } from "#/db/schema";

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
): Promise<[number, number]> {
  const feeApre = await db
    .select()
    .from(swapFeeApr)
    .where(
      and(
        eq(swapFeeApr.poolExternalId, poolId),
        eq(swapFeeApr.timestamp, epochToDate(to)),
      ),
    );

  if (feeApre.length === 0) {
    const poolSnapshotsRange = await db
      .select()
      .from(poolSnapshots)
      .where(
        and(
          eq(poolSnapshots.poolExternalId, poolId),
          gte(poolSnapshots.timestamp, epochToDate(from)),
          lte(poolSnapshots.timestamp, epochToDate(to)),
        ),
      );

    const poolProtrocolSwapFee = await db
      .select({ protocolSwapFeeCache: pools.protocolSwapFeeCache })
      .from(pools)
      .where(eq(pools.externalId, poolId));

    if (poolSnapshotsRange.length === 1) {
      return [0, 0];
    }

    const startData = poolSnapshotsRange[0];
    const endData = poolSnapshotsRange[poolSnapshotsRange.length - 1];

    const feeDiff = Number(endData.swapFees) - Number(startData.swapFees);

    const poolProtocolSwapFee = Number(
      poolProtrocolSwapFee[0].protocolSwapFeeCache ?? 0,
    );

    // reference for 10_000 https://github.com/balancer/balancer-sdk/blob/f4879f06289c6f5f9766ead1835f4f4b096ed7dd/balancer-js/src/modules/pools/apr/apr.ts#L85
    const feeApr =
      10_000 *
      ((feeDiff * (1 - poolProtocolSwapFee)) / Number(endData.liquidity));

    const annualizedFeeApr =
      feeApr *
      (SECONDS_IN_YEAR /
        (dateToEpoch(endData?.timestamp) - dateToEpoch(startData?.timestamp)));

    await db.insert(swapFeeApr).values({
      poolExternalId: poolId,
      timestamp: epochToDate(to),
      value: String(annualizedFeeApr / 100),
      collectedFeesUSD: String(feeDiff),
    });

    return [isNaN(annualizedFeeApr) ? 0 : annualizedFeeApr / 100, feeDiff];
  }

  return [Number(feeApre[0].value), Number(feeApre[0].collectedFeesUSD)];
}
