import { sql } from "drizzle-orm";
import { logIfVerbose } from "lib/logIfVerbose";

import { db } from "../../../db/index";
import { pools } from "../../../db/schema";
import { transformNetworks } from "./transformNetworks";

export async function transformPools() {
  logIfVerbose("Starting Pools Transformation");
  // Transform the networks first
  await transformNetworks(pools, "network");

  // Insert data into the pools table
  await db.execute(sql`
    INSERT INTO pools (
      external_id, address, symbol, pool_type, external_created_at, network_slug, pool_type_version
    )
    SELECT
      raw_data->>'id',
      raw_data->>'address',
      raw_data->>'symbol',
      raw_data->>'poolType',
      to_timestamp((raw_data->>'createTime')::BIGINT),
      LOWER(raw_data->>'network'),
      (raw_data->>'poolTypeVersion')::NUMERIC
    FROM pools
    WHERE raw_data IS NOT NULL AND raw_data::text <> '{}'::text
    ON CONFLICT (external_id) DO UPDATE
    SET
      address = excluded.address,
      symbol = excluded.symbol,
      pool_type = excluded.pool_type,
      external_created_at = excluded.external_created_at,
      network_slug = LOWER(excluded.network_slug),
      pool_type_version = excluded.pool_type_version;
  `);

  // Insert data into the tokens table from the 'tokens' array in raw_data
  await db.execute(sql`
    INSERT INTO tokens (address, symbol, network_slug)
    SELECT jsonb_array_elements(raw_data::jsonb->'tokens')->>'address',
           jsonb_array_elements(raw_data::jsonb->'tokens')->>'symbol',
           LOWER(raw_data->>'network')
    FROM pools
    ON CONFLICT (address, network_slug) DO NOTHING;
  `);

  // -- Insert data into pool_tokens table using a subquery
  await db.execute(sql`
    INSERT INTO pool_tokens (weight, pool_external_id, token_address, network_slug, token_index, is_exempt_from_yield_protocol_fee)
    SELECT DISTINCT ON (sub.external_id, tokens.address)
          sub.weight,
          sub.external_id,
          tokens.address,
          tokens.network_slug,
          sub.token_index,
          sub.is_exempt_from_yield_protocol_fee
    FROM (
        SELECT (jsonb_array_elements(raw_data::jsonb->'tokens')->>'weight')::NUMERIC as weight,
              raw_data->>'id' as external_id,
              jsonb_array_elements(raw_data::jsonb->'tokens')->>'address' as address,
              (jsonb_array_elements(raw_data::jsonb->'tokens')->>'isExemptFromYieldProtocolFee')::BOOLEAN as is_exempt_from_yield_protocol_fee,
              (jsonb_array_elements(raw_data::jsonb->'tokens')->>'index')::NUMERIC as token_index
        FROM pools
    ) as sub
    JOIN tokens ON sub.address = tokens.address
    ON CONFLICT (pool_external_id, token_address) DO UPDATE
    SET weight = excluded.weight;
    `);
}
