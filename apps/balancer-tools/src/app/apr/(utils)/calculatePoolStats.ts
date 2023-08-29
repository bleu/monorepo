/* eslint-disable no-console */
import * as balEmissions from "#/lib/balancer/emissions";
import { Pool } from "#/lib/balancer/gauges";
import { pools } from "#/lib/gql/server";

import { PoolStatsData } from "../api/route";
import { getBALPriceByRound } from "./getBALPriceByRound";
import { getPoolRelativeWeight } from "./getRelativeWeight";
import { Round } from "./rounds";

// The enum namings should be human-readable and are based on what Balancer shows on their FE
export enum PoolTypeEnum {
  PHANTOM_STABLE = "ComposableStable",
  WEIGHTED = "Weighted",
  GYROE = "GyroE",
  STABLE = "Stable",
  MetaStable = "MetaStable",
  UNKNOWN = "FX",
}

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

const fetchPoolTVLFromSnapshotAverageFromRange = async (
  poolId: string,
  network: string,
  from: number,
  to: number,
): Promise<[number, string]> => {
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
    return [0, ""];
  }

  return [avgLiquidity, res.poolSnapshots[0].pool.symbol ?? ""];
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
  const network = String(pool.network ?? 1);

  const [balPriceUSD, [tvl, symbol], votingShare] = await Promise.all([
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
  ]);

  const apr =
    balPriceUSD && tvl && votingShare
      ? calculateRoundAPR(round, votingShare, tvl, balPriceUSD) * 100
      : -1;

  return {
    roundId: Number(roundId),
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
