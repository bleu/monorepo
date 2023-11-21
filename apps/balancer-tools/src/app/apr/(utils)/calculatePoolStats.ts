/* eslint-disable no-console */

import { epochToDate } from "@bleu-fi/utils/date";
import { and, eq, sql } from "drizzle-orm";

import { db } from "#/db";
import { pools, poolSnapshots } from "#/db/schema";

import { PoolStatsData, PoolTokens, TokenAPR } from "../api/route";
import { calculateAPRForDateRange } from "./calculateApr";
import { PoolTypeEnum } from "./types";

export interface calculatePoolData extends Omit<PoolStatsData, "apr"> {
  apr: {
    total: number;
    breakdown: {
      veBAL: number | null;
      swapFee: number;
      tokens?: {
        total: number;
        breakdown: TokenAPR[];
      };
    };
  };
}

export async function fetchPoolData(poolId: string, to: number) {
  const snapshots = await db
    .select({
      network: pools.networkSlug,
      poolType: pools.poolType,
      poolSymbol: pools.symbol,
      liquidity: poolSnapshots.liquidity,
      volume: poolSnapshots.swapVolume,
      bptPrice: sql`CAST(${poolSnapshots.liquidity} AS NUMERIC) / CAST(${poolSnapshots.totalShares} AS NUMERIC)`,
    })
    .from(poolSnapshots)
    .leftJoin(pools, eq(pools.externalId, poolSnapshots.poolExternalId))
    .where(
      and(
        eq(poolSnapshots.poolExternalId, poolId),
        eq(poolSnapshots.timestamp, epochToDate(to)),
      ),
    )
    .limit(1)
    .execute();

  const { network, liquidity, volume, bptPrice, poolSymbol, poolType } =
    snapshots[0];

  return [network, poolType, liquidity, volume, poolSymbol ?? "", bptPrice];
}

export async function fetchPoolTokens(poolId: string) {
  const result = await db.execute(sql`
  SELECT
    pt.token_address AS address,
    pt.weight AS weight,
    t.symbol AS symbol
  FROM
    pool_tokens pt
    JOIN tokens t ON t.address = pt.token_address
  WHERE
  pool_external_id = '${sql.raw(poolId)}'
  ORDER BY
    pt.weight DESC;
  `);

  return result.map(
    (token) =>
      ({
        address: token.address,
        symbol: token.symbol,
        weight: Number(token.weight),
      }) as PoolTokens,
  );
}

export async function calculatePoolStats({
  startAtTimestamp,
  endAtTimestamp,
  poolId,
}: {
  startAtTimestamp: number;
  endAtTimestamp: number;
  poolId: string;
}): Promise<calculatePoolData> {
  const { apr, collectedFeesUSD } = await calculateAPRForDateRange(
    startAtTimestamp,
    endAtTimestamp,
    poolId,
  );

  const [network, poolType, liquidity, volume, symbol] = await fetchPoolData(
    poolId,
    endAtTimestamp,
  );

  const tokens = await fetchPoolTokens(poolId);

  return {
    poolId,
    apr,
    balPriceUSD: 0,
    tvl: Number(liquidity),
    tokens: tokens,
    volume: Number(volume),
    votingShare: 0,
    symbol: String(symbol),
    network: String(network),
    collectedFeesUSD,
    type: poolType as PoolTypeEnum,
  };
}
