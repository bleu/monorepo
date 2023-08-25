import { gql } from "graphql-tag";

export const PoolSnapshots = gql`
  query PoolSnapshot($pool: String, $timestamp: Int) {
    poolSnapshots(where: { pool: $pool, timestamp_gte: $timestamp }) {
      pool {
        id
      }
      amounts
    }
  }
`;
