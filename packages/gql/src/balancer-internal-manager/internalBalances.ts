import { gql } from "graphql-tag";

export const internalBalance = gql`
  query InternalBalance($userAddress: ID!) {
    user(id: $userAddress) {
      id
      userInternalBalances(where: { balance_gt: 0 }) {
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

export const singleInternalBalance = gql`
  query SingleInternalBalance($userAddress: ID!, $tokenAddress: Bytes!) {
    user(id: $userAddress) {
      id
      userInternalBalances(where: { token: $tokenAddress }) {
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
