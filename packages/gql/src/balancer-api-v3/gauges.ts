import { gql } from "graphql-tag";

export const veBalGetVotingList = gql`
  query veBalGetVotingList {
    veBalGetVotingList {
      id
      address
      chain
      symbol
      type
      gauge {
        address
        isKilled
        addedTimestamp
      }
    }
  }
`;
