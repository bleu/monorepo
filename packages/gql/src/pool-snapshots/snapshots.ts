import { gql } from "graphql-tag";

export const PoolSnapshots = gql`
  query PoolSnaphot($pool: String, $timestamp: Int) {
    poolSnapshots(where: { pool: $pool, timestamp: $timestamp }) {
      pool {
        id
      }
      amounts
    }
  }
`;
