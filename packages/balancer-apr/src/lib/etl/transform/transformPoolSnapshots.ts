import { sql } from "drizzle-orm";

import { db } from "../../../db/index";
import { logIfVerbose } from "../../../index";

export async function transformPoolSnapshots() {
  logIfVerbose("Starting Pool Snapshots Transformation");

  await db.execute(sql`
  INSERT INTO pools (external_id, network_slug)
SELECT DISTINCT pool_snapshots_temp.raw_data->'pool'->>'id', pool_snapshots_temp.raw_data->>'network'
FROM pool_snapshots_temp
LEFT JOIN pools p ON p.external_id = pool_snapshots_temp.pool_external_id
WHERE p.external_id IS NULL
ON CONFLICT (external_id) DO NOTHING;
  `);

  await db.execute(sql`
UPDATE pool_snapshots_temp
SET
    amounts = raw_data->'amounts',
    total_shares = (raw_data->>'totalShares')::NUMERIC,
    swap_volume = (raw_data->>'swapVolume')::NUMERIC,
    swap_fees = (raw_data->>'swapFees')::NUMERIC,
    liquidity = (raw_data->>'liquidity')::NUMERIC,
    timestamp = to_timestamp((raw_data->>'timestamp')::BIGINT),
    external_id = raw_data->>'id',
    pool_external_id = raw_data->'pool'->>'id',
    protocol_yield_fee_cache = (raw_data->'pool'->>'protocolYieldFeeCache')::NUMERIC,
    protocol_swap_fee_cache = (raw_data->'pool'->>'protocolSwapFeeCache')::NUMERIC,
    network_slug = (raw_data->>'network')
  WHERE pool_snapshots_temp.amounts IS NULL OR network_slug IS NULL;
`);

  await db.execute(sql`
UPDATE pool_snapshots_temp p
SET next_timestamp_change = next_change.next_change_timestamp
FROM (
    SELECT
        id,
        LEAD(timestamp, 1, NOW()) OVER (PARTITION BY pool_external_id ORDER BY timestamp) AS next_change_timestamp
    FROM
        pool_snapshots_temp
) next_change
WHERE p.id = next_change.id AND p.next_timestamp_change IS NULL;
`);

  await db.execute(sql`
  INSERT INTO pool_snapshots (amounts, total_shares, swap_volume, swap_fees, liquidity, timestamp, protocol_yield_fee_cache, protocol_swap_fee_cache, external_id, pool_external_id, raw_data, network_slug)
  SELECT DISTINCT ON (b.pool_external_id || '-' || extract(epoch FROM c.timestamp)
  ::int) b.amounts,
    b.total_shares,
    b.swap_volume,
    b.swap_fees,
    b.liquidity,
    c.timestamp,
    b.protocol_yield_fee_cache,
    b.protocol_swap_fee_cache,
    b.pool_external_id || '-' || extract(epoch FROM c.timestamp)::int AS external_id,
    b.pool_external_id,
    b.raw_data,
    b.network_slug
  FROM
    pool_snapshots_temp b
    LEFT JOIN calendar c ON b.timestamp <= c.timestamp
      AND(c.timestamp < b.next_timestamp_change
        OR b.next_timestamp_change IS NULL)
  WHERE
    NOT EXISTS (
      SELECT
        1
      FROM
        pool_snapshots ps
      WHERE
        ps.external_id = b.pool_external_id || '-' || extract(epoch FROM c.timestamp)::int) ON CONFLICT (external_id)
      DO
      UPDATE
      SET
        (amounts,
          total_shares,
          swap_volume,
          swap_fees,
          liquidity,
          timestamp,
          protocol_yield_fee_cache,
          protocol_swap_fee_cache,
          external_id,
          pool_external_id,
          raw_data,
          network_slug) = (EXCLUDED.amounts,
          EXCLUDED.total_shares,
          EXCLUDED.swap_volume,
          EXCLUDED.swap_fees,
          EXCLUDED.liquidity,
          EXCLUDED.timestamp,
          EXCLUDED.protocol_yield_fee_cache,
          EXCLUDED.protocol_swap_fee_cache,
          EXCLUDED.external_id,
          EXCLUDED.pool_external_id,
          EXCLUDED.raw_data,
          EXCLUDED.network_slug);
`);

  await calculateLiquidity();

  return await db.execute(sql`
UPDATE
	pool_snapshots ps
SET
	network_slug = p.network_slug
FROM (
	SELECT
		pools.external_id,
		pools.network_slug
	FROM
		pools) p
WHERE
	ps.pool_external_id = p.external_id
	AND ps.network_slug IS NULL;`);
}

async function calculateLiquidity() {
  return await db.execute(sql`
  UPDATE
	pool_snapshots ps
SET
	calculated_liquidity = sq.calculated_liquidity,
	calculated_liquidity_error = sq.calculated_liquidity_error
FROM (
	SELECT
		ps.id,
		ps. "timestamp",
		sum((ps.amounts ->> pt.token_index)::numeric * tp.price_usd) AS calculated_liquidity,
		CASE WHEN ps.liquidity > 0 THEN
		(sum((ps.amounts ->> pt.token_index)::numeric * tp.price_usd) - ps.liquidity) / ps.liquidity
	ELSE
		0
		END AS calculated_liquidity_error,
		ps.liquidity,
		ps.total_shares,
		ps.swap_volume,
		ps.swap_fees,
		ps.network_slug
	FROM
		pool_snapshots ps
		JOIN pool_tokens pt ON pt.pool_external_id = ps.pool_external_id
		JOIN token_prices tp ON tp. "timestamp" = ps. "timestamp"
			AND tp.token_address = pt.token_address
		GROUP BY
			ps.liquidity,
			ps.id) sq
WHERE
	ps.id = sq.id
	AND ps.calculated_liquidity IS NULL;`);
}
