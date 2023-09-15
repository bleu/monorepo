import { gql } from "graphql-tag";

export const blocks = gql`
  query Blocks($timestamp_gte: BigInt, $timestamp_lt: BigInt) {
    blocks(
      first: 1
      orderBy: number
      orderDirection: asc
      where: { timestamp_gte: $timestamp_gte, timestamp_lt: $timestamp_lt }
    ) {
      number
    }
  }
`;
