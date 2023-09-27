/* eslint-disable no-console */
/* eslint-env node */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");

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
    throw new Error("Network response was not ok");
  }

  return response.json();
}

const ENDPOINT_V3 = "https://api-v3.balancer.fi/graphql";

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

const BASE_ENDPOINT_V2 =
  "https://api.thegraph.com/subgraphs/name/balancer-labs";
const EXISTING_NETWORKS = {
  Ethereum: `${BASE_ENDPOINT_V2}/balancer-v2`,
  Goerli: `${BASE_ENDPOINT_V2}/balancer-goerli-v2`,
  Polygon: `${BASE_ENDPOINT_V2}/balancer-polygon-v2`,
  PolygonZKEVM:
    "https://api.studio.thegraph.com/query/24660/balancer-polygon-zk-v2/version/latest",
  Arbitrum: `${BASE_ENDPOINT_V2}/balancer-arbitrum-v2`,
  Gnosis: `${BASE_ENDPOINT_V2}/balancer-gnosis-chain-v2`,
  Optimism: `${BASE_ENDPOINT_V2}/balancer-optimism-v2`,
  Base: "https://api.studio.thegraph.com/query/24660/balancer-base-v2/version/latest",
  Avalanche: `${BASE_ENDPOINT_V2}/balancer-avalanche-v2`,
};

const POOLS_WITHOUT_GAUGE_QUERY = `
query Pools($skip: Int!) {
  pools(
    where: { totalLiquidity_gt: 10000 }
    orderBy: totalLiquidity
    orderDirection: desc
    skip: $skip
  ) {
    id
    address
    symbol
    poolType
    createTime
    totalLiquidity
    tokens {
      address
      symbol
      weight
    }
  }
}
`;

async function main() {
  const response = await gql(ENDPOINT_V3, VOTING_GAUGES_QUERY);
  const votingGauges = response.data.veBalGetVotingList;
  const poolIds = [];

  for (const networkName in EXISTING_NETWORKS) {
    const networkEndpoint = EXISTING_NETWORKS[networkName];

    let skipValue = 0;
    let allPools = [];

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const response = await gql(networkEndpoint, POOLS_WITHOUT_GAUGE_QUERY, {
        skip: skipValue,
      });
      const pools = response.data.pools;
      if (pools.length === 0) {
        break;
      }
      for (const pool of pools) {
        poolIds.push(pool.id);
      }
      allPools = allPools.concat(pools);
      skipValue += 1000;
    }

    const fileName = `pools-${networkName.toLowerCase()}.json`;
    fs.writeFileSync(`src/data/${fileName}`, JSON.stringify(allPools));
    console.log(
      `File created for ${networkName} with ${allPools.length} pools: ${fileName}`,
    );
  }

  const votingGaugesFiltered = votingGauges.filter((pool) =>
    poolIds.includes(pool.id),
  );
  console.log(
    `File created pools with gauges with ${votingGaugesFiltered.length} pools`,
  );
  fs.writeFileSync(
    "src/data/voting-gauges.json",
    JSON.stringify(votingGaugesFiltered),
  );
}

main();
