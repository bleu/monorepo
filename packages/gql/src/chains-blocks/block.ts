import { gql } from "graphql-tag";

export const blocks = gql`
  query Blocks($timestamp_gte: BigInt) {
    blocks(
      first: 1
      orderBy: number
      orderDirection: asc
      where: { timestamp_gte: $timestamp_gte }
    ) {
      number
    }
  }
`;
