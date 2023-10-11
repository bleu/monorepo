import { gql } from "graphql-tag";

export const poolRewards = gql`
  query PoolRewards($poolId: Bytes!) {
    rewardTokenDeposits(where: { rate_gt: 0, gauge_: { poolId: $poolId } }) {
      token {
        address
        symbol
      }
      gauge {
        totalSupply
      }
      rate
      periodStart
      periodFinish
    }
  }
`;
