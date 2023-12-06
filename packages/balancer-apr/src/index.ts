/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-env node */
// eslint-disable-next-line @typescript-eslint/no-var-requires
import "dotenv/config";

import { dateToEpoch, epochToDate } from "@bleu-fi/utils/date";
import { and, asc, eq, gt, inArray, isNotNull, ne, sql } from "drizzle-orm";
import { PgTable } from "drizzle-orm/pg-core";
import { Address, zeroAddress } from "viem";

import { chunks } from "./chunks";
import {
  ENDPOINT_V3,
  NETWORK_TO_BALANCER_ENDPOINT_MAP,
  NETWORK_TO_REWARDS_ENDPOINT_MAP,
  POOL_REWARDS,
  POOLS_SNAPSHOTS,
  POOLS_WITHOUT_GAUGE_QUERY,
  RATE_PROVIDER_SNAPSHOTS,
  VOTING_GAUGES_QUERY,
} from "./config";
import { db } from "./db/index";
import {
  balEmission,
  blocks,
  calendar,
  gauges,
  gaugeSnapshots,
  poolRewards,
  pools,
  poolSnapshots,
  poolSnapshotsTemp,
  poolTokenRateProviders,
  poolTokenRateProvidersSnapshot,
  poolTokens,
  poolTokenWeightsSnapshot,
  tokenPrices,
  vebalRounds,
} from "./db/schema";
import { gql } from "./gql";
import * as balEmissions from "./lib/balancer/emissions";
import { DefiLlamaAPI } from "./lib/defillama";
import { getRates } from "./lib/getRates";
import { getPoolRelativeWeights } from "./lib/getRelativeWeight";
import { paginatedFetch } from "./paginatedFetch";
import { vunerabilityAffecteRateProviders } from "./vunerabilityAffectedPool";

export const BATCH_SIZE = 1_000;
const BALANCER_START_DATE = "2021-04-21";

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

async function processPoolRewards(data: any, network: string) {
  logIfVerbose(`Processing pool rewards for network ${network}`);

  if (data.rewardTokenDeposits) {
    await addToTable(
      poolRewards,
      data.rewardTokenDeposits.map((rewards: any) => ({
        externalId: rewards.id,
        rawData: { ...rewards, network },
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

async function processPoolRateProvider(data: any, network: string) {
  logIfVerbose(`Processing pool rate provider for network ${network}`);

  if (data.priceRateProviders) {
    // First, update the 'pools' table to make sure all the external_id values are there.
    await addToTable(
      pools,
      data.priceRateProviders
        .filter(
          (priceRateProvider: any) => priceRateProvider.address !== zeroAddress,
        )
        .map((priceRateProviders: any) => ({
          externalId: priceRateProviders.poolId.id,
          networkSlug: network,
        })),
    );

    await addToTable(
      poolTokenRateProviders,
      data.priceRateProviders
        .filter(
          (priceRateProvider: any) => priceRateProvider.address !== zeroAddress,
        )
        .map((priceRateProviders: any) => ({
          externalId: priceRateProviders.id + "-" + network,
          address: priceRateProviders.address,
          vulnerabilityAffected: vunerabilityAffecteRateProviders.some(
            ({ address }) =>
              address.toLowerCase() ===
              priceRateProviders.token.address.toLowerCase(),
          ),
          poolExternalId: priceRateProviders.poolId.id,
          tokenAddress: priceRateProviders.token.address,
          networkSlug: network,
          rawData: { ...priceRateProviders, network },
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

async function extractRewardsForNetwork(
  networkEndpoint: string,
  network: string,
) {
  await paginatedFetch(networkEndpoint, POOL_REWARDS, (data) =>
    processPoolRewards(data, network),
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

async function extractPoolRateProvider(
  networkEndpoint: string,
  network: string,
) {
  await paginatedFetch(networkEndpoint, RATE_PROVIDER_SNAPSHOTS, (data) =>
    processPoolRateProvider(data, network),
  );
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

async function extractPoolRateProviderSnapshot(network: string) {
  logIfVerbose("Starting Pool Rate Provider Snapshot Extraction");
  const distinctRateProviders = await db
    .selectDistinct({
      rateProviderAddress: poolTokenRateProviders.address,
      networkSlug: poolTokenRateProviders.networkSlug,
      vunerabilityAffected: poolTokenRateProviders.vulnerabilityAffected,
    })
    .from(poolTokenRateProviders)
    .where(eq(poolTokenRateProviders.networkSlug, network));

  const blocksTimestamp = await db
    .select({
      blockNumber: blocks.number,
      timestamp: blocks.timestamp,
    })
    .from(blocks)
    .leftJoin(calendar, eq(calendar.timestamp, blocks.timestamp))
    .where(eq(blocks.networkSlug, network))
    .orderBy(asc(blocks.number));

  const blocksNumberArraySinceBalStartDate = blocksTimestamp.map((item) => {
    return {
      blockNumber: item.blockNumber as number,
      timestamp: item.timestamp as Date,
    };
  });

  const filterBlocksByDate = (
    blocks: { timestamp: Date; blockNumber: number }[],
    startDate: Date | null,
    cutDirection: "before" | "after",
  ) => {
    if (!startDate) return blocks;
    return cutDirection === "before"
      ? blocks.filter(
          ({ timestamp }) => timestamp.getTime() < startDate.getTime(),
        )
      : blocks.filter(
          ({ timestamp }) => timestamp.getTime() > startDate.getTime(),
        );
  };
  const blocksNumberArrayChainNode = filterBlocksByDate(
    blocksNumberArraySinceBalStartDate,
    new Date("2023-02-10"),
    "after",
  );

  const blocksNumberArrayUntilEulerVunerability = filterBlocksByDate(
    blocksNumberArrayChainNode,
    new Date("2023-03-13"),
    "before",
  );

  const blocksNumberArrayUntilBalVunerability = filterBlocksByDate(
    blocksNumberArrayChainNode,
    new Date("2023-08-22"),
    "before",
  );

  const rateProviderAddressBlocksTuplesPromise: Promise<
    [Address, string, { blockNumber: number; timestamp: Date }[]][]
  > = Promise.all(
    distinctRateProviders.map(
      async ({ rateProviderAddress, networkSlug, vunerabilityAffected }) => {
        const poolsStartDate = await db
          .select({
            createdAt: pools.externalCreatedAt,
          })
          .from(pools)
          .leftJoin(
            poolTokenRateProviders,
            eq(poolTokenRateProviders.poolExternalId, pools.externalId),
          )
          .where(
            and(
              eq(poolTokenRateProviders.address, String(rateProviderAddress)),
              eq(poolTokenRateProviders.networkSlug, String(networkSlug)),
            ),
          );
        const poolsStartDateArray = poolsStartDate.map((item) => {
          return item.createdAt as Date;
        });

        const minStartDate = poolsStartDateArray.reduce(
          (min, current) => (min < current ? min : current),
          poolsStartDateArray[0],
        );
        const isBbPool =
          !!vunerabilityAffecteRateProviders
            .find(
              ({ address }) =>
                address.toLowerCase() === rateProviderAddress!.toLowerCase(),
            )
            ?.symbol.includes("bb-e") || false;
        const vulnerabilityBlocksArray =
          vunerabilityAffected && isBbPool
            ? filterBlocksByDate(
                blocksNumberArrayUntilEulerVunerability,
                minStartDate,
                "after",
              )
            : vunerabilityAffected
              ? filterBlocksByDate(
                  blocksNumberArrayUntilBalVunerability,
                  minStartDate,
                  "after",
                )
              : filterBlocksByDate(
                  blocksNumberArrayChainNode,
                  minStartDate,
                  "after",
                );
        return [
          rateProviderAddress as Address,
          networkSlug as string,
          vulnerabilityBlocksArray as {
            blockNumber: number;
            timestamp: Date;
          }[],
        ];
      },
    ),
  );
  const rateProviderAddressBlocksTuples =
    await rateProviderAddressBlocksTuplesPromise;

  for (const [
    rateProviderAddress,
    networkSlug,
    blocksNumberArray,
  ] of rateProviderAddressBlocksTuples) {
    const rateProviderTuples: [Address, string, number, Date][] =
      blocksNumberArray.map(({ blockNumber, timestamp }) => [
        rateProviderAddress as Address,
        networkSlug as string,
        blockNumber as number,
        timestamp as Date,
      ]);

    logIfVerbose(
      `Fetching ${rateProviderTuples.length} rates for ${rateProviderAddress} on ${networkSlug}`,
    );
    try {
      const rates = await getRates(rateProviderTuples);

      for (const [address, network, block, timestamp, rate] of rates) {
        db.insert(poolTokenRateProvidersSnapshot)
          .values({
            rateProviderAddress: address,
            networkSlug: network,
            blockNumber: block,
            rate: String(rate),
            externalId: `${address}-${network}-${block}`,
            timestamp,
          })
          .onConflictDoNothing()
          .execute();
      }

      await new Promise((resolve) => setTimeout(resolve, 5000));
    } catch (error) {
      console.error(
        `error fetching rate for ${rateProviderAddress}, from ${
          blocksNumberArray[0].timestamp
        } to ${
          blocksNumberArray[blocksNumberArray.length - 1].timestamp
        } : ${error}`,
      );
    }
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

async function ETLPoolRewards() {
  logIfVerbose("Starting Pool Rewards Extraction");
  await Promise.all(
    networkNames.map(async (networkName) => {
      const networkEndpoint = NETWORK_TO_REWARDS_ENDPOINT_MAP[networkName];
      await extractRewardsForNetwork(networkEndpoint, networkName);
    }),
  );
}

async function ETLPoolRateProvider() {
  logIfVerbose("Starting Rate Provider Extraction");
  await Promise.all(
    networkNames.map(async (networkName) => {
      const networkEndpoint = NETWORK_TO_BALANCER_ENDPOINT_MAP[networkName];
      await extractPoolRateProvider(networkEndpoint, networkName);
    }),
  );
}

async function ETLPoolRateProviderSnapshot() {
  logIfVerbose("Starting Pool Rate Provider Snapshot Extraction");
  await Promise.all(
    networkNames.map(async (networkName) => {
      await extractPoolRateProviderSnapshot(networkName);
    }),
  );
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

  //Token Yield APR
  logIfVerbose("Seeding Token Yield APR for weighted pools");

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

  logIfVerbose("Seeding Token Yield APR for non-weighted pools");

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
  AND ptw.weight IS NOT NULL
  ON CONFLICT (external_id) DO NOTHING;
  `);
}

async function fetchBalPrices() {
  await fetchTokenPrice(
    "ethereum",
    "0xba100000625a3754423978a60c9317c58a424e3d",
    new Date(BALANCER_START_DATE),
  );
}

async function fetchTokenPrice(
  network: string,
  tokenAddresses: string,
  start: Date,
) {
  const remappings: { [key: string]: string } = {
    avalanche: "avax",
  };

  const inverseRemapping: { [key: string]: string } = {
    avax: "avalanche",
  };
  try {
    const prices = await DefiLlamaAPI.getHistoricalPrice(
      start,
      `${remappings[network] ?? network}:${tokenAddresses}`,
    );
    const pricesArray = Object.values(prices.coins)[0]?.prices;

    await addToTable(
      tokenPrices,
      pricesArray.map((entry) => {
        const [networkSlug, tokenAddress] = Object.keys(prices.coins)[0].split(
          ":",
        );
        const timestamp = new Date(
          epochToDate(entry.timestamp).setUTCHours(0, 0, 0, 0),
        );

        return {
          tokenAddress,
          networkSlug: inverseRemapping[networkSlug] ?? networkSlug,
          priceUSD: entry.price,
          timestamp,
        };
      }),
    );
    console.log(`Fetched prices for BAL since ${start}:`);
  } catch (e) {
    console.error(
      // @ts-ignore
      `Failed to fetch prices for ${tokenAddresses} on ${network}: ${e.message}`,
    );
  }
}

async function fetchTokenPrices() {
  logIfVerbose("Start fetching token prices process");
  const tokensFromRateProviders = await db
    .selectDistinct({
      tokenAddress: poolTokenRateProviders.tokenAddress,
      networkSlug: poolTokenRateProviders.networkSlug,
      createdAt: pools.externalCreatedAt,
    })
    .from(poolTokenRateProviders)
    .leftJoin(
      pools,
      eq(pools.externalId, poolTokenRateProviders.poolExternalId),
    )
    .where(
      ne(poolTokenRateProviders.tokenAddress, poolTokenRateProviders.address),
    );

  const tokenWithMinCreationDates = Object.values(
    tokensFromRateProviders.reduce(
      (acc, { tokenAddress, networkSlug, createdAt }) => {
        const key = `${tokenAddress}_${networkSlug}`;

        if (!acc[key]) {
          acc[key] = {
            tokenAddress: tokenAddress as string,
            networkSlug: networkSlug as string,
            createdAt: createdAt ? [createdAt] : [],
          };
        } else {
          if (createdAt) {
            acc[key].createdAt.push(createdAt);
            const minDate = acc[key].createdAt.reduce(
              (min, current) => (min < current ? min : current),
              acc[key].createdAt[0],
            );
            acc[key].createdAt = [minDate];
          }
        }

        return acc;
      },
      {} as Record<
        string,
        { tokenAddress: string; networkSlug: string; createdAt: Date[] }
      >,
    ),
  );

  for (const {
    tokenAddress,
    networkSlug,
    createdAt,
  } of tokenWithMinCreationDates) {
    if (!tokenAddress || !networkSlug) continue;
    logIfVerbose(
      `Fetching token price for ${tokenAddress} on ${networkSlug} since ${createdAt[0].toISOString()}`,
    );
    try {
      await fetchTokenPrice(networkSlug, tokenAddress, new Date(createdAt[0]));
      logIfVerbose(
        `token price for ${tokenAddress} on ${networkSlug} finished`,
      );
    } catch (error) {
      // console.error(`${error}`);
    }
  }
}

async function calculateTokenWeightSnapshots() {
  const tokensFromRateProvider = await db
    .selectDistinct({
      tokenAddress: poolTokenRateProviders.tokenAddress,
      rateProviderAddress: poolTokenRateProvidersSnapshot.rateProviderAddress,
      poolExternalId: poolTokenRateProviders.poolExternalId,
    })
    .from(poolTokenRateProvidersSnapshot)
    .leftJoin(
      poolTokenRateProviders,
      eq(
        poolTokenRateProviders.address,
        poolTokenRateProvidersSnapshot.rateProviderAddress,
      ),
    )
    .leftJoin(
      pools,
      eq(pools.externalId, poolTokenRateProviders.poolExternalId),
    )
    .where(ne(pools.poolType, "Weighted"));

  const poolsIds = tokensFromRateProvider.map(
    ({ poolExternalId }) => poolExternalId as string,
  );

  const tokensAddresses = tokensFromRateProvider.map(
    ({ tokenAddress }) => tokenAddress as string,
  );

  const tokensfromPools = await db
    .select({
      tokenIndex: poolTokens.tokenIndex,
      tokenAddress: poolTokens.tokenAddress,
      poolExternalId: poolTokens.poolExternalId,
      externalCreatedAt: pools.externalCreatedAt,
    })
    .from(poolTokens)
    .leftJoin(pools, eq(pools.externalId, poolTokens.poolExternalId))
    .where(
      and(
        inArray(poolTokens.poolExternalId, poolsIds),
        ne(poolTokens.tokenAddress, pools.address),
      ),
    );

  const tokensGroupedByPool: {
    poolExternalId: string;
    externalCreatedAt: Date;
    tokens: {
      tokenIndex: number;
      tokenAddress: string;
    }[];
  }[] = tokensfromPools.reduce(
    (
      result: {
        poolExternalId: string;
        externalCreatedAt: Date;
        tokens: {
          tokenIndex: number;
          tokenAddress: string;
        }[];
      }[],
      item,
    ) => {
      const existingGroup = result.find(
        (group) => group.poolExternalId === item.poolExternalId,
      );

      if (existingGroup) {
        existingGroup.tokens.push({
          tokenIndex: item.tokenIndex as number,
          tokenAddress: item.tokenAddress as string,
        });
      } else {
        result.push({
          poolExternalId: item.poolExternalId as string,
          externalCreatedAt: item.externalCreatedAt as Date,
          tokens: [
            {
              tokenIndex: item.tokenIndex as number,
              tokenAddress: item.tokenAddress as string,
            },
          ],
        });
      }

      return result;
    },
    [],
  );

  const tokensPricesExists = await db
    .selectDistinct({
      tokenAddress: tokenPrices.tokenAddress,
    })
    .from(tokenPrices)
    .where(and(inArray(tokenPrices.tokenAddress, tokensAddresses)));

  const poolsWithTokenPrices = tokensGroupedByPool.filter((group) =>
    group.tokens.every((token) =>
      tokensPricesExists.some(
        ({ tokenAddress }) => tokenAddress === token.tokenAddress,
      ),
    ),
  );

  const poolExternalIds = poolsWithTokenPrices.map(
    ({ poolExternalId }) => poolExternalId,
  );
  const weightResults: {
    timestamp: Date;
    token: string;
    pool_external_id: string;
    token_index: number;
    value: string;
    total_liquidity: string;
    weight: string;
  }[] = await db.execute(sql`
  WITH distinct_rate_providers AS (
    SELECT DISTINCT pool_rate_providers.address
    FROM pool_rate_providers
  ),
  token_values AS (
    SELECT DISTINCT ON (ps.timestamp, ps.pool_external_id, pt.token_address)
      ps.timestamp,
      pt.token_address AS token,
      ps.pool_external_id,
      (ps.amounts->>pt.token_index)::NUMERIC as amount,
      pt.token_index,
      tp.price_usd,
      CAST(tp.price_usd AS NUMERIC) * (ps.amounts->>pt.token_index)::NUMERIC AS value
    FROM pool_snapshots as ps
      LEFT JOIN pool_rate_providers ON pool_rate_providers.pool_external_id = ps.pool_external_id
      LEFT JOIN pools p ON p.external_id = ps.pool_external_id
      LEFT JOIN blocks b ON b.network_slug = p.network_slug AND b.timestamp = ps.timestamp
      LEFT JOIN pool_tokens pt ON ps.pool_external_id = pt.pool_external_id
      LEFT JOIN token_prices tp ON pt.token_address = tp.token_address AND ps."timestamp" = tp."timestamp"
    WHERE
    ps.pool_external_id IN (${sql.raw(
      poolExternalIds.map((id) => `'${id}'`).join(", "),
    )})
      AND tp.price_usd IS NOT NULL
      AND (ps.amounts->>pt.token_index) IS NOT NULL
  ),
  total_liquidity AS (
    SELECT
      tv.pool_external_id,
      tv.timestamp,
      SUM(tv.value) AS total_liquidity
    FROM token_values tv
    GROUP BY tv.pool_external_id, tv.timestamp
  )
  SELECT
    tv.timestamp,
    tv.token,
    tv.pool_external_id,
    tv.token_index,
    tv.value,
    tl.total_liquidity,
    tv.value / tl.total_liquidity AS weight
  FROM token_values tv
  JOIN total_liquidity tl ON tv.pool_external_id = tl.pool_external_id AND tv.timestamp = tl.timestamp
  WHERE tl.total_liquidity > 0
`);

  await addToTable(
    poolTokenWeightsSnapshot,
    weightResults.map((item) => {
      const utcMidnightTimestampOfCurrentDay = new Date(
        Date.UTC(
          item.timestamp.getUTCFullYear(),
          item.timestamp.getUTCMonth(),
          item.timestamp.getUTCDate(),
          0,
          0,
          0,
          0,
        ),
      );
      return {
        timestamp: utcMidnightTimestampOfCurrentDay,
        tokenAddress: item.token,
        poolExternalId: item.pool_external_id,
        weight: item.weight,
        externalId: `${item.pool_external_id}-${
          item.token
        }-${utcMidnightTimestampOfCurrentDay.toISOString()}`,
      };
    }),
  );
}

async function fetchBlocks() {
  logIfVerbose("Fetching blocks");
  await Promise.all(
    networkNames.map(async (networkName) => {
      logIfVerbose(`Fetching blocks for ${networkName}`);
      const timestamps = await db
        .selectDistinct({ timestamp: poolSnapshots.timestamp })
        .from(poolSnapshots)
        .leftJoin(pools, eq(pools.externalId, poolSnapshots.poolExternalId))
        .where(eq(pools.networkSlug, networkName));

      for (const { timestamp } of timestamps) {
        if (!timestamp) continue;

        try {
          const blockResult = await DefiLlamaAPI.findBlockNumber(
            networkName,
            dateToEpoch(timestamp),
          );

          await db
            .insert(blocks)
            .values({
              timestamp: timestamp,
              number: blockResult,
              networkSlug: networkName,
              externalId: `${networkName}-${timestamp.toISOString()}`,
            })
            .onConflictDoNothing()
            .execute();
        } catch (error) {
          console.error(`${error}`);
        }
      }
    }),
  );
}

async function seedCalendar() {
  await db.execute(sql`
  INSERT INTO calendar (timestamp)
SELECT
	generate_series('${sql.raw(
    BALANCER_START_DATE,
  )}'::timestamp, CURRENT_DATE, '1 day'::INTERVAL) AS "timestamp"
  ON CONFLICT (timestamp) DO NOTHING;
  `);
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
  await ETLPoolRewards();
  await fetchBalPrices();
  await ETLGaugesSnapshot();
  await fetchBlocks();
  await ETLPoolRateProvider();
  await ETLPoolRateProviderSnapshot();
  await fetchTokenPrices();
  await calculateTokenWeightSnapshots();
  await calculateApr();
  logIfVerbose("Ended ETL processes");
  process.exit(0);
}

runETLs();
