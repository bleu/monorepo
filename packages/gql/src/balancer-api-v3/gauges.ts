import { gql } from "graphql-tag";

export const veBalGetVotingList = gql`
  query veBalGetVotingList {
    veBalGetVotingList {
      address
      chain
      symbol
      type
      gauge {
        address
        isKilled
      }
    }
  }
`;
