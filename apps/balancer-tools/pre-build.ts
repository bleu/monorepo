/* eslint-disable no-console */
/* eslint-env node */
// eslint-disable-next-line @typescript-eslint/no-var-requires
import "dotenv/config";

import { sql } from "drizzle-orm";

import {
  gauges,
  pools,
  poolSnapshots
} from "#/db/schema";

import { db } from "./src/db/index";

async function gql(endpoint, query, variables = {}, headers = {}) {
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
const EXISTING_NETWORKS = {
  Ethereum: `${BASE_ENDPOINT_V2}/balancer-v2`,
  Polygon: `${BASE_ENDPOINT_V2}/balancer-polygon-v2`,
  PolygonZKEVM:
    "https://api.studio.thegraph.com/query/24660/balancer-polygon-zk-v2/version/latest",
  Arbitrum: `${BASE_ENDPOINT_V2}/balancer-arbitrum-v2`,
  Gnosis: `${BASE_ENDPOINT_V2}/balancer-gnosis-chain-v2`,
  Optimism: `${BASE_ENDPOINT_V2}/balancer-optimism-v2`,
  Base: "https://api.studio.thegraph.com/query/24660/balancer-base-v2/version/latest",
  Avalanche: `${BASE_ENDPOINT_V2}/balancer-avalanche-v2`,
};

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
    tokens {
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

function* chunks(arr, n) {
  for (let i = 0; i < arr.length; i += n) {
    yield arr.slice(i, i + n);
  }
}

async function paginate<T>(initialSkip: number, step: number, fetchFn: (skip: number) => Promise<T | null>): Promise<void> {
  let skipValue = initialSkip;
  while (true) {
    const data = await fetchFn(skipValue);

    if (!data || Object.keys(data).length === 0) {
      break;
    }

    skipValue += step;
  }
}

type ProcessFn<T> = (data: T) => Promise<void>;

async function paginatedFetch<T>(networkEndpoint: string, query: string, processFn: ProcessFn<T>, initialSkip = 0, step = 1000): Promise<void> {
  await paginate(initialSkip, step, async (skip: number) => {
    const response = await gql(networkEndpoint, query, { skip });

    if (response.data) {
      await processFn(response.data);
      return response.data;
    }

    return null;
  });
}

async function processPoolSnapshots(data, network) {
  if (data.poolSnapshots) {
    await addToTable(poolSnapshots, data.poolSnapshots.map((snapshot) => ({externalId: snapshot.id, rawData: { ...snapshot, network }})));
  }
}

async function processPools(data, network) {
  if (data.pools) {
    await addToTable(pools, data.pools.map((pool) => ({externalId: pool.id, rawData: { ...pool, network }})));
  }
}

async function processGauges(data) {
  if (data.veBalGetVotingList) {
    await addToTable(gauges, data.veBalGetVotingList.map((gauge) => ({ address: gauge.gauge.address, rawData: { ...gauge }})));
  }
}

async function extractPoolSnapshotsForNetwork(networkEndpoint, network) {
  await paginatedFetch(networkEndpoint, POOLS_SNAPSHOTS, (data) => processPoolSnapshots(data, network));
}

async function extractPoolsForNetwork(networkEndpoint, network) {
  await paginatedFetch(networkEndpoint, POOLS_WITHOUT_GAUGE_QUERY, (data) => processPools(data, network));
}

async function extractGauges() {
  const response = await gql(ENDPOINT_V3, VOTING_GAUGES_QUERY);
  await processGauges(response.data)
}

async function addToTable(table, items) {
  const chunkedItems = [...chunks(items, 1000)]
  return await Promise.all(chunkedItems.map(async (items) => {
    return await db.insert(table).values(items).onConflictDoNothing()
  }))
}

async function transformNetworks(table, key="network") {
  await db.execute(sql`
  INSERT INTO networks (slug)
SELECT raw_data->>'${sql.raw(key)}' FROM ${table}
ON CONFLICT (slug) DO NOTHING;
  `)
}

async function transformPoolSnapshotsData() {
  await transformNetworks(poolSnapshots, "network")

  await db.execute(sql`
  INSERT INTO pools (external_id, network_slug)
SELECT raw_data->'pool'->>'id', raw_data->>'network' FROM pool_snapshots
ON CONFLICT (external_id) DO NOTHING;
  `)

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
`)
}

async function transformPoolData() {
  // Transform the networks first
  await transformNetworks(pools, "network");

  // Insert data into the pools table
  await db.execute(sql`
    INSERT INTO pools (external_id, address, symbol, pool_type, external_created_at, network_slug)
    SELECT raw_data->>'id',
           raw_data->>'address',
           raw_data->>'symbol',
           raw_data->>'poolType',
           to_timestamp((raw_data->>'createTime')::BIGINT),
           raw_data->>'network'
    FROM pools
    ON CONFLICT (external_id) DO UPDATE
    SET address = excluded.address,
        symbol = excluded.symbol,
        pool_type = excluded.pool_type,
        external_created_at = excluded.external_created_at,
        network_slug = excluded.network_slug;
  `);

  // Insert data into the tokens table from the 'tokens' array in raw_data
  await db.execute(sql`
    INSERT INTO tokens (address, symbol, network_slug)
    SELECT jsonb_array_elements(raw_data::jsonb->'tokens')->>'address',
           jsonb_array_elements(raw_data::jsonb->'tokens')->>'symbol',
           raw_data->>'network'
    FROM pools
    ON CONFLICT (address, network_slug) DO NOTHING;
  `);

  // -- Insert data into pool_tokens table using a subquery
  await db.execute(sql`
      INSERT INTO pool_tokens (weight, pool_external_id, token_id)
      SELECT sub.weight,
             sub.external_id,
             tokens.id
      FROM (
          SELECT (jsonb_array_elements(raw_data::jsonb->'tokens')->>'weight')::NUMERIC as weight,
                 raw_data->>'id' as external_id,
                 jsonb_array_elements(raw_data::jsonb->'tokens')->>'address' as address
          FROM pools
      ) as sub
      JOIN tokens ON sub.address = tokens.address
      ON CONFLICT (pool_external_id, token_id) DO UPDATE
      SET weight = excluded.weight;
  `);
}

async function transformGauges() {
  await transformNetworks(gauges, "chain");

  // First, update the 'pools' table to make sure all the external_id values are there.
  await db.execute(sql`
    INSERT INTO pools (external_id, network_slug)
    SELECT raw_data->>'id', raw_data->>'chain'
    FROM gauges
    ON CONFLICT (external_id) DO NOTHING;
  `);

  // Then, insert or update the 'gauges' table.
  await db.execute(sql`
  UPDATE gauges
  SET
      is_killed = (raw_data->'gauge'->>'isKilled')::BOOLEAN,
      external_created_at = to_timestamp((raw_data->'gauge'->>'addedTimestamp')::BIGINT),
      pool_external_id = raw_data->>'id',
      network_slug = raw_data->>'chain'
  WHERE address = raw_data->'gauge'->>'address';
    `);
}

async function ETLGauges(){
  await extractGauges();
  await transformGauges()
}

async function ETLPools() {
  const networkNames = Object.keys(EXISTING_NETWORKS);
  await Promise.all(networkNames.map(async (networkName) => {
    const networkEndpoint = EXISTING_NETWORKS[networkName];
    await extractPoolsForNetwork(networkEndpoint, networkName);
  }));

  await transformPoolData();
}

async function ETLSnapshots() {
  const networkNames = Object.keys(EXISTING_NETWORKS);
  await Promise.all(networkNames.map(async (networkName) => {
    const networkEndpoint = EXISTING_NETWORKS[networkName];
    await extractPoolSnapshotsForNetwork(networkEndpoint, networkName);
  }));

  await transformPoolSnapshotsData();
}

async function seedNetworks() {
  return await db.execute(sql`
  -- SQL Script to populate networks
INSERT INTO networks (slug, chain_id) VALUES
('Ethereum', 1),
('Polygon', 137),
('Arbitrum', 42161),
('Gnosis', 100),
('Optimism', 10),
('Goerli', 5),
('Sepolia', 11155111),
('PolygonZKEVM', 1101),
('Base', 8453),
('Avalanche', 43114)
ON CONFLICT (slug)
DO UPDATE SET chain_id = EXCLUDED.chain_id, updated_at = NOW();
`)
}

  async function runETLs() {
    await seedNetworks();
    await ETLPools();
    await ETLSnapshots();
    await ETLGauges();
}

runETLs();
