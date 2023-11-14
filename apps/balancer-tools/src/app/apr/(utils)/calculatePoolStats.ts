/* eslint-disable no-console */

import { epochToDate } from "@bleu-fi/utils/date";
import { sql } from "drizzle-orm";

import { db } from "#/db";

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
  const result = await db.execute(sql`
  WITH Snapshot AS (
    SELECT
    p.symbol AS pool_symbol,
    p.pool_type AS pool_type,
    p.network_slug AS network,
    ps.liquidity AS liquidity,
    ps.swap_volume AS swapVolume,
    ps.total_shares AS totalShares,
    ps.timestamp AS timestamp
    FROM
      pool_snapshots ps
      JOIN pools p ON p.external_id = ps.pool_external_id
    WHERE
      ps.pool_external_id = '${sql.raw(poolId)}'
      AND ps.timestamp = '${sql.raw(epochToDate(to).toISOString())}'
  ), Calculations AS (
    SELECT
      pool_symbol,
      pool_type,
      network,
      CAST(liquidity AS NUMERIC) AS liquidity,
      CAST(swapVolume AS NUMERIC) AS volume,
      (CAST(liquidity AS NUMERIC) / CAST(totalShares AS NUMERIC)) AS bpt_price
    FROM
      Snapshot
  )
  SELECT
    network,
    pool_type,
    pool_symbol,
    liquidity,
    volume,
    bpt_price
  FROM
    Calculations
  LIMIT 1;`);
  const {
    network,
    liquidity,
    volume,
    bpt_price: bptPrice,
    pool_symbol: symbol,
    pool_type: poolType,
  } = result[0];

  return [network, poolType, liquidity, volume, symbol ?? "", bptPrice];
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
