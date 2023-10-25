import { gql } from "graphql-tag";

export const poolWhereOwner = gql`
  query PoolsWhereOwner($owner: Bytes!) {
    pools(where: { owner: $owner }) {
      poolType
      name
      id
      address
      tokens {
        symbol
        weight
      }
    }
  }
`;

export const poolWherePoolTypeInAndId = gql`
  query PoolsWherePoolTypeInAndId(
    $poolId: ID!
    $poolTypes: [String!] = [
      "Weighted"
      "ComposableStable"
      "Stable"
      "MetaStable"
      "Element"
      "LiquidityBootstrapping"
      "Linear"
      "GyroE"
    ]
  ) {
    pools(
      where: { poolType_in: $poolTypes, id: $poolId, totalLiquidity_gt: 0 }
      orderBy: totalLiquidity
      orderDirection: desc
    ) {
      id
      address
      name
      poolType
      symbol
      totalLiquidity
      tokens {
        symbol
      }
    }
  }
`;

export const poolWherePoolType = gql`
  query PoolsWherePoolType(
    $poolTypes: [String!] = [
      "Weighted"
      "ComposableStable"
      "Stable"
      "MetaStable"
      "Element"
      "LiquidityBootstrapping"
      "Linear"
      "GyroE"
    ]
  ) {
    pools(
      where: { poolType_in: $poolTypes, totalLiquidity_gt: 0 }
      orderBy: totalLiquidity
      orderDirection: desc
      first: 1000
    ) {
      id
      address
      name
      poolType
      symbol
      totalLiquidity
      tokens {
        symbol
      }
    }
  }
`;

export const poolSnapshotInRange = gql`
  query poolSnapshotInRange($poolId: String!, $timestamp: [Int!]) {
    poolSnapshots(
      where: { pool_in: [$poolId], timestamp_in: $timestamp }
      orderBy: timestamp
      orderDirection: desc
    ) {
      pool {
        id
        address
        name
        poolType
        symbol
        tokens {
          symbol
          balance
        }
      }
      amounts
      totalShares
      swapVolume
      protocolFee
      swapFees
      liquidity
      swapsCount
      holdersCount
      timestamp
    }
  }
`;

export const poolSnapshotInRangeToken = gql`
  query poolSnapshotInRangeToken($poolId: String!, $timestamp: [Int!]) {
    poolSnapshots(
      where: { pool_in: [$poolId], timestamp_in: $timestamp }
      orderBy: timestamp
      orderDirection: desc
    ) {
      pool {
        address
        owner
        poolType
        symbol
        swapFee
        totalLiquidity
        totalSwapVolume
        totalSwapFee
        protocolYieldFeeCache
        poolTypeVersion
        tokens {
          address
          symbol
          balance
          decimals
          priceRate
          weight
          isExemptFromYieldProtocolFee
        }
      }
      timestamp
    }
  }
`;

export const poolById = gql`
  query Pool($poolId: ID!) {
    pool(id: $poolId) {
      address
      owner
      poolType
      symbol
      swapFee
      totalLiquidity
      totalSwapVolume
      totalSwapFee
      protocolYieldFeeCache
      poolTypeVersion
      amp
      c
      s
      alpha
      beta
      sqrtAlpha
      sqrtBeta
      root3Alpha
      lambda
      tauAlphaX
      tauAlphaY
      tauBetaX
      tauBetaY
      delta
      epsilon
      u
      v
      w
      z
      dSq
      tokens {
        address
        symbol
        balance
        decimals
        priceRate
        weight
        isExemptFromYieldProtocolFee
        token {
          fxOracleDecimals
          latestFXPrice
        }
      }
    }
  }
`;

export const poolRateProviders = gql`
  query PoolRateProviders($poolId: ID!) {
    pool(id: $poolId) {
      priceRateProviders {
        token {
          address
          symbol
        }
        address
        rate
      }
    }
  }
`;

export const aprPools = gql`
  query APRPools(
    $skip: Int!
    $createdBefore: Int
    $limit: Int
    $minTvl: BigDecimal
    $maxTvl: BigDecimal
    $block: Int
  ) {
    pools(
      where: {
        createTime_lte: $createdBefore
        totalLiquidity_gte: $minTvl
        totalLiquidity_lte: $maxTvl
      }
      first: $limit
      skip: $skip
      block: { number: $block }
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
