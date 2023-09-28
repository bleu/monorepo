/* eslint-disable no-console */
import { Address } from "@bleu-balancer-tools/utils";
import * as Sentry from "@sentry/nextjs";

import * as balEmissions from "#/lib/balancer/emissions";
import { Pool } from "#/lib/balancer/gauges";
import { pools } from "#/lib/gql/server";

import {
  calculateDaysBetween,
  dateToEpoch,
  getWeeksBetweenDates,
} from "../api/(utils)/date";
import { PoolStatsData, PoolTokens, tokenAPR } from "../api/route";
import {
  getBALPriceForDateRange,
  getTokenPriceByDate,
} from "./getBALPriceForDateRange";
import { getPoolRelativeWeight } from "./getRelativeWeight";
import { getPoolTokensAprForDateRange } from "./tokenYield";
import { PoolTypeEnum } from "./types";

export interface calculatePoolData extends Omit<PoolStatsData, "apr"> {
  apr: {
    total: number;
    breakdown: {
      veBAL: number | null;
      swapFee: number;
      tokens?: {
        total: number;
        breakdown: tokenAPR[];
      };
    };
  };
}

const WEEKS_IN_YEAR = 52;
const SECONDS_IN_DAY = 86400;
const SECONDS_IN_YEAR = 365 * SECONDS_IN_DAY;

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

async function fetchPoolAveragesForDateRange(
  poolId: string,
  network: string,
  from: number,
  to: number,
): Promise<[number, number, string, { symbol: string; balance: string }[]]> {
  // Determine if the initial date range is less than 2 days
  const initialRangeInDays = calculateDaysBetween(from, to);
  const extendedFrom = initialRangeInDays < 2 ? from - SECONDS_IN_DAY : from;

  // Fetch snapshots within the (potentially extended) date range
  const res = await pools.gql(network).poolSnapshotInRange({
    poolId,
    from: extendedFrom,
    to,
  });

  if (res.poolSnapshots.length === 0) {
    console.warn(
      `No data found for pool ${poolId}(${network}) in range ${from} - ${to}`,
    );
    return [0, 0, "", []];
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
      });
      sortedSnapshots.sort((a, b) => a.timestamp - b.timestamp);
    }
  }

  // If less than two snapshots, return empty data
  if (sortedSnapshots.length < 2) {
    console.warn(
      `Less than two snapshots for pool ${poolId}(${network}) in range ${from} - ${to}`,
    );

    return [0, 0, "", []];
  }

  // Compute averages
  const avgLiquidity =
    sortedSnapshots.reduce(
      (acc, snapshot) => acc + parseFloat(snapshot.liquidity),
      0,
    ) / sortedSnapshots.length;

  const avgVolume =
    sortedSnapshots.reduce((sum, current, index) => {
      if (index === 0) return 0;
      return (
        sum +
        (parseFloat(current.swapVolume) -
          parseFloat(sortedSnapshots[index - 1].swapVolume))
      );
    }, 0) /
    (sortedSnapshots.length - 1);

  return [
    avgLiquidity,
    avgVolume,
    sortedSnapshots[0].pool.symbol ?? "",
    sortedSnapshots[0].pool.tokens ?? [],
  ];
}

async function calculateTokensStats(
  endAtTimestamp: number,
  poolTokenData: PoolTokens[],
  poolNetwork: string,
  tokenBalance: { symbol: string; balance: string }[],
) {
  const tokensPrices = await Promise.all(
    poolTokenData.map(async (token) => {
      const tokenPrice = await getTokenPriceByDate(
        endAtTimestamp,
        token.address,
        parseInt(poolNetwork),
      );
      if (tokenPrice === undefined) {
        console.warn(
          `Failed fetching price for ${token.symbol}(network:${poolNetwork},addr:${token.address}) at ${endAtTimestamp}`,
        );
      }
      //TODO: some work arround to get token price
      return tokenPrice === undefined ? 1 : tokenPrice;
    }),
  );

  const totalValue = poolTokenData.reduce((acc, token, idx) => {
    const balance = parseFloat(tokenBalance?.[idx]?.balance);
    if (!isNaN(balance)) {
      return acc + tokensPrices[idx] * balance;
    }
    return acc;
  }, 0);

  const tokenPromises = poolTokenData.map(async (token, idx) => {
    token.price = tokensPrices[idx];
    token.balance = parseFloat(tokenBalance?.[idx]?.balance);
    token.percentageValue =
      ((tokensPrices[idx] * parseFloat(tokenBalance?.[idx]?.balance)) /
        totalValue) *
      100;
    return token;
  });

  return Promise.all(tokenPromises);
}

// TODO: #BAL-873 - Refactor this logic
export async function calculatePoolStats({
  startAtTimestamp,
  endAtTimestamp,
  poolId,
}: {
  startAtTimestamp: number;
  endAtTimestamp: number;
  poolId: string;
}): Promise<calculatePoolData> {
  const pool = new Pool(poolId);
  const network = String(pool.network ?? 1);
  const results = await Promise.allSettled([
    // TODO: what if the pool doesn't exist during that range?
    pools.gql(network).Pool({ poolId }),
    getBALPriceForDateRange(startAtTimestamp, endAtTimestamp),
    fetchPoolAveragesForDateRange(
      poolId,
      network,
      startAtTimestamp,
      endAtTimestamp,
    ),
    getPoolRelativeWeight(poolId, endAtTimestamp),
    getFeeAprForDateRange(poolId, network, startAtTimestamp, endAtTimestamp),
    //TODO: on #BAL-795 use another strategy for cache using the poolId
    getPoolTokensAprForDateRange(
      network,
      poolId as Address,
      startAtTimestamp,
      endAtTimestamp,
    ),
  ]);

  if (results[0].status === "fulfilled" && !results[0].value?.pool) {
    throw new Error(
      `No pool with ID ${poolId}(${network}) in range ${startAtTimestamp} - ${endAtTimestamp}`,
    );
  }

  if (results.some((p) => p.status === "rejected")) {
    const errors = results
      .filter((p) => p.status === "rejected")
      // @ts-ignore
      .map((p) => p.reason);
    throw new Error(
      `Error fetching data for pool ${poolId}(${network}) in range ${startAtTimestamp} - ${endAtTimestamp}: ${errors}, function ${errors[0]?.stack}}`,
    );
  }

  const [
    _,
    balPriceUSD,
    [tvl, volume, symbol, tokenBalance],
    votingShare,
    [feeAPR, collectedFeesUSD],
    tokensAPR,
    // @ts-ignore
  ] = results.filter((p) => p.status === "fulfilled").map((p) => p.value);

  const tokens = await calculateTokensStats(
    endAtTimestamp,
    pool.tokens,
    network,
    tokenBalance,
  );

  const apr = calculateAPRForDateRange(
    startAtTimestamp,
    endAtTimestamp,
    votingShare,
    tvl,
    balPriceUSD,
    feeAPR,
    tokensAPR,
  );

  if (apr.total === null || apr.breakdown.veBAL === null) {
    Sentry.captureMessage("vebalAPR resulted in null", {
      level: "warning",
      extra: { balPriceUSD, tvl, votingShare, poolId, apr },
    });
  }

  return {
    poolId,
    apr,
    balPriceUSD,
    tvl,
    volume,
    votingShare: votingShare,
    symbol,
    network,
    collectedFeesUSD,
    tokens: tokens as PoolTokens[],
    type: pool.poolType as keyof typeof PoolTypeEnum,
  };
}

function calculateAPRForDateRange(
  startAtTimestamp: number,
  endAtTimestamp: number,
  votingShare: number,
  tvl: number,
  balPriceUSD: number,
  feeAPR: number,
  tokensAPR: tokenAPR[],
) {
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
          dateToEpoch(week.weekStartDate),
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

  const tokenAPRTotal = tokensAPR.reduce(
    (acc, token) => acc + (token?.yield ?? 0),
    0,
  );

  return {
    total: (vebalAPR || 0) + feeAPR + tokenAPRTotal,
    breakdown: {
      veBAL: vebalAPR,
      swapFee: feeAPR,
      tokens: {
        total: tokenAPRTotal,
        breakdown: [
          ...tokensAPR.map((token) => ({
            address: token.address,
            symbol: token.symbol,
            yield: token.yield,
          })),
        ],
      },
    },
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
    from: extendedFrom,
    to,
  });

  if (res.poolSnapshots.length === 0) {
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
