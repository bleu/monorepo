import { GraphQLClient } from 'graphql-request';
import { GraphQLClientRequestHeaders } from 'graphql-request/build/cjs/types';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigInt: { input: any; output: any; }
};

export type Query = {
  __typename?: 'Query';
  swap?: Maybe<Swap>;
  swaps: Array<Swap>;
  token?: Maybe<Token>;
  tokens: Array<Token>;
  transaction?: Maybe<Transaction>;
  transactions: Array<Transaction>;
  user?: Maybe<User>;
  users: Array<User>;
};


export type QuerySwapArgs = {
  id: Scalars['String']['input'];
  timestamp?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerySwapsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  timestamp?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<SwapFilter>;
};


export type QueryTokenArgs = {
  id: Scalars['String']['input'];
  timestamp?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryTokensArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  timestamp?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<TokenFilter>;
};


export type QueryTransactionArgs = {
  id: Scalars['String']['input'];
  timestamp?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryTransactionsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  timestamp?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<TransactionFilter>;
};


export type QueryUserArgs = {
  id: Scalars['String']['input'];
  timestamp?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryUsersArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  timestamp?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<UserFilter>;
};

export type Swap = {
  __typename?: 'Swap';
  Transaction: Scalars['String']['output'];
  TransactionId: Scalars['String']['output'];
  chainId: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  orderContract: Scalars['String']['output'];
  priceChecker: Scalars['String']['output'];
  priceCheckerData: Scalars['String']['output'];
  to: Scalars['String']['output'];
  tokenAmountIn: Scalars['BigInt']['output'];
  tokenIn: Token;
  tokenInId: Scalars['String']['output'];
  tokenOut: Token;
  tokenOutId: Scalars['String']['output'];
};

export type SwapFilter = {
  Transaction?: InputMaybe<Scalars['String']['input']>;
  TransactionId?: InputMaybe<Scalars['String']['input']>;
  TransactionId_contains?: InputMaybe<Scalars['String']['input']>;
  TransactionId_ends_with?: InputMaybe<Scalars['String']['input']>;
  TransactionId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  TransactionId_not?: InputMaybe<Scalars['String']['input']>;
  TransactionId_not_contains?: InputMaybe<Scalars['String']['input']>;
  TransactionId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  TransactionId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  TransactionId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  TransactionId_starts_with?: InputMaybe<Scalars['String']['input']>;
  Transaction_contains?: InputMaybe<Scalars['String']['input']>;
  Transaction_ends_with?: InputMaybe<Scalars['String']['input']>;
  Transaction_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  Transaction_not?: InputMaybe<Scalars['String']['input']>;
  Transaction_not_contains?: InputMaybe<Scalars['String']['input']>;
  Transaction_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  Transaction_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  Transaction_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  Transaction_starts_with?: InputMaybe<Scalars['String']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  chainId_gt?: InputMaybe<Scalars['Int']['input']>;
  chainId_gte?: InputMaybe<Scalars['Int']['input']>;
  chainId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  chainId_lt?: InputMaybe<Scalars['Int']['input']>;
  chainId_lte?: InputMaybe<Scalars['Int']['input']>;
  chainId_not?: InputMaybe<Scalars['Int']['input']>;
  chainId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_starts_with?: InputMaybe<Scalars['String']['input']>;
  orderContract?: InputMaybe<Scalars['String']['input']>;
  orderContract_contains?: InputMaybe<Scalars['String']['input']>;
  orderContract_ends_with?: InputMaybe<Scalars['String']['input']>;
  orderContract_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  orderContract_not?: InputMaybe<Scalars['String']['input']>;
  orderContract_not_contains?: InputMaybe<Scalars['String']['input']>;
  orderContract_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  orderContract_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  orderContract_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  orderContract_starts_with?: InputMaybe<Scalars['String']['input']>;
  priceChecker?: InputMaybe<Scalars['String']['input']>;
  priceCheckerData?: InputMaybe<Scalars['String']['input']>;
  priceCheckerData_contains?: InputMaybe<Scalars['String']['input']>;
  priceCheckerData_ends_with?: InputMaybe<Scalars['String']['input']>;
  priceCheckerData_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  priceCheckerData_not?: InputMaybe<Scalars['String']['input']>;
  priceCheckerData_not_contains?: InputMaybe<Scalars['String']['input']>;
  priceCheckerData_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  priceCheckerData_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  priceCheckerData_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  priceCheckerData_starts_with?: InputMaybe<Scalars['String']['input']>;
  priceChecker_contains?: InputMaybe<Scalars['String']['input']>;
  priceChecker_ends_with?: InputMaybe<Scalars['String']['input']>;
  priceChecker_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  priceChecker_not?: InputMaybe<Scalars['String']['input']>;
  priceChecker_not_contains?: InputMaybe<Scalars['String']['input']>;
  priceChecker_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  priceChecker_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  priceChecker_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  priceChecker_starts_with?: InputMaybe<Scalars['String']['input']>;
  to?: InputMaybe<Scalars['String']['input']>;
  to_contains?: InputMaybe<Scalars['String']['input']>;
  to_ends_with?: InputMaybe<Scalars['String']['input']>;
  to_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  to_not?: InputMaybe<Scalars['String']['input']>;
  to_not_contains?: InputMaybe<Scalars['String']['input']>;
  to_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  to_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  to_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  to_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenAmountIn?: InputMaybe<Scalars['BigInt']['input']>;
  tokenAmountIn_gt?: InputMaybe<Scalars['BigInt']['input']>;
  tokenAmountIn_gte?: InputMaybe<Scalars['BigInt']['input']>;
  tokenAmountIn_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  tokenAmountIn_lt?: InputMaybe<Scalars['BigInt']['input']>;
  tokenAmountIn_lte?: InputMaybe<Scalars['BigInt']['input']>;
  tokenAmountIn_not?: InputMaybe<Scalars['BigInt']['input']>;
  tokenAmountIn_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  tokenInId?: InputMaybe<Scalars['String']['input']>;
  tokenInId_contains?: InputMaybe<Scalars['String']['input']>;
  tokenInId_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenInId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tokenInId_not?: InputMaybe<Scalars['String']['input']>;
  tokenInId_not_contains?: InputMaybe<Scalars['String']['input']>;
  tokenInId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenInId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tokenInId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenInId_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenOutId?: InputMaybe<Scalars['String']['input']>;
  tokenOutId_contains?: InputMaybe<Scalars['String']['input']>;
  tokenOutId_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenOutId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tokenOutId_not?: InputMaybe<Scalars['String']['input']>;
  tokenOutId_not_contains?: InputMaybe<Scalars['String']['input']>;
  tokenOutId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenOutId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tokenOutId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenOutId_starts_with?: InputMaybe<Scalars['String']['input']>;
};

export type Token = {
  __typename?: 'Token';
  address: Scalars['String']['output'];
  chainId: Scalars['Int']['output'];
  decimals: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  symbol: Scalars['String']['output'];
};

export type TokenFilter = {
  address?: InputMaybe<Scalars['String']['input']>;
  address_contains?: InputMaybe<Scalars['String']['input']>;
  address_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not?: InputMaybe<Scalars['String']['input']>;
  address_not_contains?: InputMaybe<Scalars['String']['input']>;
  address_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  address_starts_with?: InputMaybe<Scalars['String']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  chainId_gt?: InputMaybe<Scalars['Int']['input']>;
  chainId_gte?: InputMaybe<Scalars['Int']['input']>;
  chainId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  chainId_lt?: InputMaybe<Scalars['Int']['input']>;
  chainId_lte?: InputMaybe<Scalars['Int']['input']>;
  chainId_not?: InputMaybe<Scalars['Int']['input']>;
  chainId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  decimals?: InputMaybe<Scalars['Int']['input']>;
  decimals_gt?: InputMaybe<Scalars['Int']['input']>;
  decimals_gte?: InputMaybe<Scalars['Int']['input']>;
  decimals_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  decimals_lt?: InputMaybe<Scalars['Int']['input']>;
  decimals_lte?: InputMaybe<Scalars['Int']['input']>;
  decimals_not?: InputMaybe<Scalars['Int']['input']>;
  decimals_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_starts_with?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  symbol?: InputMaybe<Scalars['String']['input']>;
  symbol_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  symbol_not?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  symbol_starts_with?: InputMaybe<Scalars['String']['input']>;
};

export type Transaction = {
  __typename?: 'Transaction';
  blockNumber: Scalars['BigInt']['output'];
  blockTimestamp: Scalars['BigInt']['output'];
  chainId: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  swaps: Array<Swap>;
  user: Scalars['String']['output'];
};


export type TransactionSwapsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  timestamp?: InputMaybe<Scalars['Int']['input']>;
};

export type TransactionFilter = {
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  chainId_gt?: InputMaybe<Scalars['Int']['input']>;
  chainId_gte?: InputMaybe<Scalars['Int']['input']>;
  chainId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  chainId_lt?: InputMaybe<Scalars['Int']['input']>;
  chainId_lte?: InputMaybe<Scalars['Int']['input']>;
  chainId_not?: InputMaybe<Scalars['Int']['input']>;
  chainId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_starts_with?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
  user_contains?: InputMaybe<Scalars['String']['input']>;
  user_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  user_not?: InputMaybe<Scalars['String']['input']>;
  user_not_contains?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  user_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_starts_with?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  address: Scalars['String']['output'];
  chainId: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  transactions: Array<Transaction>;
};


export type UserTransactionsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  timestamp?: InputMaybe<Scalars['Int']['input']>;
};

export type UserFilter = {
  address?: InputMaybe<Scalars['String']['input']>;
  address_contains?: InputMaybe<Scalars['String']['input']>;
  address_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not?: InputMaybe<Scalars['String']['input']>;
  address_not_contains?: InputMaybe<Scalars['String']['input']>;
  address_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  address_starts_with?: InputMaybe<Scalars['String']['input']>;
  chainId?: InputMaybe<Scalars['Int']['input']>;
  chainId_gt?: InputMaybe<Scalars['Int']['input']>;
  chainId_gte?: InputMaybe<Scalars['Int']['input']>;
  chainId_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  chainId_lt?: InputMaybe<Scalars['Int']['input']>;
  chainId_lte?: InputMaybe<Scalars['Int']['input']>;
  chainId_not?: InputMaybe<Scalars['Int']['input']>;
  chainId_not_in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  id_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_starts_with?: InputMaybe<Scalars['String']['input']>;
};

export type AllTransactionFromUserQueryVariables = Exact<{
  user: Scalars['String']['input'];
}>;


export type AllTransactionFromUserQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', id: string, transactions: Array<{ __typename?: 'Transaction', id: string, blockNumber: any, blockTimestamp: any, swaps: Array<{ __typename?: 'Swap', id: string, chainId: number, tokenAmountIn: any, priceChecker: string, orderContract: string, priceCheckerData: string, to: string, tokenIn: { __typename?: 'Token', address: string, name: string, symbol: string, decimals: number }, tokenOut: { __typename?: 'Token', address: string, name: string, symbol: string, decimals: number } }> }> }> };


export const AllTransactionFromUserDocument = gql`
    query AllTransactionFromUser($user: String!) {
  users(where: {id: $user}) {
    id
    transactions(orderBy: "blockNumber", orderDirection: "desc") {
      id
      blockNumber
      blockTimestamp
      swaps {
        id
        chainId
        tokenAmountIn
        priceChecker
        orderContract
        priceCheckerData
        to
        tokenIn {
          address
          name
          symbol
          decimals
        }
        tokenOut {
          address
          name
          symbol
          decimals
        }
      }
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    AllTransactionFromUser(variables: AllTransactionFromUserQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<AllTransactionFromUserQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AllTransactionFromUserQuery>(AllTransactionFromUserDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'AllTransactionFromUser', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;