import { gql } from "graphql-tag";

export const poolWhereOwner = gql`
  query Pools($owner: Bytes!) {
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

export const poolSymbol = gql`
  query Pool($poolId: ID!) {
    pool(id: $poolId) {
      symbol
    }
  }
`;

export const poolOwner = gql`
  query PoolOwner($poolId: ID!) {
    pool(id: $poolId) {
      owner
    }
  }
`;
