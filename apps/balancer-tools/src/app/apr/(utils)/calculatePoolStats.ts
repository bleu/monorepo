/* eslint-disable no-console */
import * as Sentry from "@sentry/nextjs";

import * as balEmissions from "#/lib/balancer/emissions";
import { Pool } from "#/lib/balancer/gauges";
import { pools } from "#/lib/gql/server";

import { PoolStatsData, PoolTokens } from "../api/route";
import { getBALPriceByRound, getTokenPriceByDate } from "./getBALPriceByRound";
import { getPoolRelativeWeight } from "./getRelativeWeight";
import { Round } from "./rounds";

export interface calculatePoolData extends Omit<PoolStatsData, "apr"> {
  apr: {
    total: number;
    breakdown: {
      veBAL: number | null;
      swapFee: number;
    };
  };
}

// The enum namings should be human-readable and are based on what Balancer shows on their FE
export enum PoolTypeEnum {
  PHANTOM_STABLE = "ComposableStable",
  WEIGHTED = "Weighted",
  GYROE = "GyroE",
  STABLE = "Stable",
  META_STABLE = "MetaStable",
  UNKNOWN = "FX",
}

const WEEKS_IN_YEAR = 52;
const SECONDS_IN_DAY = 86400;
const SECONDS_IN_YEAR = 365 * SECONDS_IN_DAY;

const memoryCache: { [key: string]: unknown } = {};

const getDataFromCacheOrCompute = async <T>(
  cacheKey: string,
  computeFn: () => Promise<T>,
): Promise<T> => {
  if (memoryCache[cacheKey]) {
    console.debug(`Cache hit for ${cacheKey}`);
    return memoryCache[cacheKey] as T;
  }

  console.debug(`Cache miss for ${cacheKey}`);
  const computedData = await computeFn();
  memoryCache[cacheKey] = computedData;
  return computedData;
};

const fetchPoolTVLFromSnapshotAverageFromRange = async (
  poolId: string,
  network: string,
  from: number,
  to: number,
): Promise<[number, string, { symbol: string; balance: string }[]]> => {
  const res = await pools.gql(network).poolSnapshotInRange({
    poolId,
    from,
    to,
  });

  const avgLiquidity =
    res.poolSnapshots.reduce(
      (acc, snapshot) => acc + parseFloat(snapshot.liquidity),
      0,
    ) / res.poolSnapshots.length;

  if (res.poolSnapshots.length === 0) {
    return [0, "", []];
  }

  return [
    avgLiquidity,
    res.poolSnapshots[0].pool.symbol ?? "",
    res.poolSnapshots[0].pool.tokens ?? [],
  ];
};

async function calculateTokensStats(
  roundId: string,
  poolTokenData: PoolTokens[],
  poolNetwork: string,
  tokenBalance: { symbol: string; balance: string }[],
) {
  const totalBalance = poolTokenData.reduce((acc, token, idx) => {
    const balance = parseFloat(tokenBalance?.[idx]?.balance);
    if (!isNaN(balance)) {
      return acc + balance;
    }
    return acc;
  }, 0);

  const tokenPromises = poolTokenData.map(async (token, idx) => {
    const tokenPrice = await getTokenPriceByDate(
      Round.getRoundByNumber(roundId).endDate,
      token.address,
      parseInt(poolNetwork),
    );
    token.price = tokenPrice;
    token.balance = tokenPrice * parseFloat(tokenBalance?.[idx]?.balance);
    token.percentageValue =
      ((tokenPrice * parseFloat(tokenBalance?.[idx]?.balance)) / totalBalance) *
      100;
    return token;
  });

  return Promise.all(tokenPromises);
}

export async function calculatePoolStats({
  roundId,
  poolId,
}: {
  roundId: string;
  poolId: string;
}): Promise<calculatePoolData> {
  const round = Round.getRoundByNumber(roundId);
  const pool = new Pool(poolId);
  const network = String(pool.network ?? 1);

  const [
    balPriceUSD,
    [tvl, symbol, tokenBalance],
    votingShare,
    [feeAPR, collectedFeesUSD],
  ] = await Promise.all([
    getDataFromCacheOrCompute(`bal_price_${round.value}`, () =>
      getBALPriceByRound(round),
    ),
    getDataFromCacheOrCompute(
      `pool_data_${poolId}_${round.value}_${network}`,
      () =>
        fetchPoolTVLFromSnapshotAverageFromRange(
          poolId,
          network,
          round.startDate.getTime() / 1000,
          round.endDate.getTime() / 1000,
        ),
    ),
    getDataFromCacheOrCompute(
      `pool_weight_${poolId}_${round.value}_${network}`,
      () => getPoolRelativeWeight(poolId, round.endDate.getTime() / 1000),
    ),
    getDataFromCacheOrCompute(
      `pool_fee_apr_${poolId}_${round.value}_${network}`,
      () =>
        getFeeApr(
          poolId,
          network,
          round.startDate.getTime() / 1000,
          round.endDate.getTime() / 1000,
        ),
    ),
  ]);

  const tokens = await calculateTokensStats(
    roundId,
    pool.tokens,
    network,
    tokenBalance,
  );

  const apr = calculateRoundAPR(round, votingShare, tvl, balPriceUSD, feeAPR);

  if (apr.total === null || apr.breakdown.veBAL === null) {
    Sentry.captureMessage("vebalAPR resulted in null", {
      level: "warning",
      extra: { balPriceUSD, tvl, votingShare, roundId, poolId, apr },
    });
  }

  return {
    roundId: Number(roundId),
    poolId,
    apr,
    balPriceUSD,
    tvl,
    votingShare,
    symbol,
    network,
    collectedFeesUSD,
    tokens: tokens as PoolTokens[],
    type: pool.poolType as keyof typeof PoolTypeEnum,
  };
}

function calculateRoundAPR(
  round: Round,
  votingShare: number,
  tvl: number,
  balPriceUSD: number,
  feeAPR: number,
) {
  const emissions = balEmissions.weekly(round.endDate.getTime() / 1000);
  const vebalAPR =
    balPriceUSD && tvl && votingShare
      ? ((WEEKS_IN_YEAR * (emissions * votingShare * balPriceUSD)) / tvl) * 100
      : null;

  return {
    total: (vebalAPR || 0) + feeAPR,
    breakdown: {
      veBAL: vebalAPR,
      swapFee: feeAPR,
    },
  };
}

const getFeeApr = async (
  poolId: string,
  network: string,
  from: number,
  to: number,
): Promise<[number, number]> => {
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
};
