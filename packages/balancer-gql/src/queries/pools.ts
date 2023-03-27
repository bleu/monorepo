import { gql } from "graphql-tag";

export const poolWhereOwner = gql`
  query Pool($owner: Bytes!) {
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

export const poolExists = gql`
  query PoolExists($poolAddress: ID!) {
    pool(id: $poolAddress) { symbol }
  }
`
