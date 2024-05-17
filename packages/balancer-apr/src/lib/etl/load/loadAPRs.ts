import "dotenv/config";

import { sql } from "drizzle-orm";
import { logIfVerbose } from "lib/logIfVerbose";

import { db } from "../../../db/index";
import { blockListRateProvider } from "lib/balancer/data/blockListRateProvider";

export async function loadAPRs() {
  await Promise.all([
    loadFeeAPR(),
    loadVebalAPR(),
    loadRewardsAPR(),
    loadTokenYieldWeightedAPR(),
    loadTokenYieldNonWeightedAPR(),
  ]);
}

async function loadVebalAPR() {
  logIfVerbose("Loading veBAL APR");

  await db.execute(sql`
  INSERT INTO vebal_apr (timestamp, value, pool_external_id)
  SELECT
    tp. "timestamp",
    CASE WHEN gs.working_supply = 0
      OR gs.working_supply IS NULL
      OR ps.liquidity = 0
      OR ps.liquidity IS NULL
      OR ps.total_shares = 0
      OR ps.total_shares IS NULL THEN
      0
    ELSE
      CASE WHEN gs.network_slug = 'ethereum' THEN
      ((be.week_emission / 7) * 365 * gs.relative_weight * tp.price_usd * 100) / (((gs.working_supply + 0.4) / 0.4) * (ps.liquidity / ps.total_shares))
    ELSE
      CASE WHEN gs.inflation_rate = 0
        OR gs.inflation_rate IS NULL THEN
        0
      ELSE
        (gs.inflation_rate * 86400 * 365 * tp.price_usd) * 100 / (((gs.working_supply + 0.4) / 0.4) * (ps.liquidity / ps.total_shares))
      END
      END
    END AS apr,
    ps.pool_external_id
  FROM
    gauge_snapshots gs
    JOIN gauges g ON g.address = gs.gauge_address
      AND gs.network_slug = g.network_slug
    JOIN pool_snapshots ps ON ps. "timestamp" = gs. "timestamp"
      AND g.pool_external_id = ps.pool_external_id
      AND gs.network_slug = ps.network_slug
    JOIN token_prices tp ON gs. "timestamp" = tp. "timestamp"
      AND tp.token_address = '0xba100000625a3754423978a60c9317c58a424e3d'
      and tp.network_slug = 'ethereum'
    JOIN bal_emission be ON be.timestamp = gs.timestamp
    LEFT JOIN vebal_apr va ON ps.pool_external_id = va.pool_external_id
      AND ps.timestamp = va.timestamp
  WHERE
    1 = 1
    AND va.timestamp IS NULL 
    ON CONFLICT (pool_external_id, "timestamp")
    DO NOTHING;
  `);
}

async function loadRewardsAPR() {
  logIfVerbose("Loading Rewards APR");

  await db.execute(sql`
  WITH date_series AS (
    SELECT
      generate_series(MIN(period_start) - interval '1 day',
        MAX(period_end) + interval '1 day',
        '1 day')::date AS snapshot_date
    FROM
      pool_rewards
  ),
  intermediary AS (
    SELECT
      pr.rate,
      pr.period_start,
      pr.period_end,
      ds.snapshot_date AS "timestamp",
      pr.pool_external_id,
      pr.token_address,
      pr.total_supply,
      pr.network_slug
    FROM
      pool_rewards pr
      INNER JOIN date_series ds ON ds.snapshot_date BETWEEN pr.period_start - interval '1 day'
        AND pr.period_end
  ) INSERT INTO rewards_token_apr (pool_external_id, "timestamp", token_address, period_start, period_end, value)
  SELECT
    i.pool_external_id,
    i. "timestamp",
    i.token_address,
    i.period_start,
    i.period_end,
    SUM(
      CASE WHEN ps.total_shares = 0
        OR ps.total_shares IS NULL
        OR ps.liquidity = 0
        OR ps.liquidity IS NULL THEN
        NULL
      ELSE
        ((i.rate * 86400 * 365) * tp.price_usd) / ((ps.liquidity / ps.total_shares) * (
      CASE WHEN gs.total_supply = 0
        OR gs.total_supply IS NULL THEN
        i.total_supply
      ELSE
        gs.total_supply
      END)) * 100
      END) AS value
  FROM
    intermediary i
  JOIN pool_snapshots ps ON i.pool_external_id = ps.pool_external_id
    AND i. "timestamp" = ps. "timestamp"
    AND i.network_slug = ps.network_slug
  JOIN gauges g ON g.pool_external_id = ps.pool_external_id
    AND g.network_slug = i.network_slug
    LEFT JOIN gauge_snapshots gs ON gs.network_slug = i.network_slug
      AND g.address = gs.gauge_address
      AND gs. "timestamp" = i.timestamp
    JOIN token_prices tp ON tp.network_slug = ps.network_slug
      AND i.token_address = tp.token_address
      AND tp. "timestamp" = i. "timestamp"
  WHERE
    1 = 1
    AND NOT EXISTS (
      SELECT
        1
      FROM
        rewards_token_apr rtapr
      WHERE
        rtapr. "timestamp" = ps. "timestamp"
        AND rtapr.token_address = i.token_address
        AND rtapr.pool_external_id = i.pool_external_id)
    GROUP BY
      i.pool_external_id,
      i.timestamp,
      i.token_address,
      i.period_start,
      i.period_end;
`);
}

async function loadFeeAPR() {
  logIfVerbose("Loading Fee APR");
  await db.execute(sql`
      INSERT INTO swap_fee_apr (timestamp, pool_external_id, collected_fees_usd, value, external_id)
      SELECT
          p1.timestamp,
          p1.pool_external_id,
          p1.swap_fees - p2.swap_fees AS collected_fees_usd,
          CASE
              WHEN p1.liquidity = 0 THEN 0
              ELSE ((p1.swap_fees - p2.swap_fees) * (1 - COALESCE(p1.protocol_swap_fee_cache, 0.5)) / p1.liquidity) * 365 * 100
          END AS value,
          p1.external_id
      FROM
          pool_snapshots p1
      LEFT JOIN pool_snapshots p2
          ON p1.timestamp = p2.timestamp + INTERVAL '1 day'
          AND p1.pool_external_id = p2.pool_external_id
      LEFT JOIN swap_fee_apr sfa ON p1.pool_external_id = sfa.pool_external_id AND p1.timestamp = sfa.timestamp
      WHERE
          p1.swap_fees IS NOT NULL
          AND p2.swap_fees IS NOT NULL
          AND p1.swap_fees != 0
          AND p2.swap_fees != 0
          AND p1.swap_fees - p2.swap_fees != 0
          AND sfa.timestamp IS NULL
      ON CONFLICT (pool_external_id, "timestamp") DO NOTHING;
    `);
}

async function loadTokenYieldNonWeightedAPR() {
  logIfVerbose("Loading Token Yield APR for non-weighted pools");
  await db.execute(sql`
    INSERT INTO yield_token_apr (timestamp, token_address, pool_external_id, external_id, value)
    SELECT DISTINCT
    pool_snapshots.timestamp,
    pool_tokens.token_address,
    pool_snapshots.pool_external_id,
    pool_tokens.token_address || '-' || pool_snapshots.pool_external_id || '-' || pool_snapshots.timestamp as external_id,
    CASE
        WHEN pools.pool_type = 'ComposableStable' AND pool_tokens.is_exempt_from_yield_protocol_fee IS TRUE THEN
            ptw.weight * subquery.rate * 365 * 100
        WHEN pools.pool_type = 'ComposableStable' AND (pool_tokens.is_exempt_from_yield_protocol_fee IS NULL OR pool_tokens.is_exempt_from_yield_protocol_fee IS FALSE) THEN
            ptw.weight * subquery.rate * 365 * 100 * COALESCE(NULLIF(pool_snapshots.protocol_yield_fee_cache, 0), 0.5)
         WHEN pools.pool_type = 'MetaStable' OR pools.pool_type LIKE '%Gyro%' THEN
         	ptw.weight * subquery.rate * 365 * 100 * (1 - COALESCE(NULLIF(pool_snapshots.protocol_swap_fee_cache, 0), 0.5))
         ELSE  ptw.weight * subquery.rate * 365 * 100
    END AS yield_apr
  FROM
    pool_snapshots
    LEFT JOIN pool_rate_providers ON pool_rate_providers.pool_external_id = pool_snapshots.pool_external_id
    LEFT JOIN pools ON pools.external_id = pool_snapshots.pool_external_id
    LEFT JOIN pool_tokens ON pool_tokens.pool_external_id = pool_snapshots.pool_external_id
    LEFT JOIN pool_token_weights_snapshot ptw ON ptw.pool_external_id = pool_snapshots.pool_external_id AND ptw."timestamp" = pool_snapshots."timestamp" AND ptw.token_address = pool_tokens.token_address
    LEFT JOIN (
        SELECT
            p1.timestamp,
            p1.rate_provider_address,
            (p1.rate - p2.rate) / p2.rate AS rate,
            p1.external_id,
            prt.token_address,
            ROW_NUMBER() OVER (PARTITION BY p1.timestamp, prt.token_address ORDER BY p1.timestamp DESC) as row_num
        FROM
            pool_token_rate_providers_snapshot p1
            LEFT JOIN pool_token_rate_providers_snapshot p2 ON p1.timestamp = p2.timestamp + INTERVAL '1 day'
                AND p1.rate_provider_address = p2.rate_provider_address
            LEFT JOIN pool_rate_providers prt ON prt.address = p1.rate_provider_address
        WHERE
            p1.rate IS NOT NULL
            AND p2.rate IS NOT NULL
            AND p1.rate != 0
            AND p2.rate != 0
            AND p1.rate - p2.rate != 0
            AND p1.rate_provider_address NOT IN (${sql.raw(
              blockListRateProvider
                .map(
                  (item: { rateProviderAddress: unknown }) =>
                    `'${item.rateProviderAddress}'`
                )
                .join(", ")
            )})
    ) AS subquery ON subquery.timestamp = pool_snapshots.timestamp
    AND subquery.token_address = pool_tokens.token_address
    AND subquery.row_num = 1 -- Use the latest rate
    LEFT JOIN yield_token_apr yta ON pool_snapshots.pool_external_id = yta.pool_external_id AND pool_snapshots.timestamp = yta.timestamp
  WHERE
    pool_snapshots.pool_external_id = pool_rate_providers.pool_external_id
    AND subquery.rate IS NOT NULL
    AND (
      pool_rate_providers.vulnerability_affected = false
      OR (
        pool_rate_providers.vulnerability_affected = true
        AND pool_snapshots.timestamp < '2023-08-22'::timestamp
      )
    )
    AND ptw.weight IS NOT NULL
    AND yta.timestamp IS NULL
    ON CONFLICT (token_address, pool_external_id, "timestamp") DO NOTHING;
    `);
}

async function loadTokenYieldWeightedAPR() {
  logIfVerbose("Loading Token Yield APR for weighted pools");
  await db.execute(sql`
    INSERT INTO yield_token_apr (timestamp, token_address, pool_external_id, external_id, value)
    SELECT
    pool_snapshots.timestamp,
    pool_tokens.token_address,
    pool_snapshots.pool_external_id,
    pool_tokens.token_address || '-' || pool_snapshots.pool_external_id || '-' || pool_snapshots.timestamp as external_id,
    CASE
        WHEN pools.pool_type_version > 1 AND pool_tokens.is_exempt_from_yield_protocol_fee IS TRUE THEN
            pool_tokens.weight * subquery.rate * 365 * 100
        WHEN pools.pool_type_version > 1 AND (pool_tokens.is_exempt_from_yield_protocol_fee IS NULL OR pool_tokens.is_exempt_from_yield_protocol_fee IS FALSE )THEN
            pool_tokens.weight * subquery.rate * 365 * 100 * COALESCE(NULLIF(pool_snapshots.protocol_yield_fee_cache, 0), 0.5)
    END AS yield_apr
  FROM
    pool_snapshots
    LEFT JOIN pool_rate_providers ON pool_rate_providers.pool_external_id = pool_snapshots.pool_external_id
    LEFT JOIN pools ON pools.external_id = pool_snapshots.pool_external_id
    LEFT JOIN pool_tokens ON pool_tokens.pool_external_id = pool_snapshots.pool_external_id
    LEFT JOIN (
        SELECT
            p1.timestamp,
            p1.rate_provider_address,
            (p1.rate - p2.rate) / p2.rate AS rate,
            p1.external_id,
            prt.token_address,
            ROW_NUMBER() OVER (PARTITION BY p1.timestamp, prt.token_address ORDER BY p1.timestamp DESC) as row_num
        FROM
            pool_token_rate_providers_snapshot p1
            LEFT JOIN pool_token_rate_providers_snapshot p2 ON p1.timestamp = p2.timestamp + INTERVAL '1 day'
                AND p1.rate_provider_address = p2.rate_provider_address
            LEFT JOIN pool_rate_providers prt ON prt.address = p1.rate_provider_address
        WHERE
            p1.rate IS NOT NULL
            AND p2.rate IS NOT NULL
            AND p1.rate != 0
            AND p2.rate != 0
            AND p1.rate - p2.rate != 0
            AND p1.rate_provider_address NOT IN (${sql.raw(
              blockListRateProvider
                .map(
                  (item: { rateProviderAddress: unknown }) =>
                    `'${item.rateProviderAddress}'`
                )
                .join(", ")
            )})
    ) AS subquery ON subquery.timestamp = pool_snapshots.timestamp
    AND subquery.token_address = pool_tokens.token_address
    AND subquery.row_num = 1 -- Use the latest rate
    LEFT JOIN yield_token_apr yta ON pool_snapshots.pool_external_id = yta.pool_external_id AND pool_snapshots.timestamp = yta.timestamp
  WHERE
    pool_snapshots.pool_external_id = pool_rate_providers.pool_external_id
    AND pools.pool_type = 'Weighted'
    AND subquery.rate IS NOT NULL
    AND (
      pool_rate_providers.vulnerability_affected = false
      OR (
        pool_rate_providers.vulnerability_affected = true
        AND pool_snapshots.timestamp < '2023-08-22'::timestamp
      )
    )
    AND yta.timestamp IS NULL
    ON CONFLICT (token_address, pool_external_id, "timestamp") DO NOTHING;
    `);
}
