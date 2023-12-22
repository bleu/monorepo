import { sql } from "drizzle-orm";

import { db } from "../../../db/index";
import { poolSnapshots } from "../../../db/schema";
import { logIfVerbose } from "../../../index";
import { transformNetworks } from "../../../transformNetworks";

export async function transformPoolSnapshots() {
  logIfVerbose("Starting Pool Snapshots Extraction");

  await transformNetworks(poolSnapshots, "network");

  await db.execute(sql`
  INSERT INTO pools (external_id, network_slug)
SELECT raw_data->'pool'->>'id',
LOWER(raw_data->>'network')
FROM pool_snapshots_temp
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
    protocol_swap_fee_cache = (raw_data->'pool'->>'protocolSwapFeeCache')::NUMERIC;
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
WHERE p.id = next_change.id;
`);

  await db.execute(sql`
INSERT INTO pool_snapshots (amounts, total_shares, swap_volume, swap_fees, liquidity, timestamp, protocol_yield_fee_cache, protocol_swap_fee_cache, external_id, pool_external_id, raw_data)
SELECT amounts, total_shares, swap_volume, swap_fees, liquidity, c.timestamp, protocol_yield_fee_cache, protocol_swap_fee_cache, pool_external_id || '-' || c.timestamp AS external_id, pool_external_id, raw_data
FROM
    pool_snapshots_temp b
LEFT JOIN
    calendar c
ON
    b.timestamp <= c.timestamp
    AND (c.timestamp < b.next_timestamp_change OR b.next_timestamp_change IS NULL)
ON CONFLICT (external_id) DO NOTHING;
`);
}
