export const ENDPOINT_V3 = "https://api-v3.balancer.fi/graphql";
const BASE_ENDPOINT_V2 =
  "https://api.thegraph.com/subgraphs/name/balancer-labs";
export const NETWORK_TO_BALANCER_ENDPOINT_MAP = {
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
export const VOTING_GAUGES_QUERY = `
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
export const POOLS_SNAPSHOTS = `
query PoolSnapshots($latestId: String!) {
  poolSnapshots(
    first: 1000,
    where: {
      id_gt: $latestId,
    }
  ) {
    id
    pool {
      id
      protocolYieldFeeCache
      protocolSwapFeeCache
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

export const RATE_PROVIDER_SNAPSHOTS = `
query PoolRateProviders($latestId: String!) {
  priceRateProviders(
    first: 1000,
    where: {
      id_gt: $latestId,
    }
  ) {
    id
    poolId {
      id
    }
    token {
      address
    }
    address
  }
}
`;
