/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-env node */
// eslint-disable-next-line @typescript-eslint/no-var-requires
import "dotenv/config";

import { sql } from "drizzle-orm";
import { PgTable } from "drizzle-orm/pg-core";

import { gauges, pools, poolSnapshots, tokenPrices } from "#/db/schema";
import { DefiLlamaAPI } from "#/lib/defillama";

import { db } from "./src/db/index";

const BATCH_SIZE = 1_000;

const isVerbose = process.argv.includes("-v");

function logIfVerbose(message: string) {
  if (isVerbose) {
    console.log(message);
  }
}

async function gql(
  endpoint: string,
  query: string,
  variables = {},
  headers = {},
) {
  logIfVerbose(`Running GraphQL query on ${endpoint}`);

  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    console.log(response);
    throw new Error("Network response was not ok");
  }

  return response.json();
}

const ENDPOINT_V3 = "https://api-v3.balancer.fi/graphql";
const BASE_ENDPOINT_V2 =
  "https://api.thegraph.com/subgraphs/name/balancer-labs";

const NETWORK_TO_BALANCER_ENDPOINT_MAP = {
  ethereum: `${BASE_ENDPOINT_V2}/balancer-v2`,
  polygon: `${BASE_ENDPOINT_V2}/balancer-polygon-v2`,
  "polygon-zkevm":
    "https://api.studio.thegraph.com/query/24660/balancer-polygon-zk-v2/version/latest",
  arbitrum: `${BASE_ENDPOINT_V2}/balancer-arbitrum-v2`,
  gnosis: `${BASE_ENDPOINT_V2}/balancer-gnosis-chain-v2`,
  optimism: `${BASE_ENDPOINT_V2}/balancer-optimism-v2`,
  base: "https://api.studio.thegraph.com/query/24660/balancer-base-v2/version/latest",
  avalanche: `${BASE_ENDPOINT_V2}/balancer-avalanche-v2`,
} as const;

const VOTING_GAUGES_QUERY = `
query VeBalGetVotingList {
    veBalGetVotingList {
        chain
        id
        address
        symbol
        type
        gauge {
            address
            isKilled
            addedTimestamp
            relativeWeightCap
        }
        tokens {
            address
            logoURI
            symbol
            weight
        }
    }
}
`;

const POOLS_WITHOUT_GAUGE_QUERY = `
query PoolsWherePoolType($skip: Int!) {
  pools(
    orderBy: totalLiquidity
    orderDirection: desc
    first: 1000,
    skip: $skip
  ) {
    id
    address
    symbol
    poolType
    createTime
    protocolYieldFeeCache
    protocolSwapFeeCache
    poolTypeVersion
    tokens {
      isExemptFromYieldProtocolFee
      address
      symbol
      weight
    }
  }
}
`;

const POOLS_SNAPSHOTS = `
query PoolSnapshots($skip: Int!) {
  poolSnapshots(
    first: 1000,
    skip: $skip
  ) {
    id
    pool {
      id
    }
    amounts
    totalShares
    swapVolume
    protocolFee
    swapFees
    liquidity
    timestamp
  }
}
`;

function* chunks(arr: unknown[], n: number) {
  for (let i = 0; i < arr.length; i += n) {
    yield arr.slice(i, i + n);
  }
}

async function paginate<T>(
  initialSkip: number,
  step: number,
  fetchFn: (skip: number) => Promise<T | null>,
): Promise<void> {
  logIfVerbose(`Paginating from initialSkip=${initialSkip}, step=${step}`);

  let skipValue = initialSkip;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const data = await fetchFn(skipValue);

    if (!data || Object.keys(data).length === 0) {
      break;
    }

    skipValue += step;
  }
}

type ProcessFn<T> = (data: T) => Promise<void>;

async function paginatedFetch<T>(
  networkEndpoint: string,
  query: string,
  processFn: ProcessFn<T>,
  initialSkip = 0,
  step = BATCH_SIZE,
): Promise<void> {
  await paginate(initialSkip, step, async (skip: number) => {
    const response = await gql(networkEndpoint, query, { skip });
    if (response.data) {
      await processFn(response.data);
      return response.data;
    }

    return null;
  });
}

async function processPoolSnapshots(data: any, network: string) {
  logIfVerbose(`Processing pool snapshots for network ${network}`);

  if (data.poolSnapshots) {
    await addToTable(
      poolSnapshots,
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
FROM pool_snapshots
ON CONFLICT (external_id) DO NOTHING;
  `);

  await db.execute(sql`
  UPDATE pool_snapshots
SET
    amounts = raw_data->'amounts',
    total_shares = (raw_data->>'totalShares')::NUMERIC,
    swap_volume = (raw_data->>'swapVolume')::NUMERIC,
    swap_fees = (raw_data->>'swapFees')::NUMERIC,
    liquidity = (raw_data->>'liquidity')::NUMERIC,
    timestamp = to_timestamp((raw_data->>'timestamp')::BIGINT),
    external_id = raw_data->>'id',
    pool_external_id = raw_data->'pool'->>'id';
`);
}

async function transformPoolData() {
  // Transform the networks first
  await transformNetworks(pools, "network");

  // Insert data into the pools table
  await db.execute(sql`
  INSERT INTO pools (
    external_id, address, symbol, pool_type, external_created_at, network_slug,
    protocol_yield_fee_cache, protocol_swap_fee_cache, pool_type_version
  )
  SELECT 
    raw_data->>'id',
    raw_data->>'address',
    raw_data->>'symbol',
    raw_data->>'poolType',
    to_timestamp((raw_data->>'createTime')::BIGINT),
    LOWER(raw_data->>'network'),
    (raw_data->>'protocolYieldFeeCache')::NUMERIC, 
    (raw_data->>'protocolSwapFeeCache')::NUMERIC,
    (raw_data->>'poolTypeVersion')::NUMERIC
  FROM pools
  ON CONFLICT (external_id) DO UPDATE
  SET 
    address = excluded.address,
    symbol = excluded.symbol,
    pool_type = excluded.pool_type,
    external_created_at = excluded.external_created_at,
    network_slug = LOWER(excluded.network_slug),
    protocol_yield_fee_cache = excluded.protocol_yield_fee_cache,
    protocol_swap_fee_cache = excluded.protocol_swap_fee_cache,
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
  -- SQL Script to populate networks
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

async function fetchTokenPrices() {
  const remappings = {
    avalanche: "avax",
  };

  const inverseRemapping = {
    avax: "avalanche",
  };
  // Step 1: Fetch distinct tokens for each day
  const result = await db.execute(sql`
  SELECT DISTINCT
	pt.token_address,
	pt.network_slug,
	date_trunc('day', ps.timestamp) AS day
FROM
	pool_tokens pt
	INNER JOIN pool_snapshots ps ON pt.pool_external_id = ps.pool_external_id
	LEFT JOIN token_prices tp ON pt.token_address = tp.token_address
		AND pt.network_slug = tp.network_slug
		AND date_trunc('day', ps.timestamp) = date_trunc('day', tp.timestamp)
WHERE
	tp.id IS NULL
ORDER BY
	day,
	pt.token_address;
  `);

  // Step 2: Deduplicate tokens for the same day
  const dedupedTokens: { [day: string]: Set<string> } = {};

  for (const row of result) {
    const day = row.day.toISOString();
    if (!dedupedTokens[day]) {
      dedupedTokens[day] = new Set();
    }

    dedupedTokens[day].add(
      `${remappings[row.network_slug] ?? row.network_slug}:${
        row.token_address
      }`,
    );
  }

  // Step 3: Fetch token prices
  for (const [day, tokens] of Object.entries(dedupedTokens)) {
    const dateTimestamp = Date.UTC(
      Number(day.split("-")[0]),
      Number(day.split("-")[1]) - 1,
      Number(day.split("-")[2].split("T")[0]),
    );
    const tokenAddresses = Array.from(tokens);
    try {
      const prices = await DefiLlamaAPI.getHistoricalPrice(
        new Date(dateTimestamp),
        tokenAddresses,
      );

      const entries = Object.entries(prices.coins);

      await addToTable(
        tokenPrices,
        entries.map((entry) => ({
          tokenAddress: entry[0].split(":")[1],
          priceUSD: entry[1].price,
          timestamp: new Date(entry[1].timestamp * 1000),
          networkSlug:
            inverseRemapping[entry[0].split(":")[0]] ?? entry[0].split(":")[0],
        })),
      );

      console.log(`Fetched prices for tokens on ${day}:`, prices);
    } catch (e) {
      console.error(
        `Failed to fetch prices for tokens on ${day}: ${e.message}`,
      );
    }
  }
}

async function runETLs() {
  logIfVerbose("Starting ETL processes");

  await seedNetworks();
  await ETLPools();
  await ETLSnapshots();
  await ETLGauges();
  await fetchTokenPrices();
  // await fetchBlocks();
  logIfVerbose("Ended ETL processes");

  process.exit(0);
}

runETLs();
