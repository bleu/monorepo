/* eslint-disable no-console */
import { Address } from "@bleu-balancer-tools/utils";
import * as Sentry from "@sentry/nextjs";

import * as balEmissions from "#/lib/balancer/emissions";
import { Pool } from "#/lib/balancer/gauges";
import { withCache } from "#/lib/cache";
import { pools } from "#/lib/gql/server";

import { getWeeksBetweenDates } from "../api/(utils)/date";
import { PoolStatsData, PoolTokens, tokenAPR } from "../api/route";
import {
  getBALPriceForDateRange,
  getTokenPriceByDate,
} from "./getBALPriceForDateRange";
import { getPoolRelativeWeight } from "./getRelativeWeight";
import { getPoolTokensAprForDate as getPoolTokensAprForDateRange } from "./tokenYield";
import { PoolTypeEnum } from "./types";

export interface calculatePoolData extends Omit<PoolStatsData, "apr"> {
  apr: {
    total: number;
    breakdown: {
      veBAL: number | null;
      swapFee: number;
      tokens: {
        total: number;
        breakdown: tokenAPR[];
      };
    };
  };
}

const WEEKS_IN_YEAR = 52;
const SECONDS_IN_DAY = 86400;
const SECONDS_IN_YEAR = 365 * SECONDS_IN_DAY;

const fetchPoolAveragesForDateRange = withCache(
  async function fetchPoolAveragesInRangeFn(
    poolId: string,
    network: string,
    from: number,
    to: number,
  ): Promise<[number, number, string, { symbol: string; balance: string }[]]> {
    const res = await pools.gql(network).poolSnapshotInRange({
      poolId,
      from,
      to,
    });

    res.poolSnapshots = res.poolSnapshots.sort(
      (a, b) => a.timestamp - b.timestamp,
    );

    if (res.poolSnapshots.length === 0) {
      return [0, 0, "", []];
    }
    const avgLiquidity =
      res.poolSnapshots.reduce(
        (acc, snapshot) => acc + parseFloat(snapshot.liquidity),
        0,
      ) / res.poolSnapshots.length;

    const avgVolume =
      res.poolSnapshots.reduce((sum, current, currentIndex) => {
        if (currentIndex === 0) return 0;

        const currentDayVolume = current.swapVolume;
        const previousDayVolume =
          res.poolSnapshots[currentIndex - 1].swapVolume;

        return sum + (currentDayVolume - previousDayVolume);
      }, 0) /
      (res.poolSnapshots.length - 1);

    return [
      avgLiquidity,
      avgVolume,
      res.poolSnapshots[0].pool.symbol ?? "",
      res.poolSnapshots[0].pool.tokens ?? [],
    ];
  },
);

async function calculateTokensStats(
  endAtTimestamp: number,
  poolTokenData: PoolTokens[],
  poolNetwork: string,
  tokenBalance: { symbol: string; balance: string }[],
) {
  const tokensPrices = await Promise.all(
    poolTokenData.map(async (token) => {
      const tokenPrice = await getTokenPriceByDate(
        endAtTimestamp * 1000,
        token.address,
        parseInt(poolNetwork),
      );
      if (tokenPrice === undefined) {
        console.warn(
          `Failed fetching price for ${token.symbol}, with address ${token.address}`,
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
  const [
    balPriceUSD,
    [tvl, volume, symbol, tokenBalance],
    votingShare,
    [feeAPR, collectedFeesUSD],
    tokensAPR,
  ] = await Promise.all([
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

    emissions = totalBalanceEmissions / weekCount;
  } else {
    emissions = balEmissions.weekly(endAtTimestamp);
  }

  const vebalAPR =
    balPriceUSD && tvl && votingShare
      ? ((WEEKS_IN_YEAR * (emissions * votingShare * balPriceUSD)) / tvl) * 100
      : null;

  return {
    //TODO: on #BAL-795 add tokenAPR to the total
    total: (vebalAPR || 0) + feeAPR,
    breakdown: {
      veBAL: vebalAPR,
      swapFee: feeAPR,
      tokens: {
        total: tokensAPR.reduce((acc, token) => acc + token.yield, 0),
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

const getFeeAprForDateRange = withCache(async function getFeeAprFn(
  poolId: string,
  network: string,
  from: number,
  to: number,
): Promise<[number, number]> {
  const lastdayBeforeStartRound = from - SECONDS_IN_DAY;
  const lastdayOfRound = to;

  const res = await pools.gql(network).poolSnapshotInRange({
    poolId,
    from: lastdayBeforeStartRound,
    to: lastdayOfRound,
  });

  const startRoundData = res.poolSnapshots[res.poolSnapshots.length - 1];

  const endRoundData = res.poolSnapshots[0];

  if (!startRoundData || !endRoundData) {
    return [0, 0];
  }

  const feeDiff = endRoundData?.swapFees - startRoundData?.swapFees;

  const feeApr = 10_000 * (feeDiff / endRoundData?.liquidity);
  // reference for 10_000 https://github.com/balancer/balancer-sdk/blob/f4879f06289c6f5f9766ead1835f4f4b096ed7dd/balancer-js/src/modules/pools/apr/apr.ts#L85
  const annualizedFeeApr =
    feeApr *
    (SECONDS_IN_YEAR / (endRoundData?.timestamp - startRoundData?.timestamp));

  return [isNaN(annualizedFeeApr) ? 0 : annualizedFeeApr / 100, feeDiff];
});
