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
  query Pool($poolID: ID!) {
    pool(id: $poolID) { symbol }
  }
`
