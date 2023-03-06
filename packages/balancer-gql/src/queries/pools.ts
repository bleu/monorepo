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
