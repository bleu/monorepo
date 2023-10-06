import { Address } from "@bleu-balancer-tools/utils";
import * as Sentry from "@sentry/nextjs";

import * as balEmissions from "#/lib/balancer/emissions";
import { pools } from "#/lib/gql/server";

import {
  calculateDaysBetween,
  dateToEpoch,
  generateDateRange,
  getWeeksBetweenDates,
  SECONDS_IN_DAY,
  SECONDS_IN_YEAR,
  WEEKS_IN_YEAR,
} from "../api/(utils)/date";
import { getPoolRelativeWeight } from "./getRelativeWeight";
import { getPoolTokensAprForDateRange } from "./tokenYield";

type PoolSnapshot = {
  timestamp: number;
  liquidity: string;
  swapVolume: string;
  pool: {
    symbol?: string | null;
    tokens?: { symbol: string; balance: string }[] | null;
  };
  swapFees?: string;
};

export async function calculateAPRForDateRange(
  startAtTimestamp: number,
  endAtTimestamp: number,
  tvl: number,
  balPriceUSD: number,
  poolId: string,
  network: string,
) {
  const [votingShare, [feeAPR, collectedFeesUSD], tokensAPR] =
    await Promise.all([
      getPoolRelativeWeight(poolId, endAtTimestamp),
      getFeeAprForDateRange(poolId, network, startAtTimestamp, endAtTimestamp),
      getPoolTokensAprForDateRange(
        network,
        poolId as Address,
        startAtTimestamp,
        endAtTimestamp,
      ),
    ]);

  const weeksApart = getWeeksBetweenDates(startAtTimestamp, endAtTimestamp);
  let emissions;
  if (weeksApart >= 1) {
    const weekArray = Array.from({ length: weeksApart }, (_, index) => {
      const weekStartDate = new Date(startAtTimestamp * 1000);
      weekStartDate.setDate(weekStartDate.getDate() + index * 7);
      const weekEndDate = new Date(weekStartDate);
      weekEndDate.setDate(weekStartDate.getDate() + 6);
      return { weekNumber: index + 1, weekStartDate, weekEndDate };
    });

    // Calculate the total balance emissions and count of weeks
    const { totalBalanceEmissions, weekCount } = weekArray.reduce(
      (acc, week) => {
        const weeklyBalanceEmissions = balEmissions.weekly(
          week.weekStartDate.getTime() / 1000,
        );
        return {
          totalBalanceEmissions:
            acc.totalBalanceEmissions + weeklyBalanceEmissions,
          weekCount: acc.weekCount + 1,
        };
      },
      { totalBalanceEmissions: 0, weekCount: 0 },
    );

    // TODO: #BAL-876 - Fix calculation for big changes on year change
    emissions = totalBalanceEmissions / weekCount;
  } else {
    emissions = balEmissions.weekly(endAtTimestamp);
  }

  const vebalAPR =
    balPriceUSD && tvl && votingShare
      ? ((WEEKS_IN_YEAR * (emissions * votingShare * balPriceUSD)) / tvl) * 100
      : null;

  let tokenAPRTotal = 0;
  if (tokensAPR != null) {
    tokenAPRTotal = tokensAPR.reduce(
      (acc, token) => acc + (token?.yield ?? 0),
      0,
    );
  }

  const totalAprSum = (vebalAPR || 0) + feeAPR + tokenAPRTotal;

  if (totalAprSum === null && tokensAPR != null) {
    Sentry.captureMessage("vebalAPR resulted in null", {
      level: "warning",
      extra: { balPriceUSD, tvl, votingShare, poolId },
    });
  }

  return {
    apr: {
      total: totalAprSum,
      breakdown: {
        veBAL: vebalAPR,
        swapFee: feeAPR,
        tokens: {
          total: tokenAPRTotal,
          breakdown: [
            ...(tokensAPR ||
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
    votingShare,
  };
}

async function getFeeAprForDateRange(
  poolId: string,
  network: string,
  from: number,
  to: number,
): Promise<[number, number]> {
  // Determine if the initial date range is less than 2 days
  const initialRangeInDays = calculateDaysBetween(from, to);
  const extendedFrom = initialRangeInDays < 2 ? from - SECONDS_IN_DAY : from;

  // Fetch snapshots within the (potentially extended) date range
  const res = await pools.gql(network).poolSnapshotInRange({
    poolId,
    timestamp: generateDateRange(extendedFrom, to),
  });

  if (res.poolSnapshots.length === 0) {
    // eslint-disable-next-line no-console
    console.warn(
      `No data found for pool ${poolId}(${network}) in range ${from} - ${to}`,
    );
    return [0, 0];
  }

  const sortedSnapshots: PoolSnapshot[] = res.poolSnapshots.sort(
    (a, b) => a.timestamp - b.timestamp,
  );

  if (
    sortedSnapshots.length <= 1 &&
    sortedSnapshots[sortedSnapshots.length - 1].timestamp <= to
  ) {
    const currentData = await pools.gql(network).Pool({ poolId });
    if (currentData.pool) {
      sortedSnapshots.push({
        timestamp: dateToEpoch(new Date()),
        liquidity: currentData.pool?.totalLiquidity,
        swapVolume: currentData.pool?.totalSwapVolume,
        pool: {
          symbol: currentData.pool?.symbol,
          tokens: currentData.pool?.tokens,
        },
        swapFees: currentData.pool?.totalSwapFee,
      });
      sortedSnapshots.sort((a, b) => a.timestamp - b.timestamp);
    }
  }

  const startRoundData = sortedSnapshots.reduce((acc, snapshot) => {
    if (snapshot.timestamp < acc.timestamp) {
      return snapshot;
    }
    return acc;
  });

  const endRoundData = sortedSnapshots.reduce((acc, snapshot) => {
    if (snapshot.timestamp > acc.timestamp) {
      return snapshot;
    }
    return acc;
  });

  if (!startRoundData?.swapFees || !endRoundData?.swapFees) {
    throw new Error(
      `No data found for feeAPR calculation, poolId: ${poolId}, network: ${network}, from: ${from}, to: ${to}`,
    );
  }

  const feeDiff =
    parseInt(endRoundData?.swapFees) - parseInt(startRoundData?.swapFees);

  const feeApr = 10_000 * (feeDiff / parseInt(endRoundData?.liquidity));
  // reference for 10_000 https://github.com/balancer/balancer-sdk/blob/f4879f06289c6f5f9766ead1835f4f4b096ed7dd/balancer-js/src/modules/pools/apr/apr.ts#L85
  const annualizedFeeApr =
    feeApr *
    (SECONDS_IN_YEAR / (endRoundData?.timestamp - startRoundData?.timestamp));

  return [isNaN(annualizedFeeApr) ? 0 : annualizedFeeApr / 100, feeDiff];
}
