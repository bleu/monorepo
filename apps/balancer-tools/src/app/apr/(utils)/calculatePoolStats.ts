/* eslint-disable no-console */
import * as Sentry from "@sentry/nextjs";

import * as balEmissions from "#/lib/balancer/emissions";
import { Pool } from "#/lib/balancer/gauges";
import { getDataFromCacheOrCompute } from "#/lib/cache";
import { pools } from "#/lib/gql/server";

import { PoolStatsData, PoolTokens, tokenAPR } from "../api/route";
import { getBALPriceByRound, getTokenPriceByDate } from "./getBALPriceByRound";
import { getPoolRelativeWeight } from "./getRelativeWeight";
import { Round } from "./rounds";
import { getTokenAprByPoolId } from "./tokenYield";

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

const fetchPoolTVLFromSnapshotAverageFromRange = async (
  poolId: string,
  network: string,
  from: number,
  to: number,
): Promise<[number, number, string, { symbol: string; balance: string }[]]> => {
  const res = await pools.gql(network).poolSnapshotInRange({
    poolId,
    from,
    to,
  });

  if (res.poolSnapshots.length === 0) {
    return [0, 0, "", []];
  }

  const avgLiquidity =
    res.poolSnapshots.reduce(
      (acc, snapshot) => acc + parseFloat(snapshot.liquidity),
      0,
    ) / res.poolSnapshots.length;

  const avgVolume =
    res.poolSnapshots.length == 1
      ? res.poolSnapshots[0].swapVolume
      : res.poolSnapshots
          .map((item, index, array) =>
            index > 0
              ? Math.abs(
                  parseFloat(item.swapVolume) -
                    parseFloat(array[index - 1].swapVolume),
                )
              : 0,
          )
          .reduce((sum, value) => sum + value, 0) /
        (res.poolSnapshots.length - 1);

  return [
    avgLiquidity,
    avgVolume,
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
    [tvl, volume, symbol, tokenBalance],
    votingShare,
    [feeAPR, collectedFeesUSD],
    tokensAPR,
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
    //TODO: on #BAL-795 use another strategy for cache using the poolId
    getDataFromCacheOrCompute("yield APR", () => getTokenAprByPoolId(poolId)),
  ]);

  const tokens = await calculateTokensStats(
    roundId,
    pool.tokens,
    network,
    tokenBalance,
  );

  const apr = calculateRoundAPR(
    round,
    votingShare,
    tvl,
    balPriceUSD,
    feeAPR,
    tokensAPR,
  );

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
    volume,
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
  tokensAPR: tokenAPR[],
) {
  const emissions = balEmissions.weekly(round.endDate.getTime() / 1000);
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
