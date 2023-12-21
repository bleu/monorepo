import "dotenv/config";

import { and, eq, isNotNull, sql } from "drizzle-orm";

import { db } from "../../../db/index";
import {
  poolRewardsSnapshot,
  poolSnapshots,
  rewardsTokenApr,
  tokenPrices,
} from "../../../db/schema";
import { logIfVerbose } from "../../../index";

export async function loadAPRs() {
  // Fee APR
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
      WHERE
          p1.swap_fees IS NOT NULL
          AND p2.swap_fees IS NOT NULL
          AND p1.swap_fees != 0
          AND p2.swap_fees != 0
          AND p1.swap_fees - p2.swap_fees != 0
      ON CONFLICT (external_id) DO NOTHING;
    `);
  //veBAL APR
  logIfVerbose("Loading veBAL APR");
  await db.execute(sql`
    INSERT INTO vebal_apr (timestamp, value, pool_external_id, external_id)
    SELECT DISTINCT
        ps.timestamp,
        CASE
            WHEN ps.liquidity = 0 THEN 0
            ELSE (((be.week_emission / 7) * 365 * gs.relative_weight * tp.price_usd) / (ps.liquidity)) * 100
        END AS value,
        ps.pool_external_id,
        ps.external_id
    FROM pool_snapshots ps
    LEFT JOIN vebal_rounds vr ON ps.timestamp BETWEEN vr.start_date AND vr.end_date
    JOIN gauges g ON g.pool_external_id = ps.pool_external_id
    JOIN gauge_snapshots gs ON g.address = gs.gauge_address
        AND vr.round_number = gs.round_number
    LEFT JOIN token_prices tp ON tp.token_address = '0xba100000625a3754423978a60c9317c58a424e3d'
        AND tp.timestamp = ps.timestamp
    LEFT JOIN bal_emission be ON be.timestamp = ps.timestamp
    ON CONFLICT (external_id) DO NOTHING;
  `);

  //Token Yield APR
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
    ) AS subquery ON subquery.timestamp = pool_snapshots.timestamp
    AND subquery.token_address = pool_tokens.token_address
    AND subquery.row_num = 1 -- Use the latest rate
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
    ON CONFLICT (external_id) DO NOTHING;
    `);
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
    ) AS subquery ON subquery.timestamp = pool_snapshots.timestamp
    AND subquery.token_address = pool_tokens.token_address
    AND subquery.row_num = 1 -- Use the latest rate
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
    ON CONFLICT (external_id) DO NOTHING;
    `);
  logIfVerbose("Loading Rewards APR");
  const poolInRewardsSnapshot = await db
    .selectDistinct({
      timestamp: poolRewardsSnapshot.timestamp,
      poolExternalId: poolRewardsSnapshot.poolExternalId,
      tokenAddress: poolRewardsSnapshot.tokenAddress,
      totalSupply: poolRewardsSnapshot.totalSupply,
      yearlyAmount: poolRewardsSnapshot.yearlyAmount,
      liquidity: poolSnapshots.liquidity,
      totalShares: poolSnapshots.totalShares,
      tokenPrice: tokenPrices.priceUSD,
    })
    .from(poolRewardsSnapshot)
    .leftJoin(
      poolSnapshots,
      and(
        eq(poolSnapshots.poolExternalId, poolRewardsSnapshot.poolExternalId),
        eq(poolSnapshots.timestamp, poolRewardsSnapshot.timestamp),
      ),
    )
    .leftJoin(
      tokenPrices,
      and(
        eq(tokenPrices.tokenAddress, poolRewardsSnapshot.tokenAddress),
        eq(tokenPrices.timestamp, poolRewardsSnapshot.timestamp),
      ),
    )
    .where(isNotNull(tokenPrices.priceUSD));
  const data = poolInRewardsSnapshot.map((item) => {
    return {
      timestamp: item.timestamp,
      poolExternalId: item.poolExternalId,
      tokenAddress: item.tokenAddress,
      value: String(
        ((Number(item.yearlyAmount) * Number(item.tokenPrice)) /
          Number(item.liquidity)) *
          100,
      ),
    };
  });
  await db.insert(rewardsTokenApr).values(data).onConflictDoNothing().execute();
}
