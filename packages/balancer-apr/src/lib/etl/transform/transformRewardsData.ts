import { sql } from "drizzle-orm";
import { transformNetworks } from "../../../transformNetworks";

import { db } from "../../../db/index";
import { poolRewards } from "../../../db/schema";
import { logIfVerbose } from "../../../index";

export async function transformRewardsData() {
  logIfVerbose("Starting Pool Rewards Extraction");

  await transformNetworks(poolRewards, "network");

  await db.execute(sql`
  INSERT INTO pools (external_id, network_slug)
  SELECT raw_data->'gauge'->>'poolId',
  LOWER(raw_data->>'network')
  FROM pool_rewards
  ON CONFLICT (external_id) DO NOTHING;
  `);

  // Insert data into the rewards table
  await db.execute(sql`
    INSERT INTO pool_rewards (
      token_address, network_slug, period_start, period_end, total_supply, pool_external_id, rate, external_id
    )
    SELECT
      split_part(raw_data ->> 'id', '-', 1) as token_address,
      LOWER(raw_data ->> 'network') as network_slug,
      to_timestamp((raw_data ->> 'periodStart')::bigint) AS period_start,
      to_timestamp((raw_data ->> 'periodFinish')::bigint) AS period_end,
      (raw_data ->> 'totalSupply')::NUMERIC as total_supply,
      raw_data -> 'gauge' ->> 'poolId' as pool_external_id,
      (raw_data ->> 'rate')::NUMERIC as rate,
      raw_data ->> 'id' as external_id
    FROM
	    pool_rewards
    ON CONFLICT (external_id) DO UPDATE
    SET
      token_address = excluded.token_address,
      network_slug = LOWER(excluded.network_slug),
      period_start = excluded.period_start,
      period_end = excluded.period_end,
      total_supply = excluded.total_supply,
      pool_external_id = excluded.pool_external_id,
      rate = excluded.rate;
  `);
}
