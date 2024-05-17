import { gql } from "graphql-tag";

export const poolWhereOwner = gql`
  query pairsWhereTokens(
    $token0: String!
    $token1: String!
    $reserveUSDThreshold: BigDecimal!
  ) {
    pairs(
      where: {
        or: [
          {
            token0: $token0
            token1: $token1
            reserveUSD_gt: $reserveUSDThreshold
          }
          {
            token0: $token1
            token1: $token0
            reserveUSD_gt: $reserveUSDThreshold
          }
        ]
      }
      orderBy: reserveUSD
      orderDirection: desc
    ) {
      id
      reserveUSD
    }
  }
`;
