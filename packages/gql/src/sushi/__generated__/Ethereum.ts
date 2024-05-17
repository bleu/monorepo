import { GraphQLClient } from 'graphql-request';
import { GraphQLClientRequestHeaders } from 'graphql-request/build/cjs/types';
import gql from 'graphql-tag';
import { ClientError } from 'graphql-request';
import useSWR, { SWRConfiguration as SWRConfigInterface, Key as SWRKeyInterface } from 'swr';
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
  BigDecimal: { input: any; output: any; }
  BigInt: { input: any; output: any; }
  Bytes: { input: any; output: any; }
  Int8: { input: any; output: any; }
  Timestamp: { input: any; output: any; }
};

export type Aggregation_Interval =
  | 'day'
  | 'hour'
  | '%future added value';

export type BlockChangedFilter = {
  number_gte: Scalars['Int']['input'];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  number?: InputMaybe<Scalars['Int']['input']>;
  number_gte?: InputMaybe<Scalars['Int']['input']>;
};

export type Bundle = {
  __typename?: 'Bundle';
  ethPrice: Scalars['BigDecimal']['output'];
  id: Scalars['ID']['output'];
};

export type Bundle_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Bundle_Filter>>>;
  ethPrice?: InputMaybe<Scalars['BigDecimal']['input']>;
  ethPrice_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  ethPrice_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  ethPrice_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  ethPrice_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  ethPrice_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  ethPrice_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  ethPrice_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Bundle_Filter>>>;
};

export type Bundle_OrderBy =
  | 'ethPrice'
  | 'id'
  | '%future added value';

export type Burn = {
  __typename?: 'Burn';
  amount0?: Maybe<Scalars['BigDecimal']['output']>;
  amount1?: Maybe<Scalars['BigDecimal']['output']>;
  amountUSD?: Maybe<Scalars['BigDecimal']['output']>;
  complete: Scalars['Boolean']['output'];
  feeLiquidity?: Maybe<Scalars['BigDecimal']['output']>;
  feeTo?: Maybe<Scalars['Bytes']['output']>;
  id: Scalars['ID']['output'];
  liquidity: Scalars['BigDecimal']['output'];
  logIndex?: Maybe<Scalars['BigInt']['output']>;
  pair: Pair;
  sender?: Maybe<Scalars['Bytes']['output']>;
  timestamp: Scalars['BigInt']['output'];
  to?: Maybe<Scalars['Bytes']['output']>;
  transaction: Transaction;
};

export type Burn_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount0?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount0_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount0_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount0_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amount0_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount0_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount0_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount0_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amount1?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount1_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount1_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount1_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amount1_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount1_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount1_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount1_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amountUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amountUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  and?: InputMaybe<Array<InputMaybe<Burn_Filter>>>;
  complete?: InputMaybe<Scalars['Boolean']['input']>;
  complete_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  complete_not?: InputMaybe<Scalars['Boolean']['input']>;
  complete_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  feeLiquidity?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeLiquidity_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeLiquidity_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeLiquidity_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  feeLiquidity_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeLiquidity_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeLiquidity_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeLiquidity_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  feeTo?: InputMaybe<Scalars['Bytes']['input']>;
  feeTo_contains?: InputMaybe<Scalars['Bytes']['input']>;
  feeTo_gt?: InputMaybe<Scalars['Bytes']['input']>;
  feeTo_gte?: InputMaybe<Scalars['Bytes']['input']>;
  feeTo_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  feeTo_lt?: InputMaybe<Scalars['Bytes']['input']>;
  feeTo_lte?: InputMaybe<Scalars['Bytes']['input']>;
  feeTo_not?: InputMaybe<Scalars['Bytes']['input']>;
  feeTo_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  feeTo_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  liquidity?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidity_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidity_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidity_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  liquidity_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidity_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidity_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidity_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  logIndex?: InputMaybe<Scalars['BigInt']['input']>;
  logIndex_gt?: InputMaybe<Scalars['BigInt']['input']>;
  logIndex_gte?: InputMaybe<Scalars['BigInt']['input']>;
  logIndex_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  logIndex_lt?: InputMaybe<Scalars['BigInt']['input']>;
  logIndex_lte?: InputMaybe<Scalars['BigInt']['input']>;
  logIndex_not?: InputMaybe<Scalars['BigInt']['input']>;
  logIndex_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Burn_Filter>>>;
  pair?: InputMaybe<Scalars['String']['input']>;
  pair_?: InputMaybe<Pair_Filter>;
  pair_contains?: InputMaybe<Scalars['String']['input']>;
  pair_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pair_ends_with?: InputMaybe<Scalars['String']['input']>;
  pair_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pair_gt?: InputMaybe<Scalars['String']['input']>;
  pair_gte?: InputMaybe<Scalars['String']['input']>;
  pair_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pair_lt?: InputMaybe<Scalars['String']['input']>;
  pair_lte?: InputMaybe<Scalars['String']['input']>;
  pair_not?: InputMaybe<Scalars['String']['input']>;
  pair_not_contains?: InputMaybe<Scalars['String']['input']>;
  pair_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pair_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pair_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pair_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pair_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pair_starts_with?: InputMaybe<Scalars['String']['input']>;
  pair_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sender?: InputMaybe<Scalars['Bytes']['input']>;
  sender_contains?: InputMaybe<Scalars['Bytes']['input']>;
  sender_gt?: InputMaybe<Scalars['Bytes']['input']>;
  sender_gte?: InputMaybe<Scalars['Bytes']['input']>;
  sender_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  sender_lt?: InputMaybe<Scalars['Bytes']['input']>;
  sender_lte?: InputMaybe<Scalars['Bytes']['input']>;
  sender_not?: InputMaybe<Scalars['Bytes']['input']>;
  sender_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  sender_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  to?: InputMaybe<Scalars['Bytes']['input']>;
  to_contains?: InputMaybe<Scalars['Bytes']['input']>;
  to_gt?: InputMaybe<Scalars['Bytes']['input']>;
  to_gte?: InputMaybe<Scalars['Bytes']['input']>;
  to_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  to_lt?: InputMaybe<Scalars['Bytes']['input']>;
  to_lte?: InputMaybe<Scalars['Bytes']['input']>;
  to_not?: InputMaybe<Scalars['Bytes']['input']>;
  to_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  to_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transaction?: InputMaybe<Scalars['String']['input']>;
  transaction_?: InputMaybe<Transaction_Filter>;
  transaction_contains?: InputMaybe<Scalars['String']['input']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_ends_with?: InputMaybe<Scalars['String']['input']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_gt?: InputMaybe<Scalars['String']['input']>;
  transaction_gte?: InputMaybe<Scalars['String']['input']>;
  transaction_in?: InputMaybe<Array<Scalars['String']['input']>>;
  transaction_lt?: InputMaybe<Scalars['String']['input']>;
  transaction_lte?: InputMaybe<Scalars['String']['input']>;
  transaction_not?: InputMaybe<Scalars['String']['input']>;
  transaction_not_contains?: InputMaybe<Scalars['String']['input']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_starts_with?: InputMaybe<Scalars['String']['input']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export type Burn_OrderBy =
  | 'amount0'
  | 'amount1'
  | 'amountUSD'
  | 'complete'
  | 'feeLiquidity'
  | 'feeTo'
  | 'id'
  | 'liquidity'
  | 'logIndex'
  | 'pair'
  | 'pair__block'
  | 'pair__id'
  | 'pair__liquidityProviderCount'
  | 'pair__name'
  | 'pair__reserve0'
  | 'pair__reserve1'
  | 'pair__reserveETH'
  | 'pair__reserveUSD'
  | 'pair__timestamp'
  | 'pair__token0Price'
  | 'pair__token1Price'
  | 'pair__totalSupply'
  | 'pair__trackedReserveETH'
  | 'pair__txCount'
  | 'pair__untrackedVolumeUSD'
  | 'pair__volumeToken0'
  | 'pair__volumeToken1'
  | 'pair__volumeUSD'
  | 'sender'
  | 'timestamp'
  | 'to'
  | 'transaction'
  | 'transaction__blockNumber'
  | 'transaction__id'
  | 'transaction__timestamp'
  | '%future added value';

export type DayData = {
  __typename?: 'DayData';
  date: Scalars['Int']['output'];
  factory: Factory;
  id: Scalars['ID']['output'];
  liquidityETH: Scalars['BigDecimal']['output'];
  liquidityUSD: Scalars['BigDecimal']['output'];
  txCount: Scalars['BigInt']['output'];
  untrackedVolume: Scalars['BigDecimal']['output'];
  volumeETH: Scalars['BigDecimal']['output'];
  volumeUSD: Scalars['BigDecimal']['output'];
};

export type DayData_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<DayData_Filter>>>;
  date?: InputMaybe<Scalars['Int']['input']>;
  date_gt?: InputMaybe<Scalars['Int']['input']>;
  date_gte?: InputMaybe<Scalars['Int']['input']>;
  date_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  date_lt?: InputMaybe<Scalars['Int']['input']>;
  date_lte?: InputMaybe<Scalars['Int']['input']>;
  date_not?: InputMaybe<Scalars['Int']['input']>;
  date_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  factory?: InputMaybe<Scalars['String']['input']>;
  factory_?: InputMaybe<Factory_Filter>;
  factory_contains?: InputMaybe<Scalars['String']['input']>;
  factory_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  factory_ends_with?: InputMaybe<Scalars['String']['input']>;
  factory_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  factory_gt?: InputMaybe<Scalars['String']['input']>;
  factory_gte?: InputMaybe<Scalars['String']['input']>;
  factory_in?: InputMaybe<Array<Scalars['String']['input']>>;
  factory_lt?: InputMaybe<Scalars['String']['input']>;
  factory_lte?: InputMaybe<Scalars['String']['input']>;
  factory_not?: InputMaybe<Scalars['String']['input']>;
  factory_not_contains?: InputMaybe<Scalars['String']['input']>;
  factory_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  factory_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  factory_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  factory_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  factory_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  factory_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  factory_starts_with?: InputMaybe<Scalars['String']['input']>;
  factory_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  liquidityETH?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityETH_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityETH_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityETH_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  liquidityETH_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityETH_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityETH_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityETH_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  liquidityUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  liquidityUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  or?: InputMaybe<Array<InputMaybe<DayData_Filter>>>;
  txCount?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  txCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  untrackedVolume?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedVolume_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedVolume_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedVolume_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  untrackedVolume_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedVolume_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedVolume_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeETH?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeETH_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeETH_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeETH_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeETH_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeETH_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeETH_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeETH_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
};

export type DayData_OrderBy =
  | 'date'
  | 'factory'
  | 'factory__id'
  | 'factory__liquidityETH'
  | 'factory__liquidityUSD'
  | 'factory__pairCount'
  | 'factory__tokenCount'
  | 'factory__txCount'
  | 'factory__untrackedVolumeUSD'
  | 'factory__userCount'
  | 'factory__volumeETH'
  | 'factory__volumeUSD'
  | 'id'
  | 'liquidityETH'
  | 'liquidityUSD'
  | 'txCount'
  | 'untrackedVolume'
  | 'volumeETH'
  | 'volumeUSD'
  | '%future added value';

export type Factory = {
  __typename?: 'Factory';
  dayData: Array<DayData>;
  hourData: Array<HourData>;
  id: Scalars['ID']['output'];
  liquidityETH: Scalars['BigDecimal']['output'];
  liquidityUSD: Scalars['BigDecimal']['output'];
  pairCount: Scalars['BigInt']['output'];
  pairs: Array<Pair>;
  tokenCount: Scalars['BigInt']['output'];
  tokens: Array<Token>;
  txCount: Scalars['BigInt']['output'];
  untrackedVolumeUSD: Scalars['BigDecimal']['output'];
  userCount: Scalars['BigInt']['output'];
  volumeETH: Scalars['BigDecimal']['output'];
  volumeUSD: Scalars['BigDecimal']['output'];
};


export type FactoryDayDataArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DayData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<DayData_Filter>;
};


export type FactoryHourDataArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<HourData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<HourData_Filter>;
};


export type FactoryPairsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Pair_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Pair_Filter>;
};


export type FactoryTokensArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Token_Filter>;
};

export type Factory_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Factory_Filter>>>;
  dayData_?: InputMaybe<DayData_Filter>;
  hourData_?: InputMaybe<HourData_Filter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  liquidityETH?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityETH_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityETH_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityETH_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  liquidityETH_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityETH_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityETH_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityETH_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  liquidityUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  liquidityUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Factory_Filter>>>;
  pairCount?: InputMaybe<Scalars['BigInt']['input']>;
  pairCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  pairCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  pairCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  pairCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  pairCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  pairCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  pairCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  pairs_?: InputMaybe<Pair_Filter>;
  tokenCount?: InputMaybe<Scalars['BigInt']['input']>;
  tokenCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  tokenCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  tokenCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokenCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  tokenCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  tokenCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  tokenCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tokens_?: InputMaybe<Token_Filter>;
  txCount?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  txCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  untrackedVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  untrackedVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  userCount?: InputMaybe<Scalars['BigInt']['input']>;
  userCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  userCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  userCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  userCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  userCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  userCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  userCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  volumeETH?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeETH_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeETH_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeETH_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeETH_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeETH_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeETH_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeETH_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
};

export type Factory_OrderBy =
  | 'dayData'
  | 'hourData'
  | 'id'
  | 'liquidityETH'
  | 'liquidityUSD'
  | 'pairCount'
  | 'pairs'
  | 'tokenCount'
  | 'tokens'
  | 'txCount'
  | 'untrackedVolumeUSD'
  | 'userCount'
  | 'volumeETH'
  | 'volumeUSD'
  | '%future added value';

export type HourData = {
  __typename?: 'HourData';
  date: Scalars['Int']['output'];
  factory: Factory;
  id: Scalars['ID']['output'];
  liquidityETH: Scalars['BigDecimal']['output'];
  liquidityUSD: Scalars['BigDecimal']['output'];
  txCount: Scalars['BigInt']['output'];
  untrackedVolume: Scalars['BigDecimal']['output'];
  volumeETH: Scalars['BigDecimal']['output'];
  volumeUSD: Scalars['BigDecimal']['output'];
};

export type HourData_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<HourData_Filter>>>;
  date?: InputMaybe<Scalars['Int']['input']>;
  date_gt?: InputMaybe<Scalars['Int']['input']>;
  date_gte?: InputMaybe<Scalars['Int']['input']>;
  date_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  date_lt?: InputMaybe<Scalars['Int']['input']>;
  date_lte?: InputMaybe<Scalars['Int']['input']>;
  date_not?: InputMaybe<Scalars['Int']['input']>;
  date_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  factory?: InputMaybe<Scalars['String']['input']>;
  factory_?: InputMaybe<Factory_Filter>;
  factory_contains?: InputMaybe<Scalars['String']['input']>;
  factory_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  factory_ends_with?: InputMaybe<Scalars['String']['input']>;
  factory_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  factory_gt?: InputMaybe<Scalars['String']['input']>;
  factory_gte?: InputMaybe<Scalars['String']['input']>;
  factory_in?: InputMaybe<Array<Scalars['String']['input']>>;
  factory_lt?: InputMaybe<Scalars['String']['input']>;
  factory_lte?: InputMaybe<Scalars['String']['input']>;
  factory_not?: InputMaybe<Scalars['String']['input']>;
  factory_not_contains?: InputMaybe<Scalars['String']['input']>;
  factory_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  factory_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  factory_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  factory_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  factory_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  factory_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  factory_starts_with?: InputMaybe<Scalars['String']['input']>;
  factory_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  liquidityETH?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityETH_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityETH_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityETH_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  liquidityETH_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityETH_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityETH_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityETH_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  liquidityUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  liquidityUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  or?: InputMaybe<Array<InputMaybe<HourData_Filter>>>;
  txCount?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  txCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  untrackedVolume?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedVolume_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedVolume_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedVolume_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  untrackedVolume_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedVolume_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedVolume_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeETH?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeETH_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeETH_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeETH_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeETH_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeETH_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeETH_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeETH_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
};

export type HourData_OrderBy =
  | 'date'
  | 'factory'
  | 'factory__id'
  | 'factory__liquidityETH'
  | 'factory__liquidityUSD'
  | 'factory__pairCount'
  | 'factory__tokenCount'
  | 'factory__txCount'
  | 'factory__untrackedVolumeUSD'
  | 'factory__userCount'
  | 'factory__volumeETH'
  | 'factory__volumeUSD'
  | 'id'
  | 'liquidityETH'
  | 'liquidityUSD'
  | 'txCount'
  | 'untrackedVolume'
  | 'volumeETH'
  | 'volumeUSD'
  | '%future added value';

export type LiquidityPosition = {
  __typename?: 'LiquidityPosition';
  block: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  liquidityTokenBalance: Scalars['BigDecimal']['output'];
  pair: Pair;
  snapshots: Array<Maybe<LiquidityPositionSnapshot>>;
  timestamp: Scalars['Int']['output'];
  user: User;
};


export type LiquidityPositionSnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<LiquidityPositionSnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<LiquidityPositionSnapshot_Filter>;
};

export type LiquidityPositionSnapshot = {
  __typename?: 'LiquidityPositionSnapshot';
  block: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  liquidityPosition: LiquidityPosition;
  liquidityTokenBalance: Scalars['BigDecimal']['output'];
  liquidityTokenTotalSupply: Scalars['BigDecimal']['output'];
  pair: Pair;
  reserve0: Scalars['BigDecimal']['output'];
  reserve1: Scalars['BigDecimal']['output'];
  reserveUSD: Scalars['BigDecimal']['output'];
  timestamp: Scalars['Int']['output'];
  token0PriceUSD: Scalars['BigDecimal']['output'];
  token1PriceUSD: Scalars['BigDecimal']['output'];
  user: User;
};

export type LiquidityPositionSnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<LiquidityPositionSnapshot_Filter>>>;
  block?: InputMaybe<Scalars['Int']['input']>;
  block_gt?: InputMaybe<Scalars['Int']['input']>;
  block_gte?: InputMaybe<Scalars['Int']['input']>;
  block_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  block_lt?: InputMaybe<Scalars['Int']['input']>;
  block_lte?: InputMaybe<Scalars['Int']['input']>;
  block_not?: InputMaybe<Scalars['Int']['input']>;
  block_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  liquidityPosition?: InputMaybe<Scalars['String']['input']>;
  liquidityPosition_?: InputMaybe<LiquidityPosition_Filter>;
  liquidityPosition_contains?: InputMaybe<Scalars['String']['input']>;
  liquidityPosition_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  liquidityPosition_ends_with?: InputMaybe<Scalars['String']['input']>;
  liquidityPosition_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  liquidityPosition_gt?: InputMaybe<Scalars['String']['input']>;
  liquidityPosition_gte?: InputMaybe<Scalars['String']['input']>;
  liquidityPosition_in?: InputMaybe<Array<Scalars['String']['input']>>;
  liquidityPosition_lt?: InputMaybe<Scalars['String']['input']>;
  liquidityPosition_lte?: InputMaybe<Scalars['String']['input']>;
  liquidityPosition_not?: InputMaybe<Scalars['String']['input']>;
  liquidityPosition_not_contains?: InputMaybe<Scalars['String']['input']>;
  liquidityPosition_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  liquidityPosition_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  liquidityPosition_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  liquidityPosition_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  liquidityPosition_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  liquidityPosition_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  liquidityPosition_starts_with?: InputMaybe<Scalars['String']['input']>;
  liquidityPosition_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  liquidityTokenBalance?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityTokenBalance_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityTokenBalance_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityTokenBalance_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  liquidityTokenBalance_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityTokenBalance_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityTokenBalance_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityTokenBalance_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  liquidityTokenTotalSupply?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityTokenTotalSupply_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityTokenTotalSupply_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityTokenTotalSupply_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  liquidityTokenTotalSupply_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityTokenTotalSupply_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityTokenTotalSupply_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityTokenTotalSupply_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  or?: InputMaybe<Array<InputMaybe<LiquidityPositionSnapshot_Filter>>>;
  pair?: InputMaybe<Scalars['String']['input']>;
  pair_?: InputMaybe<Pair_Filter>;
  pair_contains?: InputMaybe<Scalars['String']['input']>;
  pair_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pair_ends_with?: InputMaybe<Scalars['String']['input']>;
  pair_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pair_gt?: InputMaybe<Scalars['String']['input']>;
  pair_gte?: InputMaybe<Scalars['String']['input']>;
  pair_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pair_lt?: InputMaybe<Scalars['String']['input']>;
  pair_lte?: InputMaybe<Scalars['String']['input']>;
  pair_not?: InputMaybe<Scalars['String']['input']>;
  pair_not_contains?: InputMaybe<Scalars['String']['input']>;
  pair_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pair_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pair_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pair_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pair_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pair_starts_with?: InputMaybe<Scalars['String']['input']>;
  pair_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  reserve0?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserve0_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserve0_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserve0_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  reserve0_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserve0_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserve0_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserve0_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  reserve1?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserve1_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserve1_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserve1_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  reserve1_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserve1_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserve1_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserve1_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  reserveUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserveUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserveUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserveUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  reserveUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserveUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserveUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserveUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  timestamp?: InputMaybe<Scalars['Int']['input']>;
  timestamp_gt?: InputMaybe<Scalars['Int']['input']>;
  timestamp_gte?: InputMaybe<Scalars['Int']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']['input']>;
  timestamp_lte?: InputMaybe<Scalars['Int']['input']>;
  timestamp_not?: InputMaybe<Scalars['Int']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  token0PriceUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  token0PriceUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  token0PriceUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  token0PriceUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  token0PriceUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  token0PriceUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  token0PriceUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  token0PriceUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  token1PriceUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  token1PriceUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  token1PriceUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  token1PriceUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  token1PriceUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  token1PriceUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  token1PriceUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  token1PriceUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  user?: InputMaybe<Scalars['String']['input']>;
  user_?: InputMaybe<User_Filter>;
  user_contains?: InputMaybe<Scalars['String']['input']>;
  user_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  user_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_gt?: InputMaybe<Scalars['String']['input']>;
  user_gte?: InputMaybe<Scalars['String']['input']>;
  user_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_lt?: InputMaybe<Scalars['String']['input']>;
  user_lte?: InputMaybe<Scalars['String']['input']>;
  user_not?: InputMaybe<Scalars['String']['input']>;
  user_not_contains?: InputMaybe<Scalars['String']['input']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export type LiquidityPositionSnapshot_OrderBy =
  | 'block'
  | 'id'
  | 'liquidityPosition'
  | 'liquidityPosition__block'
  | 'liquidityPosition__id'
  | 'liquidityPosition__liquidityTokenBalance'
  | 'liquidityPosition__timestamp'
  | 'liquidityTokenBalance'
  | 'liquidityTokenTotalSupply'
  | 'pair'
  | 'pair__block'
  | 'pair__id'
  | 'pair__liquidityProviderCount'
  | 'pair__name'
  | 'pair__reserve0'
  | 'pair__reserve1'
  | 'pair__reserveETH'
  | 'pair__reserveUSD'
  | 'pair__timestamp'
  | 'pair__token0Price'
  | 'pair__token1Price'
  | 'pair__totalSupply'
  | 'pair__trackedReserveETH'
  | 'pair__txCount'
  | 'pair__untrackedVolumeUSD'
  | 'pair__volumeToken0'
  | 'pair__volumeToken1'
  | 'pair__volumeUSD'
  | 'reserve0'
  | 'reserve1'
  | 'reserveUSD'
  | 'timestamp'
  | 'token0PriceUSD'
  | 'token1PriceUSD'
  | 'user'
  | 'user__id'
  | '%future added value';

export type LiquidityPosition_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<LiquidityPosition_Filter>>>;
  block?: InputMaybe<Scalars['Int']['input']>;
  block_gt?: InputMaybe<Scalars['Int']['input']>;
  block_gte?: InputMaybe<Scalars['Int']['input']>;
  block_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  block_lt?: InputMaybe<Scalars['Int']['input']>;
  block_lte?: InputMaybe<Scalars['Int']['input']>;
  block_not?: InputMaybe<Scalars['Int']['input']>;
  block_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  liquidityTokenBalance?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityTokenBalance_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityTokenBalance_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityTokenBalance_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  liquidityTokenBalance_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityTokenBalance_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityTokenBalance_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityTokenBalance_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  or?: InputMaybe<Array<InputMaybe<LiquidityPosition_Filter>>>;
  pair?: InputMaybe<Scalars['String']['input']>;
  pair_?: InputMaybe<Pair_Filter>;
  pair_contains?: InputMaybe<Scalars['String']['input']>;
  pair_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pair_ends_with?: InputMaybe<Scalars['String']['input']>;
  pair_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pair_gt?: InputMaybe<Scalars['String']['input']>;
  pair_gte?: InputMaybe<Scalars['String']['input']>;
  pair_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pair_lt?: InputMaybe<Scalars['String']['input']>;
  pair_lte?: InputMaybe<Scalars['String']['input']>;
  pair_not?: InputMaybe<Scalars['String']['input']>;
  pair_not_contains?: InputMaybe<Scalars['String']['input']>;
  pair_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pair_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pair_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pair_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pair_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pair_starts_with?: InputMaybe<Scalars['String']['input']>;
  pair_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  snapshots_?: InputMaybe<LiquidityPositionSnapshot_Filter>;
  timestamp?: InputMaybe<Scalars['Int']['input']>;
  timestamp_gt?: InputMaybe<Scalars['Int']['input']>;
  timestamp_gte?: InputMaybe<Scalars['Int']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']['input']>;
  timestamp_lte?: InputMaybe<Scalars['Int']['input']>;
  timestamp_not?: InputMaybe<Scalars['Int']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  user?: InputMaybe<Scalars['String']['input']>;
  user_?: InputMaybe<User_Filter>;
  user_contains?: InputMaybe<Scalars['String']['input']>;
  user_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  user_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_gt?: InputMaybe<Scalars['String']['input']>;
  user_gte?: InputMaybe<Scalars['String']['input']>;
  user_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_lt?: InputMaybe<Scalars['String']['input']>;
  user_lte?: InputMaybe<Scalars['String']['input']>;
  user_not?: InputMaybe<Scalars['String']['input']>;
  user_not_contains?: InputMaybe<Scalars['String']['input']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export type LiquidityPosition_OrderBy =
  | 'block'
  | 'id'
  | 'liquidityTokenBalance'
  | 'pair'
  | 'pair__block'
  | 'pair__id'
  | 'pair__liquidityProviderCount'
  | 'pair__name'
  | 'pair__reserve0'
  | 'pair__reserve1'
  | 'pair__reserveETH'
  | 'pair__reserveUSD'
  | 'pair__timestamp'
  | 'pair__token0Price'
  | 'pair__token1Price'
  | 'pair__totalSupply'
  | 'pair__trackedReserveETH'
  | 'pair__txCount'
  | 'pair__untrackedVolumeUSD'
  | 'pair__volumeToken0'
  | 'pair__volumeToken1'
  | 'pair__volumeUSD'
  | 'snapshots'
  | 'timestamp'
  | 'user'
  | 'user__id'
  | '%future added value';

export type Mint = {
  __typename?: 'Mint';
  amount0?: Maybe<Scalars['BigDecimal']['output']>;
  amount1?: Maybe<Scalars['BigDecimal']['output']>;
  amountUSD?: Maybe<Scalars['BigDecimal']['output']>;
  feeLiquidity?: Maybe<Scalars['BigDecimal']['output']>;
  feeTo?: Maybe<Scalars['Bytes']['output']>;
  id: Scalars['ID']['output'];
  liquidity: Scalars['BigDecimal']['output'];
  logIndex?: Maybe<Scalars['BigInt']['output']>;
  pair: Pair;
  sender?: Maybe<Scalars['Bytes']['output']>;
  timestamp: Scalars['BigInt']['output'];
  to: Scalars['Bytes']['output'];
  transaction: Transaction;
};

export type Mint_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount0?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount0_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount0_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount0_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amount0_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount0_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount0_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount0_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amount1?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount1_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount1_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount1_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amount1_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount1_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount1_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount1_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amountUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amountUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  and?: InputMaybe<Array<InputMaybe<Mint_Filter>>>;
  feeLiquidity?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeLiquidity_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeLiquidity_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeLiquidity_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  feeLiquidity_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeLiquidity_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeLiquidity_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  feeLiquidity_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  feeTo?: InputMaybe<Scalars['Bytes']['input']>;
  feeTo_contains?: InputMaybe<Scalars['Bytes']['input']>;
  feeTo_gt?: InputMaybe<Scalars['Bytes']['input']>;
  feeTo_gte?: InputMaybe<Scalars['Bytes']['input']>;
  feeTo_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  feeTo_lt?: InputMaybe<Scalars['Bytes']['input']>;
  feeTo_lte?: InputMaybe<Scalars['Bytes']['input']>;
  feeTo_not?: InputMaybe<Scalars['Bytes']['input']>;
  feeTo_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  feeTo_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  liquidity?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidity_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidity_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidity_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  liquidity_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidity_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidity_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidity_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  logIndex?: InputMaybe<Scalars['BigInt']['input']>;
  logIndex_gt?: InputMaybe<Scalars['BigInt']['input']>;
  logIndex_gte?: InputMaybe<Scalars['BigInt']['input']>;
  logIndex_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  logIndex_lt?: InputMaybe<Scalars['BigInt']['input']>;
  logIndex_lte?: InputMaybe<Scalars['BigInt']['input']>;
  logIndex_not?: InputMaybe<Scalars['BigInt']['input']>;
  logIndex_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Mint_Filter>>>;
  pair?: InputMaybe<Scalars['String']['input']>;
  pair_?: InputMaybe<Pair_Filter>;
  pair_contains?: InputMaybe<Scalars['String']['input']>;
  pair_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pair_ends_with?: InputMaybe<Scalars['String']['input']>;
  pair_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pair_gt?: InputMaybe<Scalars['String']['input']>;
  pair_gte?: InputMaybe<Scalars['String']['input']>;
  pair_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pair_lt?: InputMaybe<Scalars['String']['input']>;
  pair_lte?: InputMaybe<Scalars['String']['input']>;
  pair_not?: InputMaybe<Scalars['String']['input']>;
  pair_not_contains?: InputMaybe<Scalars['String']['input']>;
  pair_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pair_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pair_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pair_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pair_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pair_starts_with?: InputMaybe<Scalars['String']['input']>;
  pair_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sender?: InputMaybe<Scalars['Bytes']['input']>;
  sender_contains?: InputMaybe<Scalars['Bytes']['input']>;
  sender_gt?: InputMaybe<Scalars['Bytes']['input']>;
  sender_gte?: InputMaybe<Scalars['Bytes']['input']>;
  sender_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  sender_lt?: InputMaybe<Scalars['Bytes']['input']>;
  sender_lte?: InputMaybe<Scalars['Bytes']['input']>;
  sender_not?: InputMaybe<Scalars['Bytes']['input']>;
  sender_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  sender_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  to?: InputMaybe<Scalars['Bytes']['input']>;
  to_contains?: InputMaybe<Scalars['Bytes']['input']>;
  to_gt?: InputMaybe<Scalars['Bytes']['input']>;
  to_gte?: InputMaybe<Scalars['Bytes']['input']>;
  to_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  to_lt?: InputMaybe<Scalars['Bytes']['input']>;
  to_lte?: InputMaybe<Scalars['Bytes']['input']>;
  to_not?: InputMaybe<Scalars['Bytes']['input']>;
  to_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  to_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transaction?: InputMaybe<Scalars['String']['input']>;
  transaction_?: InputMaybe<Transaction_Filter>;
  transaction_contains?: InputMaybe<Scalars['String']['input']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_ends_with?: InputMaybe<Scalars['String']['input']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_gt?: InputMaybe<Scalars['String']['input']>;
  transaction_gte?: InputMaybe<Scalars['String']['input']>;
  transaction_in?: InputMaybe<Array<Scalars['String']['input']>>;
  transaction_lt?: InputMaybe<Scalars['String']['input']>;
  transaction_lte?: InputMaybe<Scalars['String']['input']>;
  transaction_not?: InputMaybe<Scalars['String']['input']>;
  transaction_not_contains?: InputMaybe<Scalars['String']['input']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_starts_with?: InputMaybe<Scalars['String']['input']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export type Mint_OrderBy =
  | 'amount0'
  | 'amount1'
  | 'amountUSD'
  | 'feeLiquidity'
  | 'feeTo'
  | 'id'
  | 'liquidity'
  | 'logIndex'
  | 'pair'
  | 'pair__block'
  | 'pair__id'
  | 'pair__liquidityProviderCount'
  | 'pair__name'
  | 'pair__reserve0'
  | 'pair__reserve1'
  | 'pair__reserveETH'
  | 'pair__reserveUSD'
  | 'pair__timestamp'
  | 'pair__token0Price'
  | 'pair__token1Price'
  | 'pair__totalSupply'
  | 'pair__trackedReserveETH'
  | 'pair__txCount'
  | 'pair__untrackedVolumeUSD'
  | 'pair__volumeToken0'
  | 'pair__volumeToken1'
  | 'pair__volumeUSD'
  | 'sender'
  | 'timestamp'
  | 'to'
  | 'transaction'
  | 'transaction__blockNumber'
  | 'transaction__id'
  | 'transaction__timestamp'
  | '%future added value';

/** Defines the order direction, either ascending or descending */
export type OrderDirection =
  | 'asc'
  | 'desc'
  | '%future added value';

export type Pair = {
  __typename?: 'Pair';
  block: Scalars['BigInt']['output'];
  burns: Array<Burn>;
  dayData: Array<PairDayData>;
  factory: Factory;
  hourData: Array<PairHourData>;
  id: Scalars['ID']['output'];
  liquidityPositionSnapshots: Array<LiquidityPositionSnapshot>;
  liquidityPositions: Array<LiquidityPosition>;
  liquidityProviderCount: Scalars['BigInt']['output'];
  mints: Array<Mint>;
  name: Scalars['String']['output'];
  reserve0: Scalars['BigDecimal']['output'];
  reserve1: Scalars['BigDecimal']['output'];
  reserveETH: Scalars['BigDecimal']['output'];
  reserveUSD: Scalars['BigDecimal']['output'];
  swaps: Array<Swap>;
  timestamp: Scalars['BigInt']['output'];
  token0: Token;
  token0Price: Scalars['BigDecimal']['output'];
  token1: Token;
  token1Price: Scalars['BigDecimal']['output'];
  totalSupply: Scalars['BigDecimal']['output'];
  trackedReserveETH: Scalars['BigDecimal']['output'];
  txCount: Scalars['BigInt']['output'];
  untrackedVolumeUSD: Scalars['BigDecimal']['output'];
  volumeToken0: Scalars['BigDecimal']['output'];
  volumeToken1: Scalars['BigDecimal']['output'];
  volumeUSD: Scalars['BigDecimal']['output'];
};


export type PairBurnsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Burn_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Burn_Filter>;
};


export type PairDayDataArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PairDayData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PairDayData_Filter>;
};


export type PairHourDataArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PairHourData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PairHourData_Filter>;
};


export type PairLiquidityPositionSnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<LiquidityPositionSnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<LiquidityPositionSnapshot_Filter>;
};


export type PairLiquidityPositionsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<LiquidityPosition_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<LiquidityPosition_Filter>;
};


export type PairMintsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Mint_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Mint_Filter>;
};


export type PairSwapsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Swap_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Swap_Filter>;
};

export type PairDayData = {
  __typename?: 'PairDayData';
  date: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  pair: Pair;
  reserve0: Scalars['BigDecimal']['output'];
  reserve1: Scalars['BigDecimal']['output'];
  reserveUSD: Scalars['BigDecimal']['output'];
  token0: Token;
  token1: Token;
  totalSupply: Scalars['BigDecimal']['output'];
  txCount: Scalars['BigInt']['output'];
  volumeToken0: Scalars['BigDecimal']['output'];
  volumeToken1: Scalars['BigDecimal']['output'];
  volumeUSD: Scalars['BigDecimal']['output'];
};

export type PairDayData_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<PairDayData_Filter>>>;
  date?: InputMaybe<Scalars['Int']['input']>;
  date_gt?: InputMaybe<Scalars['Int']['input']>;
  date_gte?: InputMaybe<Scalars['Int']['input']>;
  date_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  date_lt?: InputMaybe<Scalars['Int']['input']>;
  date_lte?: InputMaybe<Scalars['Int']['input']>;
  date_not?: InputMaybe<Scalars['Int']['input']>;
  date_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<PairDayData_Filter>>>;
  pair?: InputMaybe<Scalars['String']['input']>;
  pair_?: InputMaybe<Pair_Filter>;
  pair_contains?: InputMaybe<Scalars['String']['input']>;
  pair_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pair_ends_with?: InputMaybe<Scalars['String']['input']>;
  pair_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pair_gt?: InputMaybe<Scalars['String']['input']>;
  pair_gte?: InputMaybe<Scalars['String']['input']>;
  pair_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pair_lt?: InputMaybe<Scalars['String']['input']>;
  pair_lte?: InputMaybe<Scalars['String']['input']>;
  pair_not?: InputMaybe<Scalars['String']['input']>;
  pair_not_contains?: InputMaybe<Scalars['String']['input']>;
  pair_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pair_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pair_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pair_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pair_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pair_starts_with?: InputMaybe<Scalars['String']['input']>;
  pair_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  reserve0?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserve0_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserve0_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserve0_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  reserve0_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserve0_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserve0_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserve0_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  reserve1?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserve1_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserve1_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserve1_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  reserve1_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserve1_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserve1_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserve1_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  reserveUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserveUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserveUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserveUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  reserveUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserveUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserveUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserveUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  token0?: InputMaybe<Scalars['String']['input']>;
  token0_?: InputMaybe<Token_Filter>;
  token0_contains?: InputMaybe<Scalars['String']['input']>;
  token0_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token0_ends_with?: InputMaybe<Scalars['String']['input']>;
  token0_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token0_gt?: InputMaybe<Scalars['String']['input']>;
  token0_gte?: InputMaybe<Scalars['String']['input']>;
  token0_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token0_lt?: InputMaybe<Scalars['String']['input']>;
  token0_lte?: InputMaybe<Scalars['String']['input']>;
  token0_not?: InputMaybe<Scalars['String']['input']>;
  token0_not_contains?: InputMaybe<Scalars['String']['input']>;
  token0_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token0_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  token0_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token0_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token0_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  token0_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token0_starts_with?: InputMaybe<Scalars['String']['input']>;
  token0_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token1?: InputMaybe<Scalars['String']['input']>;
  token1_?: InputMaybe<Token_Filter>;
  token1_contains?: InputMaybe<Scalars['String']['input']>;
  token1_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token1_ends_with?: InputMaybe<Scalars['String']['input']>;
  token1_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token1_gt?: InputMaybe<Scalars['String']['input']>;
  token1_gte?: InputMaybe<Scalars['String']['input']>;
  token1_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token1_lt?: InputMaybe<Scalars['String']['input']>;
  token1_lte?: InputMaybe<Scalars['String']['input']>;
  token1_not?: InputMaybe<Scalars['String']['input']>;
  token1_not_contains?: InputMaybe<Scalars['String']['input']>;
  token1_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token1_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  token1_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token1_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token1_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  token1_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token1_starts_with?: InputMaybe<Scalars['String']['input']>;
  token1_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  totalSupply?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSupply_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSupply_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSupply_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalSupply_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSupply_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSupply_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSupply_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  txCount?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  txCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  volumeToken0?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeToken0_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeToken0_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeToken0_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeToken0_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeToken0_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeToken0_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeToken0_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeToken1?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeToken1_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeToken1_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeToken1_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeToken1_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeToken1_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeToken1_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeToken1_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
};

export type PairDayData_OrderBy =
  | 'date'
  | 'id'
  | 'pair'
  | 'pair__block'
  | 'pair__id'
  | 'pair__liquidityProviderCount'
  | 'pair__name'
  | 'pair__reserve0'
  | 'pair__reserve1'
  | 'pair__reserveETH'
  | 'pair__reserveUSD'
  | 'pair__timestamp'
  | 'pair__token0Price'
  | 'pair__token1Price'
  | 'pair__totalSupply'
  | 'pair__trackedReserveETH'
  | 'pair__txCount'
  | 'pair__untrackedVolumeUSD'
  | 'pair__volumeToken0'
  | 'pair__volumeToken1'
  | 'pair__volumeUSD'
  | 'reserve0'
  | 'reserve1'
  | 'reserveUSD'
  | 'token0'
  | 'token0__decimals'
  | 'token0__derivedETH'
  | 'token0__id'
  | 'token0__liquidity'
  | 'token0__name'
  | 'token0__symbol'
  | 'token0__totalSupply'
  | 'token0__txCount'
  | 'token0__untrackedVolumeUSD'
  | 'token0__volume'
  | 'token0__volumeUSD'
  | 'token1'
  | 'token1__decimals'
  | 'token1__derivedETH'
  | 'token1__id'
  | 'token1__liquidity'
  | 'token1__name'
  | 'token1__symbol'
  | 'token1__totalSupply'
  | 'token1__txCount'
  | 'token1__untrackedVolumeUSD'
  | 'token1__volume'
  | 'token1__volumeUSD'
  | 'totalSupply'
  | 'txCount'
  | 'volumeToken0'
  | 'volumeToken1'
  | 'volumeUSD'
  | '%future added value';

export type PairHourData = {
  __typename?: 'PairHourData';
  date: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  pair: Pair;
  reserve0: Scalars['BigDecimal']['output'];
  reserve1: Scalars['BigDecimal']['output'];
  reserveUSD: Scalars['BigDecimal']['output'];
  txCount: Scalars['BigInt']['output'];
  volumeToken0: Scalars['BigDecimal']['output'];
  volumeToken1: Scalars['BigDecimal']['output'];
  volumeUSD: Scalars['BigDecimal']['output'];
};

export type PairHourData_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<PairHourData_Filter>>>;
  date?: InputMaybe<Scalars['Int']['input']>;
  date_gt?: InputMaybe<Scalars['Int']['input']>;
  date_gte?: InputMaybe<Scalars['Int']['input']>;
  date_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  date_lt?: InputMaybe<Scalars['Int']['input']>;
  date_lte?: InputMaybe<Scalars['Int']['input']>;
  date_not?: InputMaybe<Scalars['Int']['input']>;
  date_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<PairHourData_Filter>>>;
  pair?: InputMaybe<Scalars['String']['input']>;
  pair_?: InputMaybe<Pair_Filter>;
  pair_contains?: InputMaybe<Scalars['String']['input']>;
  pair_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pair_ends_with?: InputMaybe<Scalars['String']['input']>;
  pair_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pair_gt?: InputMaybe<Scalars['String']['input']>;
  pair_gte?: InputMaybe<Scalars['String']['input']>;
  pair_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pair_lt?: InputMaybe<Scalars['String']['input']>;
  pair_lte?: InputMaybe<Scalars['String']['input']>;
  pair_not?: InputMaybe<Scalars['String']['input']>;
  pair_not_contains?: InputMaybe<Scalars['String']['input']>;
  pair_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pair_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pair_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pair_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pair_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pair_starts_with?: InputMaybe<Scalars['String']['input']>;
  pair_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  reserve0?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserve0_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserve0_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserve0_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  reserve0_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserve0_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserve0_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserve0_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  reserve1?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserve1_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserve1_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserve1_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  reserve1_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserve1_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserve1_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserve1_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  reserveUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserveUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserveUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserveUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  reserveUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserveUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserveUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserveUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  txCount?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  txCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  volumeToken0?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeToken0_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeToken0_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeToken0_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeToken0_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeToken0_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeToken0_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeToken0_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeToken1?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeToken1_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeToken1_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeToken1_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeToken1_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeToken1_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeToken1_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeToken1_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
};

export type PairHourData_OrderBy =
  | 'date'
  | 'id'
  | 'pair'
  | 'pair__block'
  | 'pair__id'
  | 'pair__liquidityProviderCount'
  | 'pair__name'
  | 'pair__reserve0'
  | 'pair__reserve1'
  | 'pair__reserveETH'
  | 'pair__reserveUSD'
  | 'pair__timestamp'
  | 'pair__token0Price'
  | 'pair__token1Price'
  | 'pair__totalSupply'
  | 'pair__trackedReserveETH'
  | 'pair__txCount'
  | 'pair__untrackedVolumeUSD'
  | 'pair__volumeToken0'
  | 'pair__volumeToken1'
  | 'pair__volumeUSD'
  | 'reserve0'
  | 'reserve1'
  | 'reserveUSD'
  | 'txCount'
  | 'volumeToken0'
  | 'volumeToken1'
  | 'volumeUSD'
  | '%future added value';

export type Pair_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Pair_Filter>>>;
  block?: InputMaybe<Scalars['BigInt']['input']>;
  block_gt?: InputMaybe<Scalars['BigInt']['input']>;
  block_gte?: InputMaybe<Scalars['BigInt']['input']>;
  block_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  block_lt?: InputMaybe<Scalars['BigInt']['input']>;
  block_lte?: InputMaybe<Scalars['BigInt']['input']>;
  block_not?: InputMaybe<Scalars['BigInt']['input']>;
  block_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  burns_?: InputMaybe<Burn_Filter>;
  dayData_?: InputMaybe<PairDayData_Filter>;
  factory?: InputMaybe<Scalars['String']['input']>;
  factory_?: InputMaybe<Factory_Filter>;
  factory_contains?: InputMaybe<Scalars['String']['input']>;
  factory_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  factory_ends_with?: InputMaybe<Scalars['String']['input']>;
  factory_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  factory_gt?: InputMaybe<Scalars['String']['input']>;
  factory_gte?: InputMaybe<Scalars['String']['input']>;
  factory_in?: InputMaybe<Array<Scalars['String']['input']>>;
  factory_lt?: InputMaybe<Scalars['String']['input']>;
  factory_lte?: InputMaybe<Scalars['String']['input']>;
  factory_not?: InputMaybe<Scalars['String']['input']>;
  factory_not_contains?: InputMaybe<Scalars['String']['input']>;
  factory_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  factory_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  factory_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  factory_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  factory_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  factory_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  factory_starts_with?: InputMaybe<Scalars['String']['input']>;
  factory_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hourData_?: InputMaybe<PairHourData_Filter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  liquidityPositionSnapshots_?: InputMaybe<LiquidityPositionSnapshot_Filter>;
  liquidityPositions_?: InputMaybe<LiquidityPosition_Filter>;
  liquidityProviderCount?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityProviderCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityProviderCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityProviderCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  liquidityProviderCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityProviderCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityProviderCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  liquidityProviderCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  mints_?: InputMaybe<Mint_Filter>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<Pair_Filter>>>;
  reserve0?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserve0_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserve0_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserve0_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  reserve0_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserve0_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserve0_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserve0_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  reserve1?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserve1_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserve1_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserve1_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  reserve1_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserve1_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserve1_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserve1_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  reserveETH?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserveETH_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserveETH_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserveETH_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  reserveETH_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserveETH_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserveETH_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserveETH_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  reserveUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserveUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserveUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserveUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  reserveUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserveUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserveUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  reserveUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  swaps_?: InputMaybe<Swap_Filter>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  token0?: InputMaybe<Scalars['String']['input']>;
  token0Price?: InputMaybe<Scalars['BigDecimal']['input']>;
  token0Price_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  token0Price_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  token0Price_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  token0Price_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  token0Price_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  token0Price_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  token0Price_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  token0_?: InputMaybe<Token_Filter>;
  token0_contains?: InputMaybe<Scalars['String']['input']>;
  token0_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token0_ends_with?: InputMaybe<Scalars['String']['input']>;
  token0_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token0_gt?: InputMaybe<Scalars['String']['input']>;
  token0_gte?: InputMaybe<Scalars['String']['input']>;
  token0_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token0_lt?: InputMaybe<Scalars['String']['input']>;
  token0_lte?: InputMaybe<Scalars['String']['input']>;
  token0_not?: InputMaybe<Scalars['String']['input']>;
  token0_not_contains?: InputMaybe<Scalars['String']['input']>;
  token0_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token0_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  token0_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token0_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token0_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  token0_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token0_starts_with?: InputMaybe<Scalars['String']['input']>;
  token0_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token1?: InputMaybe<Scalars['String']['input']>;
  token1Price?: InputMaybe<Scalars['BigDecimal']['input']>;
  token1Price_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  token1Price_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  token1Price_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  token1Price_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  token1Price_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  token1Price_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  token1Price_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  token1_?: InputMaybe<Token_Filter>;
  token1_contains?: InputMaybe<Scalars['String']['input']>;
  token1_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token1_ends_with?: InputMaybe<Scalars['String']['input']>;
  token1_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token1_gt?: InputMaybe<Scalars['String']['input']>;
  token1_gte?: InputMaybe<Scalars['String']['input']>;
  token1_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token1_lt?: InputMaybe<Scalars['String']['input']>;
  token1_lte?: InputMaybe<Scalars['String']['input']>;
  token1_not?: InputMaybe<Scalars['String']['input']>;
  token1_not_contains?: InputMaybe<Scalars['String']['input']>;
  token1_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token1_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  token1_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token1_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token1_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  token1_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token1_starts_with?: InputMaybe<Scalars['String']['input']>;
  token1_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  totalSupply?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSupply_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSupply_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSupply_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalSupply_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSupply_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSupply_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSupply_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  trackedReserveETH?: InputMaybe<Scalars['BigDecimal']['input']>;
  trackedReserveETH_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  trackedReserveETH_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  trackedReserveETH_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  trackedReserveETH_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  trackedReserveETH_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  trackedReserveETH_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  trackedReserveETH_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  txCount?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  txCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  untrackedVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  untrackedVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeToken0?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeToken0_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeToken0_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeToken0_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeToken0_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeToken0_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeToken0_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeToken0_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeToken1?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeToken1_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeToken1_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeToken1_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeToken1_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeToken1_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeToken1_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeToken1_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
};

export type Pair_OrderBy =
  | 'block'
  | 'burns'
  | 'dayData'
  | 'factory'
  | 'factory__id'
  | 'factory__liquidityETH'
  | 'factory__liquidityUSD'
  | 'factory__pairCount'
  | 'factory__tokenCount'
  | 'factory__txCount'
  | 'factory__untrackedVolumeUSD'
  | 'factory__userCount'
  | 'factory__volumeETH'
  | 'factory__volumeUSD'
  | 'hourData'
  | 'id'
  | 'liquidityPositionSnapshots'
  | 'liquidityPositions'
  | 'liquidityProviderCount'
  | 'mints'
  | 'name'
  | 'reserve0'
  | 'reserve1'
  | 'reserveETH'
  | 'reserveUSD'
  | 'swaps'
  | 'timestamp'
  | 'token0'
  | 'token0Price'
  | 'token0__decimals'
  | 'token0__derivedETH'
  | 'token0__id'
  | 'token0__liquidity'
  | 'token0__name'
  | 'token0__symbol'
  | 'token0__totalSupply'
  | 'token0__txCount'
  | 'token0__untrackedVolumeUSD'
  | 'token0__volume'
  | 'token0__volumeUSD'
  | 'token1'
  | 'token1Price'
  | 'token1__decimals'
  | 'token1__derivedETH'
  | 'token1__id'
  | 'token1__liquidity'
  | 'token1__name'
  | 'token1__symbol'
  | 'token1__totalSupply'
  | 'token1__txCount'
  | 'token1__untrackedVolumeUSD'
  | 'token1__volume'
  | 'token1__volumeUSD'
  | 'totalSupply'
  | 'trackedReserveETH'
  | 'txCount'
  | 'untrackedVolumeUSD'
  | 'volumeToken0'
  | 'volumeToken1'
  | 'volumeUSD'
  | '%future added value';

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  bundle?: Maybe<Bundle>;
  bundles: Array<Bundle>;
  burn?: Maybe<Burn>;
  burns: Array<Burn>;
  dayData?: Maybe<DayData>;
  dayDatas: Array<DayData>;
  factories: Array<Factory>;
  factory?: Maybe<Factory>;
  hourData?: Maybe<HourData>;
  hourDatas: Array<HourData>;
  liquidityPosition?: Maybe<LiquidityPosition>;
  liquidityPositionSnapshot?: Maybe<LiquidityPositionSnapshot>;
  liquidityPositionSnapshots: Array<LiquidityPositionSnapshot>;
  liquidityPositions: Array<LiquidityPosition>;
  mint?: Maybe<Mint>;
  mints: Array<Mint>;
  pair?: Maybe<Pair>;
  pairDayData?: Maybe<PairDayData>;
  pairDayDatas: Array<PairDayData>;
  pairHourData?: Maybe<PairHourData>;
  pairHourDatas: Array<PairHourData>;
  pairSearch: Array<Pair>;
  pairs: Array<Pair>;
  swap?: Maybe<Swap>;
  swaps: Array<Swap>;
  token?: Maybe<Token>;
  tokenDayData?: Maybe<TokenDayData>;
  tokenDayDatas: Array<TokenDayData>;
  tokenHourData?: Maybe<TokenHourData>;
  tokenHourDatas: Array<TokenHourData>;
  tokenSearch: Array<Token>;
  tokens: Array<Token>;
  transaction?: Maybe<Transaction>;
  transactions: Array<Transaction>;
  user?: Maybe<User>;
  userSearch: Array<User>;
  users: Array<User>;
};


export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type QueryBundleArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryBundlesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Bundle_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Bundle_Filter>;
};


export type QueryBurnArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryBurnsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Burn_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Burn_Filter>;
};


export type QueryDayDataArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryDayDatasArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DayData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DayData_Filter>;
};


export type QueryFactoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Factory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Factory_Filter>;
};


export type QueryFactoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryHourDataArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryHourDatasArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<HourData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<HourData_Filter>;
};


export type QueryLiquidityPositionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryLiquidityPositionSnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryLiquidityPositionSnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<LiquidityPositionSnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LiquidityPositionSnapshot_Filter>;
};


export type QueryLiquidityPositionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<LiquidityPosition_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LiquidityPosition_Filter>;
};


export type QueryMintArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMintsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Mint_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Mint_Filter>;
};


export type QueryPairArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPairDayDataArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPairDayDatasArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PairDayData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PairDayData_Filter>;
};


export type QueryPairHourDataArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPairHourDatasArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PairHourData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PairHourData_Filter>;
};


export type QueryPairSearchArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  text: Scalars['String']['input'];
  where?: InputMaybe<Pair_Filter>;
};


export type QueryPairsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Pair_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Pair_Filter>;
};


export type QuerySwapArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerySwapsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Swap_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Swap_Filter>;
};


export type QueryTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTokenDayDataArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTokenDayDatasArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokenDayData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenDayData_Filter>;
};


export type QueryTokenHourDataArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTokenHourDatasArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokenHourData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenHourData_Filter>;
};


export type QueryTokenSearchArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  text: Scalars['String']['input'];
  where?: InputMaybe<Token_Filter>;
};


export type QueryTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Token_Filter>;
};


export type QueryTransactionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTransactionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Transaction_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Transaction_Filter>;
};


export type QueryUserArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryUserSearchArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  text: Scalars['String']['input'];
  where?: InputMaybe<User_Filter>;
};


export type QueryUsersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<User_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<User_Filter>;
};

export type Subscription = {
  __typename?: 'Subscription';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  bundle?: Maybe<Bundle>;
  bundles: Array<Bundle>;
  burn?: Maybe<Burn>;
  burns: Array<Burn>;
  dayData?: Maybe<DayData>;
  dayDatas: Array<DayData>;
  factories: Array<Factory>;
  factory?: Maybe<Factory>;
  hourData?: Maybe<HourData>;
  hourDatas: Array<HourData>;
  liquidityPosition?: Maybe<LiquidityPosition>;
  liquidityPositionSnapshot?: Maybe<LiquidityPositionSnapshot>;
  liquidityPositionSnapshots: Array<LiquidityPositionSnapshot>;
  liquidityPositions: Array<LiquidityPosition>;
  mint?: Maybe<Mint>;
  mints: Array<Mint>;
  pair?: Maybe<Pair>;
  pairDayData?: Maybe<PairDayData>;
  pairDayDatas: Array<PairDayData>;
  pairHourData?: Maybe<PairHourData>;
  pairHourDatas: Array<PairHourData>;
  pairs: Array<Pair>;
  swap?: Maybe<Swap>;
  swaps: Array<Swap>;
  token?: Maybe<Token>;
  tokenDayData?: Maybe<TokenDayData>;
  tokenDayDatas: Array<TokenDayData>;
  tokenHourData?: Maybe<TokenHourData>;
  tokenHourDatas: Array<TokenHourData>;
  tokens: Array<Token>;
  transaction?: Maybe<Transaction>;
  transactions: Array<Transaction>;
  user?: Maybe<User>;
  users: Array<User>;
};


export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type SubscriptionBundleArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionBundlesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Bundle_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Bundle_Filter>;
};


export type SubscriptionBurnArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionBurnsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Burn_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Burn_Filter>;
};


export type SubscriptionDayDataArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionDayDatasArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<DayData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DayData_Filter>;
};


export type SubscriptionFactoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Factory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Factory_Filter>;
};


export type SubscriptionFactoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionHourDataArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionHourDatasArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<HourData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<HourData_Filter>;
};


export type SubscriptionLiquidityPositionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionLiquidityPositionSnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionLiquidityPositionSnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<LiquidityPositionSnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LiquidityPositionSnapshot_Filter>;
};


export type SubscriptionLiquidityPositionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<LiquidityPosition_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LiquidityPosition_Filter>;
};


export type SubscriptionMintArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMintsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Mint_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Mint_Filter>;
};


export type SubscriptionPairArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPairDayDataArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPairDayDatasArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PairDayData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PairDayData_Filter>;
};


export type SubscriptionPairHourDataArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPairHourDatasArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PairHourData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PairHourData_Filter>;
};


export type SubscriptionPairsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Pair_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Pair_Filter>;
};


export type SubscriptionSwapArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionSwapsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Swap_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Swap_Filter>;
};


export type SubscriptionTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionTokenDayDataArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionTokenDayDatasArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokenDayData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenDayData_Filter>;
};


export type SubscriptionTokenHourDataArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionTokenHourDatasArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokenHourData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenHourData_Filter>;
};


export type SubscriptionTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Token_Filter>;
};


export type SubscriptionTransactionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionTransactionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Transaction_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Transaction_Filter>;
};


export type SubscriptionUserArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionUsersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<User_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<User_Filter>;
};

export type Swap = {
  __typename?: 'Swap';
  amount0In: Scalars['BigDecimal']['output'];
  amount0Out: Scalars['BigDecimal']['output'];
  amount1In: Scalars['BigDecimal']['output'];
  amount1Out: Scalars['BigDecimal']['output'];
  amountUSD: Scalars['BigDecimal']['output'];
  id: Scalars['ID']['output'];
  logIndex?: Maybe<Scalars['BigInt']['output']>;
  pair: Pair;
  sender: Scalars['Bytes']['output'];
  timestamp: Scalars['BigInt']['output'];
  to: Scalars['Bytes']['output'];
  transaction: Transaction;
};

export type Swap_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount0In?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount0In_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount0In_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount0In_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amount0In_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount0In_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount0In_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount0In_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amount0Out?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount0Out_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount0Out_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount0Out_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amount0Out_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount0Out_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount0Out_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount0Out_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amount1In?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount1In_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount1In_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount1In_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amount1In_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount1In_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount1In_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount1In_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amount1Out?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount1Out_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount1Out_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount1Out_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amount1Out_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount1Out_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount1Out_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount1Out_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amountUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amountUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  and?: InputMaybe<Array<InputMaybe<Swap_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  logIndex?: InputMaybe<Scalars['BigInt']['input']>;
  logIndex_gt?: InputMaybe<Scalars['BigInt']['input']>;
  logIndex_gte?: InputMaybe<Scalars['BigInt']['input']>;
  logIndex_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  logIndex_lt?: InputMaybe<Scalars['BigInt']['input']>;
  logIndex_lte?: InputMaybe<Scalars['BigInt']['input']>;
  logIndex_not?: InputMaybe<Scalars['BigInt']['input']>;
  logIndex_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Swap_Filter>>>;
  pair?: InputMaybe<Scalars['String']['input']>;
  pair_?: InputMaybe<Pair_Filter>;
  pair_contains?: InputMaybe<Scalars['String']['input']>;
  pair_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pair_ends_with?: InputMaybe<Scalars['String']['input']>;
  pair_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pair_gt?: InputMaybe<Scalars['String']['input']>;
  pair_gte?: InputMaybe<Scalars['String']['input']>;
  pair_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pair_lt?: InputMaybe<Scalars['String']['input']>;
  pair_lte?: InputMaybe<Scalars['String']['input']>;
  pair_not?: InputMaybe<Scalars['String']['input']>;
  pair_not_contains?: InputMaybe<Scalars['String']['input']>;
  pair_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pair_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pair_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pair_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pair_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pair_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pair_starts_with?: InputMaybe<Scalars['String']['input']>;
  pair_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  sender?: InputMaybe<Scalars['Bytes']['input']>;
  sender_contains?: InputMaybe<Scalars['Bytes']['input']>;
  sender_gt?: InputMaybe<Scalars['Bytes']['input']>;
  sender_gte?: InputMaybe<Scalars['Bytes']['input']>;
  sender_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  sender_lt?: InputMaybe<Scalars['Bytes']['input']>;
  sender_lte?: InputMaybe<Scalars['Bytes']['input']>;
  sender_not?: InputMaybe<Scalars['Bytes']['input']>;
  sender_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  sender_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  to?: InputMaybe<Scalars['Bytes']['input']>;
  to_contains?: InputMaybe<Scalars['Bytes']['input']>;
  to_gt?: InputMaybe<Scalars['Bytes']['input']>;
  to_gte?: InputMaybe<Scalars['Bytes']['input']>;
  to_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  to_lt?: InputMaybe<Scalars['Bytes']['input']>;
  to_lte?: InputMaybe<Scalars['Bytes']['input']>;
  to_not?: InputMaybe<Scalars['Bytes']['input']>;
  to_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  to_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transaction?: InputMaybe<Scalars['String']['input']>;
  transaction_?: InputMaybe<Transaction_Filter>;
  transaction_contains?: InputMaybe<Scalars['String']['input']>;
  transaction_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_ends_with?: InputMaybe<Scalars['String']['input']>;
  transaction_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_gt?: InputMaybe<Scalars['String']['input']>;
  transaction_gte?: InputMaybe<Scalars['String']['input']>;
  transaction_in?: InputMaybe<Array<Scalars['String']['input']>>;
  transaction_lt?: InputMaybe<Scalars['String']['input']>;
  transaction_lte?: InputMaybe<Scalars['String']['input']>;
  transaction_not?: InputMaybe<Scalars['String']['input']>;
  transaction_not_contains?: InputMaybe<Scalars['String']['input']>;
  transaction_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  transaction_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  transaction_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transaction_starts_with?: InputMaybe<Scalars['String']['input']>;
  transaction_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export type Swap_OrderBy =
  | 'amount0In'
  | 'amount0Out'
  | 'amount1In'
  | 'amount1Out'
  | 'amountUSD'
  | 'id'
  | 'logIndex'
  | 'pair'
  | 'pair__block'
  | 'pair__id'
  | 'pair__liquidityProviderCount'
  | 'pair__name'
  | 'pair__reserve0'
  | 'pair__reserve1'
  | 'pair__reserveETH'
  | 'pair__reserveUSD'
  | 'pair__timestamp'
  | 'pair__token0Price'
  | 'pair__token1Price'
  | 'pair__totalSupply'
  | 'pair__trackedReserveETH'
  | 'pair__txCount'
  | 'pair__untrackedVolumeUSD'
  | 'pair__volumeToken0'
  | 'pair__volumeToken1'
  | 'pair__volumeUSD'
  | 'sender'
  | 'timestamp'
  | 'to'
  | 'transaction'
  | 'transaction__blockNumber'
  | 'transaction__id'
  | 'transaction__timestamp'
  | '%future added value';

export type Token = {
  __typename?: 'Token';
  basePairs: Array<Pair>;
  basePairsDayData: Array<PairDayData>;
  dayData: Array<TokenDayData>;
  decimals: Scalars['BigInt']['output'];
  derivedETH: Scalars['BigDecimal']['output'];
  factory: Factory;
  hourData: Array<TokenHourData>;
  id: Scalars['ID']['output'];
  liquidity: Scalars['BigDecimal']['output'];
  name: Scalars['String']['output'];
  quotePairs: Array<Pair>;
  quotePairsDayData: Array<PairDayData>;
  symbol: Scalars['String']['output'];
  totalSupply: Scalars['BigInt']['output'];
  txCount: Scalars['BigInt']['output'];
  untrackedVolumeUSD: Scalars['BigDecimal']['output'];
  volume: Scalars['BigDecimal']['output'];
  volumeUSD: Scalars['BigDecimal']['output'];
};


export type TokenBasePairsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Pair_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Pair_Filter>;
};


export type TokenBasePairsDayDataArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PairDayData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PairDayData_Filter>;
};


export type TokenDayDataArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokenDayData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<TokenDayData_Filter>;
};


export type TokenHourDataArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokenHourData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<TokenHourData_Filter>;
};


export type TokenQuotePairsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Pair_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Pair_Filter>;
};


export type TokenQuotePairsDayDataArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PairDayData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PairDayData_Filter>;
};

export type TokenDayData = {
  __typename?: 'TokenDayData';
  date: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  liquidity: Scalars['BigDecimal']['output'];
  liquidityETH: Scalars['BigDecimal']['output'];
  liquidityUSD: Scalars['BigDecimal']['output'];
  priceUSD: Scalars['BigDecimal']['output'];
  token: Token;
  txCount: Scalars['BigInt']['output'];
  volume: Scalars['BigDecimal']['output'];
  volumeETH: Scalars['BigDecimal']['output'];
  volumeUSD: Scalars['BigDecimal']['output'];
};

export type TokenDayData_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<TokenDayData_Filter>>>;
  date?: InputMaybe<Scalars['Int']['input']>;
  date_gt?: InputMaybe<Scalars['Int']['input']>;
  date_gte?: InputMaybe<Scalars['Int']['input']>;
  date_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  date_lt?: InputMaybe<Scalars['Int']['input']>;
  date_lte?: InputMaybe<Scalars['Int']['input']>;
  date_not?: InputMaybe<Scalars['Int']['input']>;
  date_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  liquidity?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityETH?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityETH_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityETH_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityETH_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  liquidityETH_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityETH_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityETH_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityETH_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  liquidityUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  liquidityUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  liquidity_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidity_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidity_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  liquidity_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidity_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidity_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidity_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  or?: InputMaybe<Array<InputMaybe<TokenDayData_Filter>>>;
  priceUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  priceUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  priceUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  priceUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  priceUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  priceUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  priceUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  priceUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  token?: InputMaybe<Scalars['String']['input']>;
  token_?: InputMaybe<Token_Filter>;
  token_contains?: InputMaybe<Scalars['String']['input']>;
  token_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_gt?: InputMaybe<Scalars['String']['input']>;
  token_gte?: InputMaybe<Scalars['String']['input']>;
  token_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_lt?: InputMaybe<Scalars['String']['input']>;
  token_lte?: InputMaybe<Scalars['String']['input']>;
  token_not?: InputMaybe<Scalars['String']['input']>;
  token_not_contains?: InputMaybe<Scalars['String']['input']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  txCount?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  txCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  volume?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeETH?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeETH_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeETH_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeETH_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeETH_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeETH_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeETH_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeETH_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volume_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volume_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volume_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volume_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volume_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volume_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  volume_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
};

export type TokenDayData_OrderBy =
  | 'date'
  | 'id'
  | 'liquidity'
  | 'liquidityETH'
  | 'liquidityUSD'
  | 'priceUSD'
  | 'token'
  | 'token__decimals'
  | 'token__derivedETH'
  | 'token__id'
  | 'token__liquidity'
  | 'token__name'
  | 'token__symbol'
  | 'token__totalSupply'
  | 'token__txCount'
  | 'token__untrackedVolumeUSD'
  | 'token__volume'
  | 'token__volumeUSD'
  | 'txCount'
  | 'volume'
  | 'volumeETH'
  | 'volumeUSD'
  | '%future added value';

export type TokenHourData = {
  __typename?: 'TokenHourData';
  date: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  liquidity: Scalars['BigDecimal']['output'];
  liquidityETH: Scalars['BigDecimal']['output'];
  liquidityUSD: Scalars['BigDecimal']['output'];
  priceUSD: Scalars['BigDecimal']['output'];
  token: Token;
  txCount: Scalars['BigInt']['output'];
  volume: Scalars['BigDecimal']['output'];
  volumeETH: Scalars['BigDecimal']['output'];
  volumeUSD: Scalars['BigDecimal']['output'];
};

export type TokenHourData_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<TokenHourData_Filter>>>;
  date?: InputMaybe<Scalars['Int']['input']>;
  date_gt?: InputMaybe<Scalars['Int']['input']>;
  date_gte?: InputMaybe<Scalars['Int']['input']>;
  date_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  date_lt?: InputMaybe<Scalars['Int']['input']>;
  date_lte?: InputMaybe<Scalars['Int']['input']>;
  date_not?: InputMaybe<Scalars['Int']['input']>;
  date_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  liquidity?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityETH?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityETH_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityETH_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityETH_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  liquidityETH_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityETH_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityETH_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityETH_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  liquidityUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  liquidityUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidityUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  liquidity_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidity_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidity_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  liquidity_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidity_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidity_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidity_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  or?: InputMaybe<Array<InputMaybe<TokenHourData_Filter>>>;
  priceUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  priceUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  priceUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  priceUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  priceUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  priceUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  priceUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  priceUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  token?: InputMaybe<Scalars['String']['input']>;
  token_?: InputMaybe<Token_Filter>;
  token_contains?: InputMaybe<Scalars['String']['input']>;
  token_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_gt?: InputMaybe<Scalars['String']['input']>;
  token_gte?: InputMaybe<Scalars['String']['input']>;
  token_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_lt?: InputMaybe<Scalars['String']['input']>;
  token_lte?: InputMaybe<Scalars['String']['input']>;
  token_not?: InputMaybe<Scalars['String']['input']>;
  token_not_contains?: InputMaybe<Scalars['String']['input']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_starts_with?: InputMaybe<Scalars['String']['input']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  txCount?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  txCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  volume?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeETH?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeETH_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeETH_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeETH_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeETH_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeETH_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeETH_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeETH_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volume_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volume_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volume_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volume_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volume_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volume_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  volume_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
};

export type TokenHourData_OrderBy =
  | 'date'
  | 'id'
  | 'liquidity'
  | 'liquidityETH'
  | 'liquidityUSD'
  | 'priceUSD'
  | 'token'
  | 'token__decimals'
  | 'token__derivedETH'
  | 'token__id'
  | 'token__liquidity'
  | 'token__name'
  | 'token__symbol'
  | 'token__totalSupply'
  | 'token__txCount'
  | 'token__untrackedVolumeUSD'
  | 'token__volume'
  | 'token__volumeUSD'
  | 'txCount'
  | 'volume'
  | 'volumeETH'
  | 'volumeUSD'
  | '%future added value';

export type Token_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Token_Filter>>>;
  basePairsDayData_?: InputMaybe<PairDayData_Filter>;
  basePairs_?: InputMaybe<Pair_Filter>;
  dayData_?: InputMaybe<TokenDayData_Filter>;
  decimals?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_gt?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_gte?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  decimals_lt?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_lte?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_not?: InputMaybe<Scalars['BigInt']['input']>;
  decimals_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  derivedETH?: InputMaybe<Scalars['BigDecimal']['input']>;
  derivedETH_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  derivedETH_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  derivedETH_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  derivedETH_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  derivedETH_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  derivedETH_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  derivedETH_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  factory?: InputMaybe<Scalars['String']['input']>;
  factory_?: InputMaybe<Factory_Filter>;
  factory_contains?: InputMaybe<Scalars['String']['input']>;
  factory_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  factory_ends_with?: InputMaybe<Scalars['String']['input']>;
  factory_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  factory_gt?: InputMaybe<Scalars['String']['input']>;
  factory_gte?: InputMaybe<Scalars['String']['input']>;
  factory_in?: InputMaybe<Array<Scalars['String']['input']>>;
  factory_lt?: InputMaybe<Scalars['String']['input']>;
  factory_lte?: InputMaybe<Scalars['String']['input']>;
  factory_not?: InputMaybe<Scalars['String']['input']>;
  factory_not_contains?: InputMaybe<Scalars['String']['input']>;
  factory_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  factory_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  factory_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  factory_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  factory_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  factory_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  factory_starts_with?: InputMaybe<Scalars['String']['input']>;
  factory_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  hourData_?: InputMaybe<TokenHourData_Filter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  liquidity?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidity_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidity_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidity_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  liquidity_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidity_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidity_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  liquidity_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_contains?: InputMaybe<Scalars['String']['input']>;
  name_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_gt?: InputMaybe<Scalars['String']['input']>;
  name_gte?: InputMaybe<Scalars['String']['input']>;
  name_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_lt?: InputMaybe<Scalars['String']['input']>;
  name_lte?: InputMaybe<Scalars['String']['input']>;
  name_not?: InputMaybe<Scalars['String']['input']>;
  name_not_contains?: InputMaybe<Scalars['String']['input']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  name_starts_with?: InputMaybe<Scalars['String']['input']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<Token_Filter>>>;
  quotePairsDayData_?: InputMaybe<PairDayData_Filter>;
  quotePairs_?: InputMaybe<Pair_Filter>;
  symbol?: InputMaybe<Scalars['String']['input']>;
  symbol_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_gt?: InputMaybe<Scalars['String']['input']>;
  symbol_gte?: InputMaybe<Scalars['String']['input']>;
  symbol_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_lt?: InputMaybe<Scalars['String']['input']>;
  symbol_lte?: InputMaybe<Scalars['String']['input']>;
  symbol_not?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains?: InputMaybe<Scalars['String']['input']>;
  symbol_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  symbol_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  symbol_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  symbol_starts_with?: InputMaybe<Scalars['String']['input']>;
  symbol_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  totalSupply?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalSupply_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalSupply_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  txCount?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  txCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  txCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  untrackedVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  untrackedVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  untrackedVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volume?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  volumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volume_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volume_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volume_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  volume_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  volume_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  volume_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  volume_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
};

export type Token_OrderBy =
  | 'basePairs'
  | 'basePairsDayData'
  | 'dayData'
  | 'decimals'
  | 'derivedETH'
  | 'factory'
  | 'factory__id'
  | 'factory__liquidityETH'
  | 'factory__liquidityUSD'
  | 'factory__pairCount'
  | 'factory__tokenCount'
  | 'factory__txCount'
  | 'factory__untrackedVolumeUSD'
  | 'factory__userCount'
  | 'factory__volumeETH'
  | 'factory__volumeUSD'
  | 'hourData'
  | 'id'
  | 'liquidity'
  | 'name'
  | 'quotePairs'
  | 'quotePairsDayData'
  | 'symbol'
  | 'totalSupply'
  | 'txCount'
  | 'untrackedVolumeUSD'
  | 'volume'
  | 'volumeUSD'
  | '%future added value';

export type Transaction = {
  __typename?: 'Transaction';
  blockNumber: Scalars['BigInt']['output'];
  burns: Array<Maybe<Burn>>;
  id: Scalars['ID']['output'];
  mints: Array<Maybe<Mint>>;
  swaps: Array<Maybe<Swap>>;
  timestamp: Scalars['BigInt']['output'];
};


export type TransactionBurnsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Burn_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Burn_Filter>;
};


export type TransactionMintsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Mint_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Mint_Filter>;
};


export type TransactionSwapsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Swap_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Swap_Filter>;
};

export type Transaction_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Transaction_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  burns?: InputMaybe<Array<Scalars['String']['input']>>;
  burns_?: InputMaybe<Burn_Filter>;
  burns_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  burns_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  burns_not?: InputMaybe<Array<Scalars['String']['input']>>;
  burns_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  burns_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  mints?: InputMaybe<Array<Scalars['String']['input']>>;
  mints_?: InputMaybe<Mint_Filter>;
  mints_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  mints_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  mints_not?: InputMaybe<Array<Scalars['String']['input']>>;
  mints_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  mints_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Transaction_Filter>>>;
  swaps?: InputMaybe<Array<Scalars['String']['input']>>;
  swaps_?: InputMaybe<Swap_Filter>;
  swaps_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  swaps_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  swaps_not?: InputMaybe<Array<Scalars['String']['input']>>;
  swaps_not_contains?: InputMaybe<Array<Scalars['String']['input']>>;
  swaps_not_contains_nocase?: InputMaybe<Array<Scalars['String']['input']>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type Transaction_OrderBy =
  | 'blockNumber'
  | 'burns'
  | 'id'
  | 'mints'
  | 'swaps'
  | 'timestamp'
  | '%future added value';

export type User = {
  __typename?: 'User';
  id: Scalars['ID']['output'];
  liquidityPositions: Array<LiquidityPosition>;
};


export type UserLiquidityPositionsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<LiquidityPosition_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<LiquidityPosition_Filter>;
};

export type User_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<User_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  liquidityPositions_?: InputMaybe<LiquidityPosition_Filter>;
  or?: InputMaybe<Array<InputMaybe<User_Filter>>>;
};

export type User_OrderBy =
  | 'id'
  | 'liquidityPositions'
  | '%future added value';

export type _Block_ = {
  __typename?: '_Block_';
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']['output']>;
  /** The block number */
  number: Scalars['Int']['output'];
  /** The hash of the parent block */
  parentHash?: Maybe<Scalars['Bytes']['output']>;
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']['output']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  __typename?: '_Meta_';
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String']['output'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean']['output'];
};

export type _SubgraphErrorPolicy_ =
  /** Data will be returned even if the subgraph has indexing errors */
  | 'allow'
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  | 'deny'
  | '%future added value';

export type PairsWhereTokensQueryVariables = Exact<{
  token0: Scalars['String']['input'];
  token1: Scalars['String']['input'];
  reserveUSDThreshold: Scalars['BigDecimal']['input'];
}>;


export type PairsWhereTokensQuery = { __typename?: 'Query', pairs: Array<{ __typename?: 'Pair', id: string, reserveUSD: any }> };


export const PairsWhereTokensDocument = gql`
    query pairsWhereTokens($token0: String!, $token1: String!, $reserveUSDThreshold: BigDecimal!) {
  pairs(
    where: {or: [{token0: $token0, token1: $token1, reserveUSD_gt: $reserveUSDThreshold}, {token0: $token1, token1: $token0, reserveUSD_gt: $reserveUSDThreshold}]}
    orderBy: reserveUSD
    orderDirection: desc
  ) {
    id
    reserveUSD
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    pairsWhereTokens(variables: PairsWhereTokensQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<PairsWhereTokensQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<PairsWhereTokensQuery>(PairsWhereTokensDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'pairsWhereTokens', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;
export function getSdkWithHooks(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  const sdk = getSdk(client, withWrapper);
  const genKey = <V extends Record<string, unknown> = Record<string, unknown>>(name: string, object: V = {} as V): SWRKeyInterface => [name, ...Object.keys(object).sort().map(key => object[key])];
  return {
    ...sdk,
    usePairsWhereTokens(variables: PairsWhereTokensQueryVariables, config?: SWRConfigInterface<PairsWhereTokensQuery, ClientError>) {
      return useSWR<PairsWhereTokensQuery, ClientError>(genKey<PairsWhereTokensQueryVariables>('PairsWhereTokens', variables), () => sdk.pairsWhereTokens(variables), config);
    }
  };
}
export type SdkWithHooks = ReturnType<typeof getSdkWithHooks>;