import { gql } from "graphql-tag";

export const gaugeSymbol = gql`
  query Gauge($gaugeId: ID!){
    liquidityGauge(id: $gaugeId) { 
      symbol 
    }
  }
`

