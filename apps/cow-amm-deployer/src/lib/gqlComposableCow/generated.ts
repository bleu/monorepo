import { GraphQLClient, RequestOptions } from 'graphql-request';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigInt: { input: any; output: any; }
};

export type Order = {
  __typename?: 'Order';
  blockNumber: Scalars['BigInt']['output'];
  blockTimestamp: Scalars['BigInt']['output'];
  chainId: Scalars['Int']['output'];
  decodedSuccess: Scalars['Boolean']['output'];
  hash: Scalars['String']['output'];
  id: Scalars['String']['output'];
  orderHandler?: Maybe<OrderHandler>;
  orderHandlerId?: Maybe<Scalars['String']['output']>;
  productConstantOrder?: Maybe<ProductConstantOrder>;
  productConstantOrderId?: Maybe<Scalars['String']['output']>;
  salt: Scalars['String']['output'];
  staticInput: Scalars['String']['output'];
  stopLossOrder?: Maybe<StopLossOrder>;
  stopLossOrderId?: Maybe<Scalars['String']['output']>;
  user: Scalars['String']['output'];
  userId: User;
};

export type OrderFilter = {
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
  decodedSuccess?: InputMaybe<Scalars['Boolean']['input']>;
  decodedSuccess_in?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  decodedSuccess_not?: InputMaybe<Scalars['Boolean']['input']>;
  decodedSuccess_not_in?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  hash?: InputMaybe<Scalars['String']['input']>;
  hash_gt?: InputMaybe<Scalars['String']['input']>;
  hash_gte?: InputMaybe<Scalars['String']['input']>;
  hash_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  hash_lt?: InputMaybe<Scalars['String']['input']>;
  hash_lte?: InputMaybe<Scalars['String']['input']>;
  hash_not?: InputMaybe<Scalars['String']['input']>;
  hash_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
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
  orderHandlerId?: InputMaybe<Scalars['String']['input']>;
  orderHandlerId_contains?: InputMaybe<Scalars['String']['input']>;
  orderHandlerId_ends_with?: InputMaybe<Scalars['String']['input']>;
  orderHandlerId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  orderHandlerId_not?: InputMaybe<Scalars['String']['input']>;
  orderHandlerId_not_contains?: InputMaybe<Scalars['String']['input']>;
  orderHandlerId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  orderHandlerId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  orderHandlerId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  orderHandlerId_starts_with?: InputMaybe<Scalars['String']['input']>;
  productConstantOrderId?: InputMaybe<Scalars['String']['input']>;
  productConstantOrderId_contains?: InputMaybe<Scalars['String']['input']>;
  productConstantOrderId_ends_with?: InputMaybe<Scalars['String']['input']>;
  productConstantOrderId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  productConstantOrderId_not?: InputMaybe<Scalars['String']['input']>;
  productConstantOrderId_not_contains?: InputMaybe<Scalars['String']['input']>;
  productConstantOrderId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  productConstantOrderId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  productConstantOrderId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  productConstantOrderId_starts_with?: InputMaybe<Scalars['String']['input']>;
  salt?: InputMaybe<Scalars['String']['input']>;
  salt_gt?: InputMaybe<Scalars['String']['input']>;
  salt_gte?: InputMaybe<Scalars['String']['input']>;
  salt_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  salt_lt?: InputMaybe<Scalars['String']['input']>;
  salt_lte?: InputMaybe<Scalars['String']['input']>;
  salt_not?: InputMaybe<Scalars['String']['input']>;
  salt_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  staticInput?: InputMaybe<Scalars['String']['input']>;
  staticInput_gt?: InputMaybe<Scalars['String']['input']>;
  staticInput_gte?: InputMaybe<Scalars['String']['input']>;
  staticInput_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  staticInput_lt?: InputMaybe<Scalars['String']['input']>;
  staticInput_lte?: InputMaybe<Scalars['String']['input']>;
  staticInput_not?: InputMaybe<Scalars['String']['input']>;
  staticInput_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  stopLossOrderId?: InputMaybe<Scalars['String']['input']>;
  stopLossOrderId_contains?: InputMaybe<Scalars['String']['input']>;
  stopLossOrderId_ends_with?: InputMaybe<Scalars['String']['input']>;
  stopLossOrderId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  stopLossOrderId_not?: InputMaybe<Scalars['String']['input']>;
  stopLossOrderId_not_contains?: InputMaybe<Scalars['String']['input']>;
  stopLossOrderId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  stopLossOrderId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  stopLossOrderId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  stopLossOrderId_starts_with?: InputMaybe<Scalars['String']['input']>;
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

export type OrderHandler = {
  __typename?: 'OrderHandler';
  address: Scalars['String']['output'];
  chainId: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  type?: Maybe<Scalars['String']['output']>;
};

export type OrderHandlerFilter = {
  address?: InputMaybe<Scalars['String']['input']>;
  address_gt?: InputMaybe<Scalars['String']['input']>;
  address_gte?: InputMaybe<Scalars['String']['input']>;
  address_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_lt?: InputMaybe<Scalars['String']['input']>;
  address_lte?: InputMaybe<Scalars['String']['input']>;
  address_not?: InputMaybe<Scalars['String']['input']>;
  address_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
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
  type?: InputMaybe<Scalars['String']['input']>;
  type_contains?: InputMaybe<Scalars['String']['input']>;
  type_ends_with?: InputMaybe<Scalars['String']['input']>;
  type_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  type_not?: InputMaybe<Scalars['String']['input']>;
  type_not_contains?: InputMaybe<Scalars['String']['input']>;
  type_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  type_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  type_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  type_starts_with?: InputMaybe<Scalars['String']['input']>;
};

export type OrderHandlerPage = {
  __typename?: 'OrderHandlerPage';
  items?: Maybe<Array<OrderHandler>>;
  pageInfo?: Maybe<PageInfo>;
};

export type OrderPage = {
  __typename?: 'OrderPage';
  items?: Maybe<Array<Order>>;
  pageInfo?: Maybe<PageInfo>;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type ProductConstantOrder = {
  __typename?: 'ProductConstantOrder';
  appData: Scalars['String']['output'];
  id: Scalars['String']['output'];
  minTradedToken0: Scalars['BigInt']['output'];
  orderId: Scalars['String']['output'];
  priceOracle: Scalars['String']['output'];
  priceOracleData: Scalars['String']['output'];
  token0: Token;
  token0Id: Scalars['String']['output'];
  token1: Token;
  token1Id: Scalars['String']['output'];
};

export type ProductConstantOrderFilter = {
  appData?: InputMaybe<Scalars['String']['input']>;
  appData_gt?: InputMaybe<Scalars['String']['input']>;
  appData_gte?: InputMaybe<Scalars['String']['input']>;
  appData_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  appData_lt?: InputMaybe<Scalars['String']['input']>;
  appData_lte?: InputMaybe<Scalars['String']['input']>;
  appData_not?: InputMaybe<Scalars['String']['input']>;
  appData_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
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
  minTradedToken0?: InputMaybe<Scalars['BigInt']['input']>;
  minTradedToken0_gt?: InputMaybe<Scalars['BigInt']['input']>;
  minTradedToken0_gte?: InputMaybe<Scalars['BigInt']['input']>;
  minTradedToken0_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  minTradedToken0_lt?: InputMaybe<Scalars['BigInt']['input']>;
  minTradedToken0_lte?: InputMaybe<Scalars['BigInt']['input']>;
  minTradedToken0_not?: InputMaybe<Scalars['BigInt']['input']>;
  minTradedToken0_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  orderId?: InputMaybe<Scalars['String']['input']>;
  orderId_contains?: InputMaybe<Scalars['String']['input']>;
  orderId_ends_with?: InputMaybe<Scalars['String']['input']>;
  orderId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  orderId_not?: InputMaybe<Scalars['String']['input']>;
  orderId_not_contains?: InputMaybe<Scalars['String']['input']>;
  orderId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  orderId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  orderId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  orderId_starts_with?: InputMaybe<Scalars['String']['input']>;
  priceOracle?: InputMaybe<Scalars['String']['input']>;
  priceOracleData?: InputMaybe<Scalars['String']['input']>;
  priceOracleData_gt?: InputMaybe<Scalars['String']['input']>;
  priceOracleData_gte?: InputMaybe<Scalars['String']['input']>;
  priceOracleData_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  priceOracleData_lt?: InputMaybe<Scalars['String']['input']>;
  priceOracleData_lte?: InputMaybe<Scalars['String']['input']>;
  priceOracleData_not?: InputMaybe<Scalars['String']['input']>;
  priceOracleData_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  priceOracle_gt?: InputMaybe<Scalars['String']['input']>;
  priceOracle_gte?: InputMaybe<Scalars['String']['input']>;
  priceOracle_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  priceOracle_lt?: InputMaybe<Scalars['String']['input']>;
  priceOracle_lte?: InputMaybe<Scalars['String']['input']>;
  priceOracle_not?: InputMaybe<Scalars['String']['input']>;
  priceOracle_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  token0Id?: InputMaybe<Scalars['String']['input']>;
  token0Id_contains?: InputMaybe<Scalars['String']['input']>;
  token0Id_ends_with?: InputMaybe<Scalars['String']['input']>;
  token0Id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  token0Id_not?: InputMaybe<Scalars['String']['input']>;
  token0Id_not_contains?: InputMaybe<Scalars['String']['input']>;
  token0Id_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  token0Id_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  token0Id_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  token0Id_starts_with?: InputMaybe<Scalars['String']['input']>;
  token1Id?: InputMaybe<Scalars['String']['input']>;
  token1Id_contains?: InputMaybe<Scalars['String']['input']>;
  token1Id_ends_with?: InputMaybe<Scalars['String']['input']>;
  token1Id_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  token1Id_not?: InputMaybe<Scalars['String']['input']>;
  token1Id_not_contains?: InputMaybe<Scalars['String']['input']>;
  token1Id_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  token1Id_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  token1Id_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  token1Id_starts_with?: InputMaybe<Scalars['String']['input']>;
};

export type ProductConstantOrderPage = {
  __typename?: 'ProductConstantOrderPage';
  items?: Maybe<Array<ProductConstantOrder>>;
  pageInfo?: Maybe<PageInfo>;
};

export type Query = {
  __typename?: 'Query';
  order?: Maybe<Order>;
  orderHandler?: Maybe<OrderHandler>;
  orderHandlers?: Maybe<OrderHandlerPage>;
  orders?: Maybe<OrderPage>;
  productConstantOrder?: Maybe<ProductConstantOrder>;
  productConstantOrders?: Maybe<ProductConstantOrderPage>;
  stopLossOrder?: Maybe<StopLossOrder>;
  stopLossOrders?: Maybe<StopLossOrderPage>;
  token?: Maybe<Token>;
  tokens?: Maybe<TokenPage>;
  user?: Maybe<User>;
  users?: Maybe<UserPage>;
};


export type QueryOrderArgs = {
  id: Scalars['String']['input'];
  timestamp?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryOrderHandlerArgs = {
  id: Scalars['String']['input'];
  timestamp?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryOrderHandlersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<OrderHandlerFilter>;
};


export type QueryOrdersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<OrderFilter>;
};


export type QueryProductConstantOrderArgs = {
  id: Scalars['String']['input'];
  timestamp?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryProductConstantOrdersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ProductConstantOrderFilter>;
};


export type QueryStopLossOrderArgs = {
  id: Scalars['String']['input'];
  timestamp?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryStopLossOrdersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<StopLossOrderFilter>;
};


export type QueryTokenArgs = {
  id: Scalars['String']['input'];
  timestamp?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryTokensArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<TokenFilter>;
};


export type QueryUserArgs = {
  id: Scalars['String']['input'];
  timestamp?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryUsersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<UserFilter>;
};

export type StopLossOrder = {
  __typename?: 'StopLossOrder';
  appData: Scalars['String']['output'];
  buyTokenPriceOracle: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isPartiallyFillable: Scalars['Boolean']['output'];
  isSellOrder: Scalars['Boolean']['output'];
  maxTimeSinceLastOracleUpdate: Scalars['BigInt']['output'];
  orderId: Scalars['String']['output'];
  sellTokenPriceOracle: Scalars['String']['output'];
  strike: Scalars['BigInt']['output'];
  to: Scalars['String']['output'];
  tokenAmountIn: Scalars['BigInt']['output'];
  tokenAmountOut: Scalars['BigInt']['output'];
  tokenIn: Token;
  tokenInId: Scalars['String']['output'];
  tokenOut: Token;
  tokenOutId: Scalars['String']['output'];
  validityBucketSeconds: Scalars['BigInt']['output'];
};

export type StopLossOrderFilter = {
  appData?: InputMaybe<Scalars['String']['input']>;
  appData_gt?: InputMaybe<Scalars['String']['input']>;
  appData_gte?: InputMaybe<Scalars['String']['input']>;
  appData_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  appData_lt?: InputMaybe<Scalars['String']['input']>;
  appData_lte?: InputMaybe<Scalars['String']['input']>;
  appData_not?: InputMaybe<Scalars['String']['input']>;
  appData_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  buyTokenPriceOracle?: InputMaybe<Scalars['String']['input']>;
  buyTokenPriceOracle_gt?: InputMaybe<Scalars['String']['input']>;
  buyTokenPriceOracle_gte?: InputMaybe<Scalars['String']['input']>;
  buyTokenPriceOracle_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  buyTokenPriceOracle_lt?: InputMaybe<Scalars['String']['input']>;
  buyTokenPriceOracle_lte?: InputMaybe<Scalars['String']['input']>;
  buyTokenPriceOracle_not?: InputMaybe<Scalars['String']['input']>;
  buyTokenPriceOracle_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
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
  isPartiallyFillable?: InputMaybe<Scalars['Boolean']['input']>;
  isPartiallyFillable_in?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  isPartiallyFillable_not?: InputMaybe<Scalars['Boolean']['input']>;
  isPartiallyFillable_not_in?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  isSellOrder?: InputMaybe<Scalars['Boolean']['input']>;
  isSellOrder_in?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  isSellOrder_not?: InputMaybe<Scalars['Boolean']['input']>;
  isSellOrder_not_in?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  maxTimeSinceLastOracleUpdate?: InputMaybe<Scalars['BigInt']['input']>;
  maxTimeSinceLastOracleUpdate_gt?: InputMaybe<Scalars['BigInt']['input']>;
  maxTimeSinceLastOracleUpdate_gte?: InputMaybe<Scalars['BigInt']['input']>;
  maxTimeSinceLastOracleUpdate_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  maxTimeSinceLastOracleUpdate_lt?: InputMaybe<Scalars['BigInt']['input']>;
  maxTimeSinceLastOracleUpdate_lte?: InputMaybe<Scalars['BigInt']['input']>;
  maxTimeSinceLastOracleUpdate_not?: InputMaybe<Scalars['BigInt']['input']>;
  maxTimeSinceLastOracleUpdate_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  orderId?: InputMaybe<Scalars['String']['input']>;
  orderId_contains?: InputMaybe<Scalars['String']['input']>;
  orderId_ends_with?: InputMaybe<Scalars['String']['input']>;
  orderId_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  orderId_not?: InputMaybe<Scalars['String']['input']>;
  orderId_not_contains?: InputMaybe<Scalars['String']['input']>;
  orderId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  orderId_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  orderId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  orderId_starts_with?: InputMaybe<Scalars['String']['input']>;
  sellTokenPriceOracle?: InputMaybe<Scalars['String']['input']>;
  sellTokenPriceOracle_gt?: InputMaybe<Scalars['String']['input']>;
  sellTokenPriceOracle_gte?: InputMaybe<Scalars['String']['input']>;
  sellTokenPriceOracle_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  sellTokenPriceOracle_lt?: InputMaybe<Scalars['String']['input']>;
  sellTokenPriceOracle_lte?: InputMaybe<Scalars['String']['input']>;
  sellTokenPriceOracle_not?: InputMaybe<Scalars['String']['input']>;
  sellTokenPriceOracle_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  strike?: InputMaybe<Scalars['BigInt']['input']>;
  strike_gt?: InputMaybe<Scalars['BigInt']['input']>;
  strike_gte?: InputMaybe<Scalars['BigInt']['input']>;
  strike_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  strike_lt?: InputMaybe<Scalars['BigInt']['input']>;
  strike_lte?: InputMaybe<Scalars['BigInt']['input']>;
  strike_not?: InputMaybe<Scalars['BigInt']['input']>;
  strike_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  to?: InputMaybe<Scalars['String']['input']>;
  to_gt?: InputMaybe<Scalars['String']['input']>;
  to_gte?: InputMaybe<Scalars['String']['input']>;
  to_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  to_lt?: InputMaybe<Scalars['String']['input']>;
  to_lte?: InputMaybe<Scalars['String']['input']>;
  to_not?: InputMaybe<Scalars['String']['input']>;
  to_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  tokenAmountIn?: InputMaybe<Scalars['BigInt']['input']>;
  tokenAmountIn_gt?: InputMaybe<Scalars['BigInt']['input']>;
  tokenAmountIn_gte?: InputMaybe<Scalars['BigInt']['input']>;
  tokenAmountIn_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  tokenAmountIn_lt?: InputMaybe<Scalars['BigInt']['input']>;
  tokenAmountIn_lte?: InputMaybe<Scalars['BigInt']['input']>;
  tokenAmountIn_not?: InputMaybe<Scalars['BigInt']['input']>;
  tokenAmountIn_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  tokenAmountOut?: InputMaybe<Scalars['BigInt']['input']>;
  tokenAmountOut_gt?: InputMaybe<Scalars['BigInt']['input']>;
  tokenAmountOut_gte?: InputMaybe<Scalars['BigInt']['input']>;
  tokenAmountOut_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  tokenAmountOut_lt?: InputMaybe<Scalars['BigInt']['input']>;
  tokenAmountOut_lte?: InputMaybe<Scalars['BigInt']['input']>;
  tokenAmountOut_not?: InputMaybe<Scalars['BigInt']['input']>;
  tokenAmountOut_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
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
  validityBucketSeconds?: InputMaybe<Scalars['BigInt']['input']>;
  validityBucketSeconds_gt?: InputMaybe<Scalars['BigInt']['input']>;
  validityBucketSeconds_gte?: InputMaybe<Scalars['BigInt']['input']>;
  validityBucketSeconds_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
  validityBucketSeconds_lt?: InputMaybe<Scalars['BigInt']['input']>;
  validityBucketSeconds_lte?: InputMaybe<Scalars['BigInt']['input']>;
  validityBucketSeconds_not?: InputMaybe<Scalars['BigInt']['input']>;
  validityBucketSeconds_not_in?: InputMaybe<Array<InputMaybe<Scalars['BigInt']['input']>>>;
};

export type StopLossOrderPage = {
  __typename?: 'StopLossOrderPage';
  items?: Maybe<Array<StopLossOrder>>;
  pageInfo?: Maybe<PageInfo>;
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
  address_gt?: InputMaybe<Scalars['String']['input']>;
  address_gte?: InputMaybe<Scalars['String']['input']>;
  address_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  address_lt?: InputMaybe<Scalars['String']['input']>;
  address_lte?: InputMaybe<Scalars['String']['input']>;
  address_not?: InputMaybe<Scalars['String']['input']>;
  address_not_in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
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

export type TokenPage = {
  __typename?: 'TokenPage';
  items?: Maybe<Array<Token>>;
  pageInfo?: Maybe<PageInfo>;
};

export type User = {
  __typename?: 'User';
  address: Scalars['String']['output'];
  chainId: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  orders?: Maybe<OrderPage>;
};


export type UserOrdersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Scalars['String']['input']>;
  orderDirection?: InputMaybe<Scalars['String']['input']>;
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

export type UserPage = {
  __typename?: 'UserPage';
  items?: Maybe<Array<User>>;
  pageInfo?: Maybe<PageInfo>;
};

export type UserCurrentAmmQueryVariables = Exact<{
  userId: Scalars['String']['input'];
  handlerId: Scalars['String']['input'];
}>;


export type UserCurrentAmmQuery = { __typename?: 'Query', orders?: { __typename?: 'OrderPage', items?: Array<{ __typename?: 'Order', id: string, chainId: number, blockNumber: any, blockTimestamp: any, hash: string, orderHandlerId?: string | null, decodedSuccess: boolean, staticInput: string, productConstantOrder?: { __typename?: 'ProductConstantOrder', id: string, minTradedToken0: any, priceOracle: string, priceOracleData: string, appData: string, token0: { __typename?: 'Token', id: string, address: string, symbol: string, decimals: number }, token1: { __typename?: 'Token', id: string, address: string, symbol: string, decimals: number } } | null }> | null } | null };


export const UserCurrentAmmDocument = gql`
    query UserCurrentAmm($userId: String!, $handlerId: String!) {
  orders(
    where: {user: $userId, orderHandlerId: $handlerId}
    limit: 1
    orderBy: "blockNumber"
    orderDirection: "desc"
  ) {
    items {
      id
      chainId
      blockNumber
      blockTimestamp
      hash
      orderHandlerId
      decodedSuccess
      staticInput
      productConstantOrder {
        id
        token0 {
          id
          address
          symbol
          decimals
        }
        token1 {
          id
          address
          symbol
          decimals
        }
        minTradedToken0
        priceOracle
        priceOracleData
        appData
      }
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    UserCurrentAmm(variables: UserCurrentAmmQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<UserCurrentAmmQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<UserCurrentAmmQuery>(UserCurrentAmmDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UserCurrentAmm', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;