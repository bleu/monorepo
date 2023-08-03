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
    pools(where: { poolType_in: $poolTypes, id: $poolId }) {
      id
      address
      name
      poolType
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
    pools(where: { poolType_in: $poolTypes }) {
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

export const poolById = gql`
  query Pool($poolId: ID!) {
    pool(id: $poolId) {
      address
      owner
      poolType
      symbol
      swapFee
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
      }
    }
  }
`;
