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

export const poolById = gql`
  query Pool($poolId: ID!) {
    pool(id: $poolId) {
      address
      owner
      poolType
      symbol
      swapFee
      amp
      tokens {
        symbol
        balance
        decimals
        priceRate
      }
    }
  }
`;
