/* eslint-disable @typescript-eslint/no-explicit-any */
import { NETWORK_TO_BALANCER_ENDPOINT_MAP } from "../../../config";
import { pools } from "../../../db/schema";
import { addToTable, logIfVerbose, networkNames } from "../../../index";
import { paginatedFetch } from "../../../paginatedFetch";

export const POOLS_WITHOUT_GAUGE_QUERY = `
query PoolsWherePoolType($latestId: String!) {
  pools(
    first: 1000,
    where: {
      id_gt: $latestId,
    }
  ) {
    id
    address
    symbol
    poolType
    createTime
    poolTypeVersion
    tokens {
      isExemptFromYieldProtocolFee
      address
      symbol
      weight
      index
    }
  }
}
`;

export async function extractPools() {
  logIfVerbose("Starting Pools Extraction");

  return await Promise.all(
    networkNames.map(async (networkName) => {
      const networkEndpoint = NETWORK_TO_BALANCER_ENDPOINT_MAP[networkName];
      await extractPoolsForNetwork(networkEndpoint, networkName);
    }),
  );
}

export async function extractPoolsForNetwork(
  networkEndpoint: string,
  network: string,
) {
  await paginatedFetch(networkEndpoint, POOLS_WITHOUT_GAUGE_QUERY, (data) =>
    processPools(data, network),
  );
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
