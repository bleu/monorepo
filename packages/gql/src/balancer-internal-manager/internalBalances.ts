import { gql } from "graphql-tag";

export const internalBalance = gql`
  query InternalBalance($userAddress: ID!) {
    user(id: $userAddress) {
      id
      userInternalBalances {
        tokenInfo {
          symbol
          address
          decimals
        }
        balance
      }
    }
  }
`;
