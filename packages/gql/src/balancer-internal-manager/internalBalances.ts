import { gql } from "graphql-tag";

export const internalBalance = gql`
  query InternalBalance($userAddress: ID!) {
    user(id: $userAddress) {
      id
      userInternalBalances {
        tokenInfo {
          name
          symbol
          address
          decimals
        }
        balance
      }
    }
  }
`;
