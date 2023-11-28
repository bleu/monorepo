import { db } from "@bleu-fi/balancer-apr/src/db";
import {
  pools,
  poolSnapshots,
  poolTokens,
  swapFeeApr,
  tokens,
  vebalApr,
} from "@bleu-fi/balancer-apr/src/db/schema";
import { formatDateToMMDDYYYY } from "@bleu-fi/utils/date";
import { and, between, eq, ne, sql } from "drizzle-orm";

import { PoolTypeEnum } from "../../(utils)/types";
import { PoolStatsResults } from "../route";

export async function fetchDataForPoolIdDateRange(
  poolId: string,
  startDate: Date,
  endDate: Date,
): Promise<PoolStatsResults> {
  const poolStatsData = await db
    .select({
      poolExternalId: swapFeeApr.poolExternalId,
      apr: sql<number>`cast(${swapFeeApr.value} + ${vebalApr.value} as decimal)`,
      feeApr: swapFeeApr.value,
      vebalApr: vebalApr.value,
      volume: poolSnapshots.swapVolume,
      liquidity: poolSnapshots.liquidity,
      timestamp: poolSnapshots.timestamp,
      collectedFeesUSD: swapFeeApr.collectedFeesUSD,
    })
    .from(swapFeeApr)
    .fullJoin(
      poolSnapshots,
      and(
        eq(poolSnapshots.poolExternalId, swapFeeApr.poolExternalId),
        eq(poolSnapshots.timestamp, swapFeeApr.timestamp),
      ),
    )
    .fullJoin(
      vebalApr,
      and(
        eq(vebalApr.poolExternalId, swapFeeApr.poolExternalId),
        eq(vebalApr.timestamp, swapFeeApr.timestamp),
      ),
    )
    .where(
      and(
        between(swapFeeApr.timestamp, startDate, endDate),
        eq(swapFeeApr.poolExternalId, poolId),
        ne(
          sql<number>`cast(${swapFeeApr.value} + ${vebalApr.value} as decimal)`,
          0,
        ),
      ),
    );

  const poolData = await db
    .select({
      poolExternalId: pools.externalId,
      network: pools.networkSlug,
      type: pools.poolType,
      symbol: pools.symbol,
    })
    .from(pools)
    .fullJoin(swapFeeApr, and(eq(swapFeeApr.poolExternalId, pools.externalId)))
    .where(
      and(
        between(swapFeeApr.timestamp, startDate, endDate),
        eq(pools.externalId, poolId),
      ),
    );

  const poolsTokens = await db
    .select({
      poolExternalId: poolTokens.poolExternalId,
      address: poolTokens.tokenAddress,
      weight: poolTokens.weight,
      symbol: tokens.symbol,
    })
    .from(poolTokens)
    .leftJoin(tokens, eq(tokens.address, poolTokens.tokenAddress))
    .where(eq(poolTokens.poolExternalId, poolId));

  const returnData = poolStatsData.map((pool) => {
    if (!pool.timestamp) {
      return {};
    }

    const tokensForPool = poolsTokens
      .filter((poolToken) => poolToken.poolExternalId === pool.poolExternalId)
      .map((poolToken) => ({
        address: poolToken.address,
        symbol: poolToken.symbol,
        weight: Number(poolToken.weight),
      }));

    return {
      [formatDateToMMDDYYYY(pool.timestamp)]: {
        poolId: pool.poolExternalId,
        apr: {
          total: Number(pool.apr),
          breakdown: {
            veBAL: Number(pool.vebalApr),
            swapFee: Number(pool.feeApr),
            tokens: {
              total: 0,
              breakdown: [],
            },
            rewards: {
              total: 0,
              breakdown: [],
            },
          },
        },
        collectedFeesUSD: Number(pool.collectedFeesUSD),
        tvl: Number(pool.liquidity),
        tokens: tokensForPool,
        volume: Number(pool.volume),
        votingShare: 0,
        symbol:
          poolData.find((p) => p.poolExternalId === pool.poolExternalId)
            ?.symbol || "",
        network:
          poolData.find((p) => p.poolExternalId === pool.poolExternalId)
            ?.network || "",
        type: poolData.find((p) => p.poolExternalId === pool.poolExternalId)
          ?.type as PoolTypeEnum,
      },
    };
  });

  return {
    perDay: returnData,
  };
}
