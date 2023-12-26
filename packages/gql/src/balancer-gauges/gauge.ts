import { gql } from "graphql-tag";

export const gaugeSymbol = gql`
  query Gauge($gaugeId: ID!) {
    liquidityGauge(id: $gaugeId) {
      symbol
    }
  }
`;

export const poolsWithGauge = gql`
  query PreferentialGauge {
    pools(first: 1000, where: { gauges_: { gauge_not: null } }) {
      poolId
      gauges {
        id
      }
    }
  }
`;

export const gaugeInfo = gql`
  query PoolPreferentialGauge($poolId: Bytes!) {
    pools(where: { poolId_in: [$poolId], gauges_: { gauge_not: null } }) {
      id
      poolId
      preferentialGauge {
        id
      }
      gauges {
        gauge {
          liquidityGauge {
            id
            symbol
          }
        }
      }
    }
  }
`;
