/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-env node */
// eslint-disable-next-line @typescript-eslint/no-var-requires
import "dotenv/config";

import { dateToEpoch } from "@bleu-fi/utils/date";
import { and, asc, eq, gt, isNotNull, sql } from "drizzle-orm";
import { PgTable } from "drizzle-orm/pg-core";
import { Address } from "viem";

import { chunks } from "./chunks";
import {
  ENDPOINT_V3,
  NETWORK_TO_BALANCER_ENDPOINT_MAP,
  POOLS_SNAPSHOTS,
  POOLS_WITHOUT_GAUGE_QUERY,
  VOTING_GAUGES_QUERY,
} from "./config";
import { db } from "./db/index";
import {
  balEmission,
  gauges,
  gaugeSnapshots,
  pools,
  poolSnapshots,
  poolSnapshotsTemp,
  tokenPrices,
  vebalRounds,
} from "./db/schema";
import { gql } from "./gql";
import * as balEmissions from "./lib/balancer/emissions";
import { DefiLlamaAPI } from "./lib/defillama";
import { getPoolRelativeWeights } from "./lib/getRelativeWeight";
import { paginatedFetch } from "./paginatedFetch";

export const BATCH_SIZE = 1_000;

const isVerbose = process.argv.includes("-v");

export function logIfVerbose(message: string) {
  if (isVerbose) {
    console.log(message);
  }
}

async function processPoolSnapshots(data: any, network: string) {
  logIfVerbose(`Processing pool snapshots for network ${network}`);

  if (data.poolSnapshots) {
    await addToTable(
      poolSnapshotsTemp,
      data.poolSnapshots.map((snapshot: any) => ({
        externalId: snapshot.id,
        rawData: { ...snapshot, network },
      })),
    );
  }
}

async function processPools(data: any, network: string) {
  logIfVerbose(`Processing pools for network ${network}`);

  if (data.pools) {
    await addToTable(
      pools,
      data.pools.map((pool: any) => ({
        externalId: pool.id,
        rawData: { ...pool, network },
      })),
    );
  }
}

async function processGauges(data: any) {
  logIfVerbose(`Processing gauges`);

  if (data.veBalGetVotingList) {
    await addToTable(
      gauges,
      data.veBalGetVotingList.map((gauge: any) => ({
        address: gauge.gauge.address,
        rawData: { ...gauge },
      })),
    );
  }
}

async function extractPoolSnapshotsForNetwork(
  networkEndpoint: string,
  network: string,
) {
  await paginatedFetch(networkEndpoint, POOLS_SNAPSHOTS, (data) =>
    processPoolSnapshots(data, network),
  );
}

async function extractPoolsForNetwork(
  networkEndpoint: string,
  network: string,
) {
  await paginatedFetch(networkEndpoint, POOLS_WITHOUT_GAUGE_QUERY, (data) =>
    processPools(data, network),
  );
}

async function extractGauges() {
  const response = await gql(ENDPOINT_V3, VOTING_GAUGES_QUERY);
  await processGauges(response.data);
}

async function extractGaugesSnapshot() {
  try {
    // Fetch gauge addresses and corresponding timestamps
    const gaugeTimestamps = await db
      .select({
        gaugeAddress: gauges.address,
        timestamp: vebalRounds.startDate,
      })
      .from(poolSnapshots)
      .fullJoin(gauges, eq(poolSnapshots.poolExternalId, gauges.poolExternalId))
      .fullJoin(vebalRounds, eq(poolSnapshots.timestamp, vebalRounds.startDate))
      .where(
        and(
          gt(poolSnapshots.timestamp, gauges.externalCreatedAt),
          isNotNull(vebalRounds.startDate),
        ),
      )
      .orderBy(asc(vebalRounds.startDate));

    // Create tuples for batch processing
    const gaugeAddressTimestampTuples: [Address, number][] =
      gaugeTimestamps.map(({ gaugeAddress, timestamp }) => [
        gaugeAddress as Address,
        dateToEpoch(timestamp),
      ]);

    // Batch process to get relative weights
    logIfVerbose(
      `Fetching ${gaugeAddressTimestampTuples.length} relativeweight-timestamp pairs`,
    );
    const relativeWeights = await getPoolRelativeWeights(
      gaugeAddressTimestampTuples,
    );

    // Fetch round numbers for all timestamps in bulk
    const roundNumbers = await db
      .select({
        timestamp: vebalRounds.startDate,
        round_number: vebalRounds.roundNumber,
      })
      .from(vebalRounds);

    // Create a timestamp to round number mapping
    const roundNumberMap = roundNumbers.reduce(
      (map, { timestamp, round_number }) => {
        map[dateToEpoch(timestamp)] = round_number; // Ensure timestamp format aligns with what is used in gaugeAddressTimestampTuples
        return map;
      },
      {} as { [key: number]: number },
    );

    const insertData = []; // Array to hold records for batch insert

    for (const [
      gaugeAddress,
      epochTimestamp,
      relativeWeight,
    ] of relativeWeights) {
      const roundNumber = roundNumberMap[epochTimestamp];

      // Add record to insertData array if roundNumber exists
      if (roundNumber) {
        insertData.push({
          gaugeAddress,
          timestamp: new Date(epochTimestamp * 1000), // Convert back to Date object
          relativeWeight: String(relativeWeight),
          roundNumber,
        });
      }
    }
    // Perform a single batch insert if there are records to insert
    if (insertData.length > 0) {
      await db
        .insert(gaugeSnapshots)
        .values(insertData)
        .onConflictDoNothing()
        .execute();
    }
  } catch (error) {
    console.error(error);
  }
}

async function addToTable(table: any, items: any) {
  const chunkedItems = [...chunks(items, BATCH_SIZE)];
  return await Promise.all(
    chunkedItems.map(async (items) => {
      return await db.insert(table).values(items).onConflictDoNothing();
    }),
  );
}

async function transformNetworks(table: PgTable, key = "network") {
  await db.execute(sql`
INSERT INTO networks (slug)
SELECT
  CASE
    WHEN LOWER(raw_data->>'${sql.raw(key)}') = 'zkevm' THEN 'polygon-zkevm'
    WHEN LOWER(raw_data->>'${sql.raw(key)}') = 'mainnet' THEN 'ethereum'
    ELSE LOWER(raw_data->>'${sql.raw(key)}')
  END
FROM ${table}
WHERE LOWER(raw_data->>'${sql.raw(key)}') IS NOT NULL
ON CONFLICT (slug) DO NOTHING;
  `);
}

async function transformPoolSnapshotsData() {
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

async function transformPoolData() {
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
          sub.ordinality,
          sub.is_exempt_from_yield_protocol_fee
    FROM (
        SELECT (jsonb_array_elements(raw_data::jsonb->'tokens')->>'weight')::NUMERIC as weight,
              raw_data->>'id' as external_id,
              jsonb_array_elements(raw_data::jsonb->'tokens')->>'address' as address,
              (jsonb_array_elements(raw_data::jsonb->'tokens')->>'isExemptFromYieldProtocolFee')::BOOLEAN as is_exempt_from_yield_protocol_fee,
              ordinality
        FROM pools, jsonb_array_elements(raw_data::jsonb->'tokens') WITH ORDINALITY
    ) as sub
    JOIN tokens ON sub.address = tokens.address
    ON CONFLICT (pool_external_id, token_address) DO UPDATE
    SET weight = excluded.weight;
    `);
}

async function transformGauges() {
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
    gauges ON CONFLICT (external_id)
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

  //TODO: get raw_data to the gauges table, this is creating new rows and deleting old ones, so the id starts on 267

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

async function ETLGauges() {
  logIfVerbose("Starting Gauges Extraction");
  await extractGauges();
  logIfVerbose("Starting Gauges Transformation");
  await transformGauges();
}

async function ETLGaugesSnapshot() {
  logIfVerbose("Starting Gauges Snapshot Extraction");
  await extractGaugesSnapshot();
}

const networkNames = Object.keys(
  NETWORK_TO_BALANCER_ENDPOINT_MAP,
) as (keyof typeof NETWORK_TO_BALANCER_ENDPOINT_MAP)[];

async function ETLPools() {
  logIfVerbose("Starting Pools Extraction");

  await Promise.all(
    networkNames.map(async (networkName) => {
      const networkEndpoint = NETWORK_TO_BALANCER_ENDPOINT_MAP[networkName];
      await extractPoolsForNetwork(networkEndpoint, networkName);
    }),
  );
  logIfVerbose("Starting Pools Transformation");
  await transformPoolData();
}

async function ETLSnapshots() {
  logIfVerbose("Starting Pool Snapshots Extraction");
  await Promise.all(
    networkNames.map(async (networkName) => {
      const networkEndpoint = NETWORK_TO_BALANCER_ENDPOINT_MAP[networkName];
      await extractPoolSnapshotsForNetwork(networkEndpoint, networkName);
    }),
  );

  logIfVerbose("Starting Pool Snapshots Extraction");
  await transformPoolSnapshotsData();
}

async function seedNetworks() {
  logIfVerbose("Seeding networks");

  return await db.execute(sql`
INSERT INTO networks (name, slug, chain_id) VALUES
('Ethereum', 'ethereum', 1),
('Polygon', 'polygon', 137),
('Arbitrum', 'arbitrum', 42161),
('Gnosis', 'gnosis', 100),
('Optimism', 'optimism', 10),
('Goerli', 'goerli', 5),
('Sepolia', 'sepolia', 11155111),
('PolygonZKEVM', 'polygon-zkevm', 1101),
('Base', 'base', 8453),
('Avalanche', 'avalanche', 43114)
ON CONFLICT (slug)
DO UPDATE SET chain_id = EXCLUDED.chain_id, updated_at = NOW();
`);
}

async function seedVebalRounds() {
  logIfVerbose("Seeding veBAL rounds");

  const startDate = new Date("2022-04-14T00:00:00.000Z");
  let roundNumber = 1;

  const data = [];
  while (startDate <= new Date()) {
    const endDate = new Date(startDate);
    endDate.setUTCDate(endDate.getUTCDate() + 6);
    endDate.setUTCHours(23, 59, 59, 999);

    data.push({
      startDate: startDate,
      endDate: endDate,
      roundNumber: roundNumber,
    });

    startDate.setUTCDate(startDate.getUTCDate() + 7);
    roundNumber++;
  }

  await addToTable(vebalRounds, data);
}

async function seedBalEmission() {
  const timestamps = await db
    .selectDistinct({ timestamp: poolSnapshots.timestamp })
    .from(poolSnapshots);

  for (const { timestamp } of timestamps) {
    if (!timestamp) continue;
    try {
      const weeklyBalEmission = balEmissions.weekly(dateToEpoch(timestamp));

      await db
        .insert(balEmission)
        .values({
          timestamp: timestamp,
          weekEmission: String(weeklyBalEmission),
        })
        .onConflictDoNothing()
        .execute();
    } catch (error) {
      console.error(`${error}`);
    }
  }
}

async function calculateApr() {
  // Fee APR
  logIfVerbose("Seeding Fee APR");
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

  // veBAL APR
  logIfVerbose("Seeding veBAL APR");
  await db.execute(sql`
INSERT INTO vebal_apr (timestamp, value, pool_external_id, external_id)
SELECT DISTINCT
    ps.timestamp,
    CASE
        WHEN ps.liquidity = 0 THEN 0
        ELSE (52 * (be.week_emission * gs.relative_weight * tp.price_usd) / ps.liquidity) * 100
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
}

async function fetchBalPrices() {
  try {
    // Get unique timestamps from pool_snapshots table

    const result = await db
      .selectDistinct({ timestamp: poolSnapshots.timestamp })
      .from(poolSnapshots)
      .orderBy(asc(poolSnapshots.timestamp));

    // Iterate over each timestamp
    for (const row of result) {
      const day = row.timestamp as Date;

      const utcMidnightTimestampOfCurrentDay = new Date(
        Date.UTC(
          day.getUTCFullYear(),
          day.getUTCMonth(),
          day.getUTCDate(),
          0,
          0,
          0,
          0,
        ),
      );

      // Fetch BAL price for the timestamp
      const prices = await DefiLlamaAPI.getHistoricalPrice(new Date(day), [
        "ethereum:0xba100000625a3754423978a60c9317c58a424e3d",
      ]);

      const entries = Object.entries(prices.coins);

      // Save prices to the tokenPrices table
      await addToTable(
        tokenPrices,
        entries.map((entry) => ({
          tokenAddress: entry[0].split(":")[1],
          priceUSD: entry[1].price,
          timestamp: utcMidnightTimestampOfCurrentDay,
          networkSlug: entry[0].split(":")[0],
        })),
      );

      console.log(`Fetched prices for tokens on ${day}:`, prices);
    }
  } catch (e) {
    // @ts-ignore
    console.error(`Failed to fetch prices: ${e.message}`);
  }
}

async function seedCalendar() {
  await db.execute(sql`
  INSERT INTO calendar (timestamp)
SELECT
	generate_series('2021-04-21'::timestamp, CURRENT_DATE, '1 day'::INTERVAL) AS "timestamp"`);
}

export async function runETLs() {
  logIfVerbose("Starting ETL processes");

  await Promise.all([
    seedCalendar(),
    seedVebalRounds(),
    seedBalEmission(),
    seedNetworks(),
  ]);

  await ETLPools();
  await ETLSnapshots();
  await ETLGauges();
  await fetchBalPrices();
  await ETLGaugesSnapshot();
  await calculateApr();
  logIfVerbose("Ended ETL processes");
  process.exit(0);
}

// runETLs();
