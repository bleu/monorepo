import { gql } from "graphql-tag";

export const internalBalance = gql`
  query InternalBalance($userAddress: ID!) {
    user(id: $userAddress) {
      id
      userInternalBalances {
        token
        balance
      }
    }
  }
`;

export const tokensInfo = gql`
  query InternalBalanceTokenInfo($tokenAddress: [ID!]) {
    tokens(where: { id_in: $tokenAddress }) {
      id
      symbol
      decimals
    }
  }
`;
