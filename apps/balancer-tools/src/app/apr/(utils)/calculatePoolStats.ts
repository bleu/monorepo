/* eslint-disable no-console */
import * as balEmissions from "#/lib/balancer/emissions";
import { Pool } from "#/lib/balancer/gauges";
import { pools } from "#/lib/gql/server";

import { PoolStatsData } from "../api/route";
import { getBALPriceByRound } from "./getBALPriceByRound";
import getBlockNumberByTimestamp from "./getBlockNumberForTime";
import getTokenAmountByPoolTimestamp from "./getCoinAmountForPool";
import { getPoolTokenPriceByRound } from "./getPoolTokenPriceByRound";
import { getPoolRelativeWeight } from "./getRelativeWeight";
import { Round } from "./rounds";

const WEEKS_IN_YEAR = 52;

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

const getTVLData = async (poolId: string, round: Round) => {
  const tokenAmount = await getTokenAmountByPoolTimestamp(
    poolId,
    round.endDate.getTime() / 1000,
  );

  const coinPrice = await getPoolTokenPriceByRound(poolId, round);

  return tokenAmount.reduce(
    (sum, value1, index) =>
      sum + parseFloat(value1) * parseFloat(coinPrice[index]),
    0,
  );
};

const fetchPoolData = async (
  poolId: string,
  network: string,
  blockNumber: number | null,
): Promise<[number, string]> => {
  const gqlFn = blockNumber
    ? pools.gql(network).PoolWhereBlockNumber({ blockNumber, poolId })
    : pools.gql(network).Pool({ poolId });

  const res = await gqlFn;
  return [parseFloat(res.pool?.totalLiquidity) ?? 0, res.pool?.symbol ?? ""];
};

export async function calculatePoolStats({
  roundId,
  poolId,
}: {
  roundId: string;
  poolId: string;
}): Promise<PoolStatsData> {
  const round = Round.getRoundByNumber(roundId);
  const pool = new Pool(poolId);
  const symbol = pool.symbol;
  const network = String(pool.network ?? 1);

  const endRoundBlockNumber = await getDataFromCacheOrCompute(
    `block_from_${round.endDate}`,
    () => getBlockNumberByTimestamp(pool.network ?? 1, round.endDate),
  );

  const [balPriceUSD, tvl, votingShare] = await Promise.all([
    getDataFromCacheOrCompute(`bal_price_${round.value}`, () =>
      getBALPriceByRound(round),
    ),
    getDataFromCacheOrCompute(
      `pool_tvl_${poolId}_${round.value}_${network}`,
      () => getTVLData(poolId, round),
    ),
    getDataFromCacheOrCompute(
      `pool_weight_${poolId}_${round.value}_${network}`,
      () =>
        getPoolRelativeWeight(
          poolId,
          round.endDate.getTime() / 1000,
          round.activeRound ? undefined : BigInt(endRoundBlockNumber),
        ),
    ),
  ]);

  const apr =
    balPriceUSD && tvl && votingShare
      ? calculateRoundAPR(round, votingShare, tvl, balPriceUSD) * 100
      : -1;

  return {
    roundId,
    poolId,
    apr,
    balPriceUSD,
    tvl,
    votingShare,
    symbol,
    network,
  };
}

function calculateRoundAPR(
  round: Round,
  votingShare: number,
  tvl: number,
  balPriceUSD: number,
): number {
  const emissions = balEmissions.weekly(round.endDate.getTime() / 1000);
  return (WEEKS_IN_YEAR * (emissions * votingShare * balPriceUSD)) / tvl;
}
