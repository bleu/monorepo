import { sql } from "drizzle-orm";

import { db } from "../../../db/index";
import { gauges } from "../../../db/schema";
import { logIfVerbose } from "../../../index";
import { transformNetworks } from "../../../transformNetworks";

export async function transformGauges() {
  logIfVerbose("Starting Gauges Transformation");

  await transformNetworks(gauges, "chain");

  // First, update the 'pools' table to make sure all the external_id values are there.
  await db.execute(sql`
  INSERT INTO pools (external_id, network_slug)
  SELECT
    raw_data ->> 'id',
    CASE WHEN LOWER(raw_data ->> 'chain') = 'zkevm' THEN 'polygon-zkevm'
    WHEN LOWER(raw_data ->> 'chain') = 'mainnet' THEN 'ethereum'
    ELSE
      LOWER(raw_data ->> 'chain')
    END
  FROM
    gauges 
  WHERE raw_data ->> 'id' IS NOT NULL
  ON CONFLICT (external_id)
  DO NOTHING;
  `);

  // Then, insert or update the 'gauges' table.
  await db.execute(sql`
  INSERT INTO gauges (address, is_killed, external_created_at, pool_external_id, network_slug)
  SELECT
      raw_data->'gauge'->>'address',
      (raw_data->'gauge'->>'isKilled')::BOOLEAN,
      to_timestamp((raw_data->'gauge'->>'addedTimestamp')::BIGINT),
      raw_data->>'id',
      CASE
          WHEN LOWER(raw_data->>'chain') = 'zkevm' THEN 'polygon-zkevm'
          WHEN LOWER(raw_data->>'chain') = 'mainnet' THEN 'ethereum'
          ELSE LOWER(raw_data->>'chain')
      END
  FROM gauges
  ON CONFLICT (address, pool_external_id)
  DO UPDATE SET is_killed = EXCLUDED.is_killed
  WHERE gauges.address IS DISTINCT FROM EXCLUDED.address;`);

  // delete rows that are no longer needed
  await db.execute(
    sql`
  DELETE FROM gauges
  WHERE NOT EXISTS (
    SELECT 1 FROM gauges g
    WHERE g.address = gauges.address
    AND g.pool_external_id = gauges.pool_external_id
  );`,
  );
}
