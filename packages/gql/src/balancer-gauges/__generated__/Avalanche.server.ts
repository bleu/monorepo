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
  BigDecimal: { input: any; output: any; }
  BigInt: { input: any; output: any; }
  Bytes: { input: any; output: any; }
  Int8: { input: any; output: any; }
};

export type BlockChangedFilter = {
  number_gte: Scalars['Int']['input'];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  number?: InputMaybe<Scalars['Int']['input']>;
  number_gte?: InputMaybe<Scalars['Int']['input']>;
};

export type Chain =
  | 'Arbitrum'
  | 'Avalanche'
  | 'Base'
  | 'Gnosis'
  | 'Optimism'
  | 'Polygon'
  | 'PolygonZkEvm'
  | '%future added value';

export type Gauge = {
  __typename?: 'Gauge';
  /**  Timestamp at which Balancer DAO added the gauge to GaugeController [seconds]  */
  addedTimestamp: Scalars['Int']['output'];
  /**  Address of the gauge  */
  address: Scalars['Bytes']['output'];
  /**  Equal to: <gaugeAddress>-<typeID>  */
  id: Scalars['ID']['output'];
  /**  Reference to LiquidityGauge  */
  liquidityGauge?: Maybe<LiquidityGauge>;
  /**  Reference to RootGauge  */
  rootGauge?: Maybe<RootGauge>;
  /**  Type of the gauge  */
  type: GaugeType;
};

export type GaugeFactory = {
  __typename?: 'GaugeFactory';
  /**  List of gauges created through the factory  */
  gauges?: Maybe<Array<LiquidityGauge>>;
  /**  Factory contract address  */
  id: Scalars['ID']['output'];
  /**  Number of gauges created through the factory  */
  numGauges: Scalars['Int']['output'];
};


export type GaugeFactoryGaugesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<LiquidityGauge_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<LiquidityGauge_Filter>;
};

export type GaugeFactory_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<GaugeFactory_Filter>>>;
  gauges_?: InputMaybe<LiquidityGauge_Filter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  numGauges?: InputMaybe<Scalars['Int']['input']>;
  numGauges_gt?: InputMaybe<Scalars['Int']['input']>;
  numGauges_gte?: InputMaybe<Scalars['Int']['input']>;
  numGauges_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  numGauges_lt?: InputMaybe<Scalars['Int']['input']>;
  numGauges_lte?: InputMaybe<Scalars['Int']['input']>;
  numGauges_not?: InputMaybe<Scalars['Int']['input']>;
  numGauges_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  or?: InputMaybe<Array<InputMaybe<GaugeFactory_Filter>>>;
};

export type GaugeFactory_OrderBy =
  | 'gauges'
  | 'id'
  | 'numGauges'
  | '%future added value';

export type GaugeInjector = {
  __typename?: 'GaugeInjector';
  /**  GaugeInjector contract address  */
  id: Scalars['ID']['output'];
};

export type GaugeInjector_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<GaugeInjector_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<GaugeInjector_Filter>>>;
};

export type GaugeInjector_OrderBy =
  | 'id'
  | '%future added value';

export type GaugeShare = {
  __typename?: 'GaugeShare';
  /**  User's balance of gauge deposit tokens  */
  balance: Scalars['BigDecimal']['output'];
  /**  Reference to LiquidityGauge entity  */
  gauge: LiquidityGauge;
  /**  Equal to: <userAddress>-<gaugeAddress>  */
  id: Scalars['ID']['output'];
  /**  Reference to User entity  */
  user: User;
};

export type GaugeShare_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<GaugeShare_Filter>>>;
  balance?: InputMaybe<Scalars['BigDecimal']['input']>;
  balance_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  balance_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  balance_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  balance_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  balance_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  balance_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  balance_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  gauge?: InputMaybe<Scalars['String']['input']>;
  gauge_?: InputMaybe<LiquidityGauge_Filter>;
  gauge_contains?: InputMaybe<Scalars['String']['input']>;
  gauge_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  gauge_ends_with?: InputMaybe<Scalars['String']['input']>;
  gauge_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  gauge_gt?: InputMaybe<Scalars['String']['input']>;
  gauge_gte?: InputMaybe<Scalars['String']['input']>;
  gauge_in?: InputMaybe<Array<Scalars['String']['input']>>;
  gauge_lt?: InputMaybe<Scalars['String']['input']>;
  gauge_lte?: InputMaybe<Scalars['String']['input']>;
  gauge_not?: InputMaybe<Scalars['String']['input']>;
  gauge_not_contains?: InputMaybe<Scalars['String']['input']>;
  gauge_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  gauge_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  gauge_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  gauge_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  gauge_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  gauge_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  gauge_starts_with?: InputMaybe<Scalars['String']['input']>;
  gauge_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<GaugeShare_Filter>>>;
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

export type GaugeShare_OrderBy =
  | 'balance'
  | 'gauge'
  | 'gauge__id'
  | 'gauge__isKilled'
  | 'gauge__isPreferentialGauge'
  | 'gauge__poolAddress'
  | 'gauge__poolId'
  | 'gauge__relativeWeightCap'
  | 'gauge__streamer'
  | 'gauge__symbol'
  | 'gauge__totalSupply'
  | 'id'
  | 'user'
  | 'user__id'
  | '%future added value';

export type GaugeType = {
  __typename?: 'GaugeType';
  /**  Type ID  */
  id: Scalars['ID']['output'];
  /**  Name of the type - empty string if call reverts  */
  name: Scalars['String']['output'];
};

export type GaugeType_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<GaugeType_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
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
  or?: InputMaybe<Array<InputMaybe<GaugeType_Filter>>>;
};

export type GaugeType_OrderBy =
  | 'id'
  | 'name'
  | '%future added value';

export type GaugeVote = {
  __typename?: 'GaugeVote';
  /**  Reference to Gauge entity  */
  gauge: Gauge;
  /**  Equal to: <userAddress>-<gaugeAddress>  */
  id: Scalars['ID']['output'];
  /**  Timestamp at which user voted [seconds]  */
  timestamp?: Maybe<Scalars['BigInt']['output']>;
  /**  Reference to User entity  */
  user: User;
  /**  Weight of veBAL power user has used to vote  */
  weight?: Maybe<Scalars['BigDecimal']['output']>;
};

export type GaugeVote_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<GaugeVote_Filter>>>;
  gauge?: InputMaybe<Scalars['String']['input']>;
  gauge_?: InputMaybe<Gauge_Filter>;
  gauge_contains?: InputMaybe<Scalars['String']['input']>;
  gauge_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  gauge_ends_with?: InputMaybe<Scalars['String']['input']>;
  gauge_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  gauge_gt?: InputMaybe<Scalars['String']['input']>;
  gauge_gte?: InputMaybe<Scalars['String']['input']>;
  gauge_in?: InputMaybe<Array<Scalars['String']['input']>>;
  gauge_lt?: InputMaybe<Scalars['String']['input']>;
  gauge_lte?: InputMaybe<Scalars['String']['input']>;
  gauge_not?: InputMaybe<Scalars['String']['input']>;
  gauge_not_contains?: InputMaybe<Scalars['String']['input']>;
  gauge_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  gauge_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  gauge_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  gauge_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  gauge_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  gauge_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  gauge_starts_with?: InputMaybe<Scalars['String']['input']>;
  gauge_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<GaugeVote_Filter>>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  weight?: InputMaybe<Scalars['BigDecimal']['input']>;
  weight_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  weight_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  weight_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  weight_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  weight_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  weight_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  weight_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
};

export type GaugeVote_OrderBy =
  | 'gauge'
  | 'gauge__addedTimestamp'
  | 'gauge__address'
  | 'gauge__id'
  | 'id'
  | 'timestamp'
  | 'user'
  | 'user__id'
  | 'weight'
  | '%future added value';

export type Gauge_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  addedTimestamp?: InputMaybe<Scalars['Int']['input']>;
  addedTimestamp_gt?: InputMaybe<Scalars['Int']['input']>;
  addedTimestamp_gte?: InputMaybe<Scalars['Int']['input']>;
  addedTimestamp_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  addedTimestamp_lt?: InputMaybe<Scalars['Int']['input']>;
  addedTimestamp_lte?: InputMaybe<Scalars['Int']['input']>;
  addedTimestamp_not?: InputMaybe<Scalars['Int']['input']>;
  addedTimestamp_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  address?: InputMaybe<Scalars['Bytes']['input']>;
  address_contains?: InputMaybe<Scalars['Bytes']['input']>;
  address_gt?: InputMaybe<Scalars['Bytes']['input']>;
  address_gte?: InputMaybe<Scalars['Bytes']['input']>;
  address_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  address_lt?: InputMaybe<Scalars['Bytes']['input']>;
  address_lte?: InputMaybe<Scalars['Bytes']['input']>;
  address_not?: InputMaybe<Scalars['Bytes']['input']>;
  address_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  address_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  and?: InputMaybe<Array<InputMaybe<Gauge_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  liquidityGauge?: InputMaybe<Scalars['String']['input']>;
  liquidityGauge_?: InputMaybe<LiquidityGauge_Filter>;
  liquidityGauge_contains?: InputMaybe<Scalars['String']['input']>;
  liquidityGauge_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  liquidityGauge_ends_with?: InputMaybe<Scalars['String']['input']>;
  liquidityGauge_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  liquidityGauge_gt?: InputMaybe<Scalars['String']['input']>;
  liquidityGauge_gte?: InputMaybe<Scalars['String']['input']>;
  liquidityGauge_in?: InputMaybe<Array<Scalars['String']['input']>>;
  liquidityGauge_lt?: InputMaybe<Scalars['String']['input']>;
  liquidityGauge_lte?: InputMaybe<Scalars['String']['input']>;
  liquidityGauge_not?: InputMaybe<Scalars['String']['input']>;
  liquidityGauge_not_contains?: InputMaybe<Scalars['String']['input']>;
  liquidityGauge_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  liquidityGauge_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  liquidityGauge_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  liquidityGauge_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  liquidityGauge_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  liquidityGauge_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  liquidityGauge_starts_with?: InputMaybe<Scalars['String']['input']>;
  liquidityGauge_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<Gauge_Filter>>>;
  rootGauge?: InputMaybe<Scalars['String']['input']>;
  rootGauge_?: InputMaybe<RootGauge_Filter>;
  rootGauge_contains?: InputMaybe<Scalars['String']['input']>;
  rootGauge_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  rootGauge_ends_with?: InputMaybe<Scalars['String']['input']>;
  rootGauge_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rootGauge_gt?: InputMaybe<Scalars['String']['input']>;
  rootGauge_gte?: InputMaybe<Scalars['String']['input']>;
  rootGauge_in?: InputMaybe<Array<Scalars['String']['input']>>;
  rootGauge_lt?: InputMaybe<Scalars['String']['input']>;
  rootGauge_lte?: InputMaybe<Scalars['String']['input']>;
  rootGauge_not?: InputMaybe<Scalars['String']['input']>;
  rootGauge_not_contains?: InputMaybe<Scalars['String']['input']>;
  rootGauge_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  rootGauge_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  rootGauge_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rootGauge_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  rootGauge_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  rootGauge_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rootGauge_starts_with?: InputMaybe<Scalars['String']['input']>;
  rootGauge_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  type_?: InputMaybe<GaugeType_Filter>;
  type_contains?: InputMaybe<Scalars['String']['input']>;
  type_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  type_ends_with?: InputMaybe<Scalars['String']['input']>;
  type_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  type_gt?: InputMaybe<Scalars['String']['input']>;
  type_gte?: InputMaybe<Scalars['String']['input']>;
  type_in?: InputMaybe<Array<Scalars['String']['input']>>;
  type_lt?: InputMaybe<Scalars['String']['input']>;
  type_lte?: InputMaybe<Scalars['String']['input']>;
  type_not?: InputMaybe<Scalars['String']['input']>;
  type_not_contains?: InputMaybe<Scalars['String']['input']>;
  type_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  type_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  type_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  type_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  type_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  type_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  type_starts_with?: InputMaybe<Scalars['String']['input']>;
  type_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export type Gauge_OrderBy =
  | 'addedTimestamp'
  | 'address'
  | 'id'
  | 'liquidityGauge'
  | 'liquidityGauge__id'
  | 'liquidityGauge__isKilled'
  | 'liquidityGauge__isPreferentialGauge'
  | 'liquidityGauge__poolAddress'
  | 'liquidityGauge__poolId'
  | 'liquidityGauge__relativeWeightCap'
  | 'liquidityGauge__streamer'
  | 'liquidityGauge__symbol'
  | 'liquidityGauge__totalSupply'
  | 'rootGauge'
  | 'rootGauge__chain'
  | 'rootGauge__id'
  | 'rootGauge__isKilled'
  | 'rootGauge__recipient'
  | 'rootGauge__relativeWeightCap'
  | 'type'
  | 'type__id'
  | 'type__name'
  | '%future added value';

export type LiquidityGauge = {
  __typename?: 'LiquidityGauge';
  /**  Factory contract address  */
  factory: GaugeFactory;
  /**  Reference to Gauge entity - created when LiquidityGauge is added to GaugeController */
  gauge?: Maybe<Gauge>;
  /**  LiquidityGauge contract address  */
  id: Scalars['ID']['output'];
  /**  Whether Balancer DAO killed the gauge  */
  isKilled: Scalars['Boolean']['output'];
  /**  Whether the LiquidityGauge is the most recent added to GaugeController  */
  isPreferentialGauge: Scalars['Boolean']['output'];
  /**  Reference to Pool entity  */
  pool?: Maybe<Pool>;
  /**  Address of the pool (lp_token of the gauge)  */
  poolAddress: Scalars['Bytes']['output'];
  /**  Pool ID if lp_token is a Balancer pool; null otherwise  */
  poolId?: Maybe<Scalars['Bytes']['output']>;
  /**  Relative weight cap of the gauge (0.01 = 1%) - V2 factories only  */
  relativeWeightCap?: Maybe<Scalars['BigDecimal']['output']>;
  /**  List of reward tokens depositted in the gauge - ChildChainLiquidityGauge only  */
  rewardTokensList?: Maybe<Array<Scalars['Bytes']['output']>>;
  /**  List of user shares  */
  shares?: Maybe<Array<GaugeShare>>;
  /**  Address of the contract that streams reward tokens to the gauge - ChildChainLiquidityGauge only  */
  streamer?: Maybe<Scalars['Bytes']['output']>;
  /**  ERC20 token symbol  */
  symbol: Scalars['String']['output'];
  /**  List of reward tokens depositted in the gauge  */
  tokens?: Maybe<Array<RewardToken>>;
  /**  Total of BPTs users have staked in the LiquidityGauge  */
  totalSupply: Scalars['BigDecimal']['output'];
};


export type LiquidityGaugeSharesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GaugeShare_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<GaugeShare_Filter>;
};


export type LiquidityGaugeTokensArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RewardToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<RewardToken_Filter>;
};

export type LiquidityGauge_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<LiquidityGauge_Filter>>>;
  factory?: InputMaybe<Scalars['String']['input']>;
  factory_?: InputMaybe<GaugeFactory_Filter>;
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
  gauge?: InputMaybe<Scalars['String']['input']>;
  gauge_?: InputMaybe<Gauge_Filter>;
  gauge_contains?: InputMaybe<Scalars['String']['input']>;
  gauge_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  gauge_ends_with?: InputMaybe<Scalars['String']['input']>;
  gauge_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  gauge_gt?: InputMaybe<Scalars['String']['input']>;
  gauge_gte?: InputMaybe<Scalars['String']['input']>;
  gauge_in?: InputMaybe<Array<Scalars['String']['input']>>;
  gauge_lt?: InputMaybe<Scalars['String']['input']>;
  gauge_lte?: InputMaybe<Scalars['String']['input']>;
  gauge_not?: InputMaybe<Scalars['String']['input']>;
  gauge_not_contains?: InputMaybe<Scalars['String']['input']>;
  gauge_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  gauge_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  gauge_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  gauge_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  gauge_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  gauge_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  gauge_starts_with?: InputMaybe<Scalars['String']['input']>;
  gauge_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  isKilled?: InputMaybe<Scalars['Boolean']['input']>;
  isKilled_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isKilled_not?: InputMaybe<Scalars['Boolean']['input']>;
  isKilled_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isPreferentialGauge?: InputMaybe<Scalars['Boolean']['input']>;
  isPreferentialGauge_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isPreferentialGauge_not?: InputMaybe<Scalars['Boolean']['input']>;
  isPreferentialGauge_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  or?: InputMaybe<Array<InputMaybe<LiquidityGauge_Filter>>>;
  pool?: InputMaybe<Scalars['String']['input']>;
  poolAddress?: InputMaybe<Scalars['Bytes']['input']>;
  poolAddress_contains?: InputMaybe<Scalars['Bytes']['input']>;
  poolAddress_gt?: InputMaybe<Scalars['Bytes']['input']>;
  poolAddress_gte?: InputMaybe<Scalars['Bytes']['input']>;
  poolAddress_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  poolAddress_lt?: InputMaybe<Scalars['Bytes']['input']>;
  poolAddress_lte?: InputMaybe<Scalars['Bytes']['input']>;
  poolAddress_not?: InputMaybe<Scalars['Bytes']['input']>;
  poolAddress_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  poolAddress_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  poolId?: InputMaybe<Scalars['Bytes']['input']>;
  poolId_contains?: InputMaybe<Scalars['Bytes']['input']>;
  poolId_gt?: InputMaybe<Scalars['Bytes']['input']>;
  poolId_gte?: InputMaybe<Scalars['Bytes']['input']>;
  poolId_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  poolId_lt?: InputMaybe<Scalars['Bytes']['input']>;
  poolId_lte?: InputMaybe<Scalars['Bytes']['input']>;
  poolId_not?: InputMaybe<Scalars['Bytes']['input']>;
  poolId_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  poolId_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  pool_?: InputMaybe<Pool_Filter>;
  pool_contains?: InputMaybe<Scalars['String']['input']>;
  pool_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_gt?: InputMaybe<Scalars['String']['input']>;
  pool_gte?: InputMaybe<Scalars['String']['input']>;
  pool_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_lt?: InputMaybe<Scalars['String']['input']>;
  pool_lte?: InputMaybe<Scalars['String']['input']>;
  pool_not?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains?: InputMaybe<Scalars['String']['input']>;
  pool_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  pool_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with?: InputMaybe<Scalars['String']['input']>;
  pool_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  relativeWeightCap?: InputMaybe<Scalars['BigDecimal']['input']>;
  relativeWeightCap_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  relativeWeightCap_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  relativeWeightCap_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  relativeWeightCap_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  relativeWeightCap_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  relativeWeightCap_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  relativeWeightCap_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rewardTokensList?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  rewardTokensList_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  rewardTokensList_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  rewardTokensList_not?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  rewardTokensList_not_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  rewardTokensList_not_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  shares_?: InputMaybe<GaugeShare_Filter>;
  streamer?: InputMaybe<Scalars['Bytes']['input']>;
  streamer_contains?: InputMaybe<Scalars['Bytes']['input']>;
  streamer_gt?: InputMaybe<Scalars['Bytes']['input']>;
  streamer_gte?: InputMaybe<Scalars['Bytes']['input']>;
  streamer_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  streamer_lt?: InputMaybe<Scalars['Bytes']['input']>;
  streamer_lte?: InputMaybe<Scalars['Bytes']['input']>;
  streamer_not?: InputMaybe<Scalars['Bytes']['input']>;
  streamer_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  streamer_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
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
  tokens_?: InputMaybe<RewardToken_Filter>;
  totalSupply?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSupply_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSupply_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSupply_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalSupply_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSupply_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSupply_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSupply_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
};

export type LiquidityGauge_OrderBy =
  | 'factory'
  | 'factory__id'
  | 'factory__numGauges'
  | 'gauge'
  | 'gauge__addedTimestamp'
  | 'gauge__address'
  | 'gauge__id'
  | 'id'
  | 'isKilled'
  | 'isPreferentialGauge'
  | 'pool'
  | 'poolAddress'
  | 'poolId'
  | 'pool__address'
  | 'pool__id'
  | 'pool__poolId'
  | 'relativeWeightCap'
  | 'rewardTokensList'
  | 'shares'
  | 'streamer'
  | 'symbol'
  | 'tokens'
  | 'totalSupply'
  | '%future added value';

export type LockSnapshot = {
  __typename?: 'LockSnapshot';
  /**  veBAL balance at the moment user locks  */
  bias: Scalars['BigDecimal']['output'];
  /**  Equal to <userAddress>-<timestamp>  */
  id: Scalars['ID']['output'];
  /**  veBAL decay rate (per second)  */
  slope: Scalars['BigDecimal']['output'];
  /**  Timestamp at which the snapshot was taken [seconds]  */
  timestamp: Scalars['Int']['output'];
  /**  Reference to User entity  */
  user: User;
};

export type LockSnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<LockSnapshot_Filter>>>;
  bias?: InputMaybe<Scalars['BigDecimal']['input']>;
  bias_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  bias_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  bias_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  bias_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  bias_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  bias_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  bias_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<LockSnapshot_Filter>>>;
  slope?: InputMaybe<Scalars['BigDecimal']['input']>;
  slope_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  slope_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  slope_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  slope_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  slope_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  slope_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  slope_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
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

export type LockSnapshot_OrderBy =
  | 'bias'
  | 'id'
  | 'slope'
  | 'timestamp'
  | 'user'
  | 'user__id'
  | '%future added value';

export type OmniVotingEscrowLock = {
  __typename?: 'OmniVotingEscrowLock';
  /**  veBAL balance at the moment user locks  */
  bias: Scalars['BigDecimal']['output'];
  /**  Chain where the lock was bridged to  */
  dstChainId: Scalars['Int']['output'];
  /**  Equal to: <userAdress>-<omniVotingEscrow>  */
  id: Scalars['ID']['output'];
  /**  User on the local chain (reference to User entity)  */
  localUser: User;
  /**  User address on the remote chain  */
  remoteUser: Scalars['Bytes']['output'];
  /**  veBAL decay rate (per second)  */
  slope: Scalars['BigDecimal']['output'];
  /**  Timestamp the lock was created [seconds]  */
  timestamp: Scalars['Int']['output'];
  /**  Reference to VotingEscrow entity  */
  votingEscrowID: VotingEscrow;
};

export type OmniVotingEscrowLock_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<OmniVotingEscrowLock_Filter>>>;
  bias?: InputMaybe<Scalars['BigDecimal']['input']>;
  bias_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  bias_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  bias_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  bias_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  bias_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  bias_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  bias_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dstChainId?: InputMaybe<Scalars['Int']['input']>;
  dstChainId_gt?: InputMaybe<Scalars['Int']['input']>;
  dstChainId_gte?: InputMaybe<Scalars['Int']['input']>;
  dstChainId_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  dstChainId_lt?: InputMaybe<Scalars['Int']['input']>;
  dstChainId_lte?: InputMaybe<Scalars['Int']['input']>;
  dstChainId_not?: InputMaybe<Scalars['Int']['input']>;
  dstChainId_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  localUser?: InputMaybe<Scalars['String']['input']>;
  localUser_?: InputMaybe<User_Filter>;
  localUser_contains?: InputMaybe<Scalars['String']['input']>;
  localUser_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  localUser_ends_with?: InputMaybe<Scalars['String']['input']>;
  localUser_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  localUser_gt?: InputMaybe<Scalars['String']['input']>;
  localUser_gte?: InputMaybe<Scalars['String']['input']>;
  localUser_in?: InputMaybe<Array<Scalars['String']['input']>>;
  localUser_lt?: InputMaybe<Scalars['String']['input']>;
  localUser_lte?: InputMaybe<Scalars['String']['input']>;
  localUser_not?: InputMaybe<Scalars['String']['input']>;
  localUser_not_contains?: InputMaybe<Scalars['String']['input']>;
  localUser_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  localUser_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  localUser_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  localUser_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  localUser_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  localUser_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  localUser_starts_with?: InputMaybe<Scalars['String']['input']>;
  localUser_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<OmniVotingEscrowLock_Filter>>>;
  remoteUser?: InputMaybe<Scalars['Bytes']['input']>;
  remoteUser_contains?: InputMaybe<Scalars['Bytes']['input']>;
  remoteUser_gt?: InputMaybe<Scalars['Bytes']['input']>;
  remoteUser_gte?: InputMaybe<Scalars['Bytes']['input']>;
  remoteUser_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  remoteUser_lt?: InputMaybe<Scalars['Bytes']['input']>;
  remoteUser_lte?: InputMaybe<Scalars['Bytes']['input']>;
  remoteUser_not?: InputMaybe<Scalars['Bytes']['input']>;
  remoteUser_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  remoteUser_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  slope?: InputMaybe<Scalars['BigDecimal']['input']>;
  slope_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  slope_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  slope_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  slope_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  slope_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  slope_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  slope_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  timestamp?: InputMaybe<Scalars['Int']['input']>;
  timestamp_gt?: InputMaybe<Scalars['Int']['input']>;
  timestamp_gte?: InputMaybe<Scalars['Int']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']['input']>;
  timestamp_lte?: InputMaybe<Scalars['Int']['input']>;
  timestamp_not?: InputMaybe<Scalars['Int']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  votingEscrowID?: InputMaybe<Scalars['String']['input']>;
  votingEscrowID_?: InputMaybe<VotingEscrow_Filter>;
  votingEscrowID_contains?: InputMaybe<Scalars['String']['input']>;
  votingEscrowID_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  votingEscrowID_ends_with?: InputMaybe<Scalars['String']['input']>;
  votingEscrowID_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  votingEscrowID_gt?: InputMaybe<Scalars['String']['input']>;
  votingEscrowID_gte?: InputMaybe<Scalars['String']['input']>;
  votingEscrowID_in?: InputMaybe<Array<Scalars['String']['input']>>;
  votingEscrowID_lt?: InputMaybe<Scalars['String']['input']>;
  votingEscrowID_lte?: InputMaybe<Scalars['String']['input']>;
  votingEscrowID_not?: InputMaybe<Scalars['String']['input']>;
  votingEscrowID_not_contains?: InputMaybe<Scalars['String']['input']>;
  votingEscrowID_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  votingEscrowID_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  votingEscrowID_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  votingEscrowID_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  votingEscrowID_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  votingEscrowID_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  votingEscrowID_starts_with?: InputMaybe<Scalars['String']['input']>;
  votingEscrowID_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export type OmniVotingEscrowLock_OrderBy =
  | 'bias'
  | 'dstChainId'
  | 'id'
  | 'localUser'
  | 'localUser__id'
  | 'remoteUser'
  | 'slope'
  | 'timestamp'
  | 'votingEscrowID'
  | 'votingEscrowID__id'
  | 'votingEscrowID__stakedSupply'
  | '%future added value';

/** Defines the order direction, either ascending or descending */
export type OrderDirection =
  | 'asc'
  | 'desc'
  | '%future added value';

export type Pool = {
  __typename?: 'Pool';
  /**  Address of the pool (lp_token of the gauge)  */
  address: Scalars['Bytes']['output'];
  /**  List of gauges created for the pool  */
  gauges?: Maybe<Array<LiquidityGauge>>;
  /**  List of the pool's gauges addresses  */
  gaugesList: Array<Scalars['Bytes']['output']>;
  /**  Address of the pool (lp_token of the gauge)  */
  id: Scalars['ID']['output'];
  /**  Pool ID if lp_token is a Balancer pool; null otherwise  */
  poolId?: Maybe<Scalars['Bytes']['output']>;
  /**  Most recent, unkilled gauge in the GaugeController  */
  preferentialGauge?: Maybe<LiquidityGauge>;
};


export type PoolGaugesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<LiquidityGauge_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<LiquidityGauge_Filter>;
};

export type Pool_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  address?: InputMaybe<Scalars['Bytes']['input']>;
  address_contains?: InputMaybe<Scalars['Bytes']['input']>;
  address_gt?: InputMaybe<Scalars['Bytes']['input']>;
  address_gte?: InputMaybe<Scalars['Bytes']['input']>;
  address_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  address_lt?: InputMaybe<Scalars['Bytes']['input']>;
  address_lte?: InputMaybe<Scalars['Bytes']['input']>;
  address_not?: InputMaybe<Scalars['Bytes']['input']>;
  address_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  address_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  and?: InputMaybe<Array<InputMaybe<Pool_Filter>>>;
  gaugesList?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  gaugesList_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  gaugesList_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  gaugesList_not?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  gaugesList_not_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  gaugesList_not_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  gauges_?: InputMaybe<LiquidityGauge_Filter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Pool_Filter>>>;
  poolId?: InputMaybe<Scalars['Bytes']['input']>;
  poolId_contains?: InputMaybe<Scalars['Bytes']['input']>;
  poolId_gt?: InputMaybe<Scalars['Bytes']['input']>;
  poolId_gte?: InputMaybe<Scalars['Bytes']['input']>;
  poolId_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  poolId_lt?: InputMaybe<Scalars['Bytes']['input']>;
  poolId_lte?: InputMaybe<Scalars['Bytes']['input']>;
  poolId_not?: InputMaybe<Scalars['Bytes']['input']>;
  poolId_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  poolId_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  preferentialGauge?: InputMaybe<Scalars['String']['input']>;
  preferentialGauge_?: InputMaybe<LiquidityGauge_Filter>;
  preferentialGauge_contains?: InputMaybe<Scalars['String']['input']>;
  preferentialGauge_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  preferentialGauge_ends_with?: InputMaybe<Scalars['String']['input']>;
  preferentialGauge_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  preferentialGauge_gt?: InputMaybe<Scalars['String']['input']>;
  preferentialGauge_gte?: InputMaybe<Scalars['String']['input']>;
  preferentialGauge_in?: InputMaybe<Array<Scalars['String']['input']>>;
  preferentialGauge_lt?: InputMaybe<Scalars['String']['input']>;
  preferentialGauge_lte?: InputMaybe<Scalars['String']['input']>;
  preferentialGauge_not?: InputMaybe<Scalars['String']['input']>;
  preferentialGauge_not_contains?: InputMaybe<Scalars['String']['input']>;
  preferentialGauge_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  preferentialGauge_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  preferentialGauge_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  preferentialGauge_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  preferentialGauge_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  preferentialGauge_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  preferentialGauge_starts_with?: InputMaybe<Scalars['String']['input']>;
  preferentialGauge_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export type Pool_OrderBy =
  | 'address'
  | 'gauges'
  | 'gaugesList'
  | 'id'
  | 'poolId'
  | 'preferentialGauge'
  | 'preferentialGauge__id'
  | 'preferentialGauge__isKilled'
  | 'preferentialGauge__isPreferentialGauge'
  | 'preferentialGauge__poolAddress'
  | 'preferentialGauge__poolId'
  | 'preferentialGauge__relativeWeightCap'
  | 'preferentialGauge__streamer'
  | 'preferentialGauge__symbol'
  | 'preferentialGauge__totalSupply'
  | '%future added value';

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  gauge?: Maybe<Gauge>;
  gaugeFactories: Array<GaugeFactory>;
  gaugeFactory?: Maybe<GaugeFactory>;
  gaugeInjector?: Maybe<GaugeInjector>;
  gaugeInjectors: Array<GaugeInjector>;
  gaugeShare?: Maybe<GaugeShare>;
  gaugeShares: Array<GaugeShare>;
  gaugeType?: Maybe<GaugeType>;
  gaugeTypes: Array<GaugeType>;
  gaugeVote?: Maybe<GaugeVote>;
  gaugeVotes: Array<GaugeVote>;
  gauges: Array<Gauge>;
  liquidityGauge?: Maybe<LiquidityGauge>;
  liquidityGauges: Array<LiquidityGauge>;
  lockSnapshot?: Maybe<LockSnapshot>;
  lockSnapshots: Array<LockSnapshot>;
  omniVotingEscrowLock?: Maybe<OmniVotingEscrowLock>;
  omniVotingEscrowLocks: Array<OmniVotingEscrowLock>;
  pool?: Maybe<Pool>;
  pools: Array<Pool>;
  rewardToken?: Maybe<RewardToken>;
  rewardTokens: Array<RewardToken>;
  rootGauge?: Maybe<RootGauge>;
  rootGauges: Array<RootGauge>;
  singleRecipientGauge?: Maybe<SingleRecipientGauge>;
  singleRecipientGauges: Array<SingleRecipientGauge>;
  user?: Maybe<User>;
  users: Array<User>;
  votingEscrow?: Maybe<VotingEscrow>;
  votingEscrowLock?: Maybe<VotingEscrowLock>;
  votingEscrowLocks: Array<VotingEscrowLock>;
  votingEscrows: Array<VotingEscrow>;
};


export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type QueryGaugeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryGaugeFactoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GaugeFactory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<GaugeFactory_Filter>;
};


export type QueryGaugeFactoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryGaugeInjectorArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryGaugeInjectorsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GaugeInjector_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<GaugeInjector_Filter>;
};


export type QueryGaugeShareArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryGaugeSharesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GaugeShare_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<GaugeShare_Filter>;
};


export type QueryGaugeTypeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryGaugeTypesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GaugeType_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<GaugeType_Filter>;
};


export type QueryGaugeVoteArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryGaugeVotesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GaugeVote_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<GaugeVote_Filter>;
};


export type QueryGaugesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Gauge_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Gauge_Filter>;
};


export type QueryLiquidityGaugeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryLiquidityGaugesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<LiquidityGauge_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LiquidityGauge_Filter>;
};


export type QueryLockSnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryLockSnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<LockSnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LockSnapshot_Filter>;
};


export type QueryOmniVotingEscrowLockArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryOmniVotingEscrowLocksArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<OmniVotingEscrowLock_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OmniVotingEscrowLock_Filter>;
};


export type QueryPoolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPoolsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Pool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Pool_Filter>;
};


export type QueryRewardTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryRewardTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RewardToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RewardToken_Filter>;
};


export type QueryRootGaugeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryRootGaugesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RootGauge_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RootGauge_Filter>;
};


export type QuerySingleRecipientGaugeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerySingleRecipientGaugesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SingleRecipientGauge_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SingleRecipientGauge_Filter>;
};


export type QueryUserArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
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


export type QueryVotingEscrowArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryVotingEscrowLockArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryVotingEscrowLocksArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<VotingEscrowLock_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<VotingEscrowLock_Filter>;
};


export type QueryVotingEscrowsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<VotingEscrow_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<VotingEscrow_Filter>;
};

export type RewardToken = {
  __typename?: 'RewardToken';
  /**  ERC20 token decimals - zero if call to decimals() reverts  */
  decimals: Scalars['Int']['output'];
  /**  Reference to LiquidityGauge entity  */
  gauge: LiquidityGauge;
  /**  Equal to: <tokenAddress>-<gaugeAddress>  */
  id: Scalars['ID']['output'];
  /**  Timestamp at which finishes the period of rewards  */
  periodFinish?: Maybe<Scalars['BigInt']['output']>;
  /**  Rate of reward tokens streamed per second  */
  rate?: Maybe<Scalars['BigDecimal']['output']>;
  /**  ERC20 token symbol - empty string if call to symbol() reverts  */
  symbol: Scalars['String']['output'];
  /**  Amount of reward tokens that has been deposited into the gauge  */
  totalDeposited: Scalars['BigDecimal']['output'];
};

export type RewardToken_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<RewardToken_Filter>>>;
  decimals?: InputMaybe<Scalars['Int']['input']>;
  decimals_gt?: InputMaybe<Scalars['Int']['input']>;
  decimals_gte?: InputMaybe<Scalars['Int']['input']>;
  decimals_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  decimals_lt?: InputMaybe<Scalars['Int']['input']>;
  decimals_lte?: InputMaybe<Scalars['Int']['input']>;
  decimals_not?: InputMaybe<Scalars['Int']['input']>;
  decimals_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  gauge?: InputMaybe<Scalars['String']['input']>;
  gauge_?: InputMaybe<LiquidityGauge_Filter>;
  gauge_contains?: InputMaybe<Scalars['String']['input']>;
  gauge_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  gauge_ends_with?: InputMaybe<Scalars['String']['input']>;
  gauge_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  gauge_gt?: InputMaybe<Scalars['String']['input']>;
  gauge_gte?: InputMaybe<Scalars['String']['input']>;
  gauge_in?: InputMaybe<Array<Scalars['String']['input']>>;
  gauge_lt?: InputMaybe<Scalars['String']['input']>;
  gauge_lte?: InputMaybe<Scalars['String']['input']>;
  gauge_not?: InputMaybe<Scalars['String']['input']>;
  gauge_not_contains?: InputMaybe<Scalars['String']['input']>;
  gauge_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  gauge_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  gauge_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  gauge_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  gauge_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  gauge_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  gauge_starts_with?: InputMaybe<Scalars['String']['input']>;
  gauge_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<RewardToken_Filter>>>;
  periodFinish?: InputMaybe<Scalars['BigInt']['input']>;
  periodFinish_gt?: InputMaybe<Scalars['BigInt']['input']>;
  periodFinish_gte?: InputMaybe<Scalars['BigInt']['input']>;
  periodFinish_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  periodFinish_lt?: InputMaybe<Scalars['BigInt']['input']>;
  periodFinish_lte?: InputMaybe<Scalars['BigInt']['input']>;
  periodFinish_not?: InputMaybe<Scalars['BigInt']['input']>;
  periodFinish_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  rate?: InputMaybe<Scalars['BigDecimal']['input']>;
  rate_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rate_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rate_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rate_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rate_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rate_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  rate_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
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
  totalDeposited?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalDeposited_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalDeposited_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalDeposited_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalDeposited_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalDeposited_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalDeposited_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalDeposited_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
};

export type RewardToken_OrderBy =
  | 'decimals'
  | 'gauge'
  | 'gauge__id'
  | 'gauge__isKilled'
  | 'gauge__isPreferentialGauge'
  | 'gauge__poolAddress'
  | 'gauge__poolId'
  | 'gauge__relativeWeightCap'
  | 'gauge__streamer'
  | 'gauge__symbol'
  | 'gauge__totalSupply'
  | 'id'
  | 'periodFinish'
  | 'rate'
  | 'symbol'
  | 'totalDeposited'
  | '%future added value';

export type RootGauge = {
  __typename?: 'RootGauge';
  /**  Chain where emissions by this gauge will be bridged to  */
  chain: Chain;
  /**  Factory contract address  */
  factory: GaugeFactory;
  /**  Reference to Gauge entity - created when LiquidityGauge is added to GaugeController */
  gauge?: Maybe<Gauge>;
  /**  RootGauge contract address */
  id: Scalars['ID']['output'];
  /**  Whether Balancer DAO killed the gauge  */
  isKilled: Scalars['Boolean']['output'];
  /**  Address where emissions by this gauge will be bridged to  */
  recipient: Scalars['Bytes']['output'];
  /**  Relative weight cap of the gauge (0.01 = 1%) - V2 factories only  */
  relativeWeightCap?: Maybe<Scalars['BigDecimal']['output']>;
};

export type RootGauge_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<RootGauge_Filter>>>;
  chain?: InputMaybe<Chain>;
  chain_in?: InputMaybe<Array<Chain>>;
  chain_not?: InputMaybe<Chain>;
  chain_not_in?: InputMaybe<Array<Chain>>;
  factory?: InputMaybe<Scalars['String']['input']>;
  factory_?: InputMaybe<GaugeFactory_Filter>;
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
  gauge?: InputMaybe<Scalars['String']['input']>;
  gauge_?: InputMaybe<Gauge_Filter>;
  gauge_contains?: InputMaybe<Scalars['String']['input']>;
  gauge_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  gauge_ends_with?: InputMaybe<Scalars['String']['input']>;
  gauge_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  gauge_gt?: InputMaybe<Scalars['String']['input']>;
  gauge_gte?: InputMaybe<Scalars['String']['input']>;
  gauge_in?: InputMaybe<Array<Scalars['String']['input']>>;
  gauge_lt?: InputMaybe<Scalars['String']['input']>;
  gauge_lte?: InputMaybe<Scalars['String']['input']>;
  gauge_not?: InputMaybe<Scalars['String']['input']>;
  gauge_not_contains?: InputMaybe<Scalars['String']['input']>;
  gauge_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  gauge_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  gauge_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  gauge_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  gauge_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  gauge_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  gauge_starts_with?: InputMaybe<Scalars['String']['input']>;
  gauge_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  isKilled?: InputMaybe<Scalars['Boolean']['input']>;
  isKilled_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isKilled_not?: InputMaybe<Scalars['Boolean']['input']>;
  isKilled_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  or?: InputMaybe<Array<InputMaybe<RootGauge_Filter>>>;
  recipient?: InputMaybe<Scalars['Bytes']['input']>;
  recipient_contains?: InputMaybe<Scalars['Bytes']['input']>;
  recipient_gt?: InputMaybe<Scalars['Bytes']['input']>;
  recipient_gte?: InputMaybe<Scalars['Bytes']['input']>;
  recipient_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  recipient_lt?: InputMaybe<Scalars['Bytes']['input']>;
  recipient_lte?: InputMaybe<Scalars['Bytes']['input']>;
  recipient_not?: InputMaybe<Scalars['Bytes']['input']>;
  recipient_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  recipient_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  relativeWeightCap?: InputMaybe<Scalars['BigDecimal']['input']>;
  relativeWeightCap_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  relativeWeightCap_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  relativeWeightCap_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  relativeWeightCap_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  relativeWeightCap_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  relativeWeightCap_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  relativeWeightCap_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
};

export type RootGauge_OrderBy =
  | 'chain'
  | 'factory'
  | 'factory__id'
  | 'factory__numGauges'
  | 'gauge'
  | 'gauge__addedTimestamp'
  | 'gauge__address'
  | 'gauge__id'
  | 'id'
  | 'isKilled'
  | 'recipient'
  | 'relativeWeightCap'
  | '%future added value';

export type SingleRecipientGauge = {
  __typename?: 'SingleRecipientGauge';
  /**  Factory contract address  */
  factory: GaugeFactory;
  /**  Reference to Gauge entity - created when SingleRecipientGauge is added to GaugeController */
  gauge?: Maybe<Gauge>;
  /**  SingleRecipientGauge contract address */
  id: Scalars['ID']['output'];
  /**  Whether Balancer DAO killed the gauge  */
  isKilled: Scalars['Boolean']['output'];
  /**  Address where emissions for this gauge will be sent to  */
  recipient: Scalars['Bytes']['output'];
  /**  Relative weight cap of the gauge (0.01 = 1%) - V2 factories only  */
  relativeWeightCap?: Maybe<Scalars['BigDecimal']['output']>;
};

export type SingleRecipientGauge_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SingleRecipientGauge_Filter>>>;
  factory?: InputMaybe<Scalars['String']['input']>;
  factory_?: InputMaybe<GaugeFactory_Filter>;
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
  gauge?: InputMaybe<Scalars['String']['input']>;
  gauge_?: InputMaybe<Gauge_Filter>;
  gauge_contains?: InputMaybe<Scalars['String']['input']>;
  gauge_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  gauge_ends_with?: InputMaybe<Scalars['String']['input']>;
  gauge_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  gauge_gt?: InputMaybe<Scalars['String']['input']>;
  gauge_gte?: InputMaybe<Scalars['String']['input']>;
  gauge_in?: InputMaybe<Array<Scalars['String']['input']>>;
  gauge_lt?: InputMaybe<Scalars['String']['input']>;
  gauge_lte?: InputMaybe<Scalars['String']['input']>;
  gauge_not?: InputMaybe<Scalars['String']['input']>;
  gauge_not_contains?: InputMaybe<Scalars['String']['input']>;
  gauge_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  gauge_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  gauge_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  gauge_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  gauge_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  gauge_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  gauge_starts_with?: InputMaybe<Scalars['String']['input']>;
  gauge_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  isKilled?: InputMaybe<Scalars['Boolean']['input']>;
  isKilled_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isKilled_not?: InputMaybe<Scalars['Boolean']['input']>;
  isKilled_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  or?: InputMaybe<Array<InputMaybe<SingleRecipientGauge_Filter>>>;
  recipient?: InputMaybe<Scalars['Bytes']['input']>;
  recipient_contains?: InputMaybe<Scalars['Bytes']['input']>;
  recipient_gt?: InputMaybe<Scalars['Bytes']['input']>;
  recipient_gte?: InputMaybe<Scalars['Bytes']['input']>;
  recipient_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  recipient_lt?: InputMaybe<Scalars['Bytes']['input']>;
  recipient_lte?: InputMaybe<Scalars['Bytes']['input']>;
  recipient_not?: InputMaybe<Scalars['Bytes']['input']>;
  recipient_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  recipient_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  relativeWeightCap?: InputMaybe<Scalars['BigDecimal']['input']>;
  relativeWeightCap_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  relativeWeightCap_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  relativeWeightCap_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  relativeWeightCap_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  relativeWeightCap_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  relativeWeightCap_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  relativeWeightCap_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
};

export type SingleRecipientGauge_OrderBy =
  | 'factory'
  | 'factory__id'
  | 'factory__numGauges'
  | 'gauge'
  | 'gauge__addedTimestamp'
  | 'gauge__address'
  | 'gauge__id'
  | 'id'
  | 'isKilled'
  | 'recipient'
  | 'relativeWeightCap'
  | '%future added value';

export type Subscription = {
  __typename?: 'Subscription';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  gauge?: Maybe<Gauge>;
  gaugeFactories: Array<GaugeFactory>;
  gaugeFactory?: Maybe<GaugeFactory>;
  gaugeInjector?: Maybe<GaugeInjector>;
  gaugeInjectors: Array<GaugeInjector>;
  gaugeShare?: Maybe<GaugeShare>;
  gaugeShares: Array<GaugeShare>;
  gaugeType?: Maybe<GaugeType>;
  gaugeTypes: Array<GaugeType>;
  gaugeVote?: Maybe<GaugeVote>;
  gaugeVotes: Array<GaugeVote>;
  gauges: Array<Gauge>;
  liquidityGauge?: Maybe<LiquidityGauge>;
  liquidityGauges: Array<LiquidityGauge>;
  lockSnapshot?: Maybe<LockSnapshot>;
  lockSnapshots: Array<LockSnapshot>;
  omniVotingEscrowLock?: Maybe<OmniVotingEscrowLock>;
  omniVotingEscrowLocks: Array<OmniVotingEscrowLock>;
  pool?: Maybe<Pool>;
  pools: Array<Pool>;
  rewardToken?: Maybe<RewardToken>;
  rewardTokens: Array<RewardToken>;
  rootGauge?: Maybe<RootGauge>;
  rootGauges: Array<RootGauge>;
  singleRecipientGauge?: Maybe<SingleRecipientGauge>;
  singleRecipientGauges: Array<SingleRecipientGauge>;
  user?: Maybe<User>;
  users: Array<User>;
  votingEscrow?: Maybe<VotingEscrow>;
  votingEscrowLock?: Maybe<VotingEscrowLock>;
  votingEscrowLocks: Array<VotingEscrowLock>;
  votingEscrows: Array<VotingEscrow>;
};


export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type SubscriptionGaugeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionGaugeFactoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GaugeFactory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<GaugeFactory_Filter>;
};


export type SubscriptionGaugeFactoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionGaugeInjectorArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionGaugeInjectorsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GaugeInjector_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<GaugeInjector_Filter>;
};


export type SubscriptionGaugeShareArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionGaugeSharesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GaugeShare_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<GaugeShare_Filter>;
};


export type SubscriptionGaugeTypeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionGaugeTypesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GaugeType_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<GaugeType_Filter>;
};


export type SubscriptionGaugeVoteArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionGaugeVotesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GaugeVote_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<GaugeVote_Filter>;
};


export type SubscriptionGaugesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Gauge_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Gauge_Filter>;
};


export type SubscriptionLiquidityGaugeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionLiquidityGaugesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<LiquidityGauge_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LiquidityGauge_Filter>;
};


export type SubscriptionLockSnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionLockSnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<LockSnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LockSnapshot_Filter>;
};


export type SubscriptionOmniVotingEscrowLockArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionOmniVotingEscrowLocksArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<OmniVotingEscrowLock_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<OmniVotingEscrowLock_Filter>;
};


export type SubscriptionPoolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPoolsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Pool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Pool_Filter>;
};


export type SubscriptionRewardTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionRewardTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RewardToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RewardToken_Filter>;
};


export type SubscriptionRootGaugeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionRootGaugesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<RootGauge_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RootGauge_Filter>;
};


export type SubscriptionSingleRecipientGaugeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionSingleRecipientGaugesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SingleRecipientGauge_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SingleRecipientGauge_Filter>;
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


export type SubscriptionVotingEscrowArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionVotingEscrowLockArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionVotingEscrowLocksArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<VotingEscrowLock_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<VotingEscrowLock_Filter>;
};


export type SubscriptionVotingEscrowsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<VotingEscrow_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<VotingEscrow_Filter>;
};

export type User = {
  __typename?: 'User';
  /**  List of gauge the user has shares  */
  gaugeShares?: Maybe<Array<GaugeShare>>;
  /**  List of votes on gauges  */
  gaugeVotes?: Maybe<Array<GaugeVote>>;
  /**  User address  */
  id: Scalars['ID']['output'];
  /**  List of omni locks the user created  */
  omniVotingLocks?: Maybe<Array<OmniVotingEscrowLock>>;
  /**  List of locks the user created  */
  votingLocks?: Maybe<Array<VotingEscrowLock>>;
};


export type UserGaugeSharesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GaugeShare_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<GaugeShare_Filter>;
};


export type UserGaugeVotesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GaugeVote_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<GaugeVote_Filter>;
};


export type UserOmniVotingLocksArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<OmniVotingEscrowLock_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<OmniVotingEscrowLock_Filter>;
};


export type UserVotingLocksArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<VotingEscrowLock_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<VotingEscrowLock_Filter>;
};

export type User_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<User_Filter>>>;
  gaugeShares_?: InputMaybe<GaugeShare_Filter>;
  gaugeVotes_?: InputMaybe<GaugeVote_Filter>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  omniVotingLocks_?: InputMaybe<OmniVotingEscrowLock_Filter>;
  or?: InputMaybe<Array<InputMaybe<User_Filter>>>;
  votingLocks_?: InputMaybe<VotingEscrowLock_Filter>;
};

export type User_OrderBy =
  | 'gaugeShares'
  | 'gaugeVotes'
  | 'id'
  | 'omniVotingLocks'
  | 'votingLocks'
  | '%future added value';

export type VotingEscrow = {
  __typename?: 'VotingEscrow';
  /**  VotingEscrow contract address  */
  id: Scalars['ID']['output'];
  /**  List of veBAL locks created  */
  locks?: Maybe<Array<VotingEscrowLock>>;
  /**  List of veBAL locks created  */
  omniLocks?: Maybe<Array<OmniVotingEscrowLock>>;
  /**  Amount of B-80BAL-20WETH BPT locked, only applies on mainnet  */
  stakedSupply?: Maybe<Scalars['BigDecimal']['output']>;
};


export type VotingEscrowLocksArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<VotingEscrowLock_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<VotingEscrowLock_Filter>;
};


export type VotingEscrowOmniLocksArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<OmniVotingEscrowLock_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<OmniVotingEscrowLock_Filter>;
};

export type VotingEscrowLock = {
  __typename?: 'VotingEscrowLock';
  /**  veBAL balance at the moment user locks  */
  bias: Scalars['BigDecimal']['output'];
  /**  Equal to: <userAdress>-<votingEscrow>  */
  id: Scalars['ID']['output'];
  /**  Amount of B-80BAL-20WETH BPT the user has locked  */
  lockedBalance: Scalars['BigDecimal']['output'];
  /**  veBAL decay rate (per second)  */
  slope: Scalars['BigDecimal']['output'];
  /**  Timestamp at which the lock was created [seconds]  */
  timestamp: Scalars['Int']['output'];
  /**  Timestamp at which B-80BAL-20WETH BPT can be unlocked by user [seconds]  */
  unlockTime: Scalars['BigInt']['output'];
  /**  Timestamp at which the lcok was created [seconds]. Same as timestamp  */
  updatedAt: Scalars['Int']['output'];
  /**  Reference to User entity  */
  user: User;
  /**  Reference to VotingEscrow entity  */
  votingEscrowID: VotingEscrow;
};

export type VotingEscrowLock_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<VotingEscrowLock_Filter>>>;
  bias?: InputMaybe<Scalars['BigDecimal']['input']>;
  bias_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  bias_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  bias_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  bias_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  bias_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  bias_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  bias_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  lockedBalance?: InputMaybe<Scalars['BigDecimal']['input']>;
  lockedBalance_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  lockedBalance_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  lockedBalance_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  lockedBalance_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  lockedBalance_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  lockedBalance_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  lockedBalance_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  or?: InputMaybe<Array<InputMaybe<VotingEscrowLock_Filter>>>;
  slope?: InputMaybe<Scalars['BigDecimal']['input']>;
  slope_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  slope_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  slope_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  slope_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  slope_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  slope_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  slope_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  timestamp?: InputMaybe<Scalars['Int']['input']>;
  timestamp_gt?: InputMaybe<Scalars['Int']['input']>;
  timestamp_gte?: InputMaybe<Scalars['Int']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']['input']>;
  timestamp_lte?: InputMaybe<Scalars['Int']['input']>;
  timestamp_not?: InputMaybe<Scalars['Int']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  unlockTime?: InputMaybe<Scalars['BigInt']['input']>;
  unlockTime_gt?: InputMaybe<Scalars['BigInt']['input']>;
  unlockTime_gte?: InputMaybe<Scalars['BigInt']['input']>;
  unlockTime_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  unlockTime_lt?: InputMaybe<Scalars['BigInt']['input']>;
  unlockTime_lte?: InputMaybe<Scalars['BigInt']['input']>;
  unlockTime_not?: InputMaybe<Scalars['BigInt']['input']>;
  unlockTime_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  updatedAt?: InputMaybe<Scalars['Int']['input']>;
  updatedAt_gt?: InputMaybe<Scalars['Int']['input']>;
  updatedAt_gte?: InputMaybe<Scalars['Int']['input']>;
  updatedAt_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  updatedAt_lt?: InputMaybe<Scalars['Int']['input']>;
  updatedAt_lte?: InputMaybe<Scalars['Int']['input']>;
  updatedAt_not?: InputMaybe<Scalars['Int']['input']>;
  updatedAt_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
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
  votingEscrowID?: InputMaybe<Scalars['String']['input']>;
  votingEscrowID_?: InputMaybe<VotingEscrow_Filter>;
  votingEscrowID_contains?: InputMaybe<Scalars['String']['input']>;
  votingEscrowID_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  votingEscrowID_ends_with?: InputMaybe<Scalars['String']['input']>;
  votingEscrowID_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  votingEscrowID_gt?: InputMaybe<Scalars['String']['input']>;
  votingEscrowID_gte?: InputMaybe<Scalars['String']['input']>;
  votingEscrowID_in?: InputMaybe<Array<Scalars['String']['input']>>;
  votingEscrowID_lt?: InputMaybe<Scalars['String']['input']>;
  votingEscrowID_lte?: InputMaybe<Scalars['String']['input']>;
  votingEscrowID_not?: InputMaybe<Scalars['String']['input']>;
  votingEscrowID_not_contains?: InputMaybe<Scalars['String']['input']>;
  votingEscrowID_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  votingEscrowID_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  votingEscrowID_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  votingEscrowID_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  votingEscrowID_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  votingEscrowID_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  votingEscrowID_starts_with?: InputMaybe<Scalars['String']['input']>;
  votingEscrowID_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export type VotingEscrowLock_OrderBy =
  | 'bias'
  | 'id'
  | 'lockedBalance'
  | 'slope'
  | 'timestamp'
  | 'unlockTime'
  | 'updatedAt'
  | 'user'
  | 'user__id'
  | 'votingEscrowID'
  | 'votingEscrowID__id'
  | 'votingEscrowID__stakedSupply'
  | '%future added value';

export type VotingEscrow_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<VotingEscrow_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  locks_?: InputMaybe<VotingEscrowLock_Filter>;
  omniLocks_?: InputMaybe<OmniVotingEscrowLock_Filter>;
  or?: InputMaybe<Array<InputMaybe<VotingEscrow_Filter>>>;
  stakedSupply?: InputMaybe<Scalars['BigDecimal']['input']>;
  stakedSupply_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  stakedSupply_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  stakedSupply_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  stakedSupply_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  stakedSupply_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  stakedSupply_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  stakedSupply_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
};

export type VotingEscrow_OrderBy =
  | 'id'
  | 'locks'
  | 'omniLocks'
  | 'stakedSupply'
  | '%future added value';

export type _Block_ = {
  __typename?: '_Block_';
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']['output']>;
  /** The block number */
  number: Scalars['Int']['output'];
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

export type GaugeQueryVariables = Exact<{
  gaugeId: Scalars['ID']['input'];
}>;


export type GaugeQuery = { __typename?: 'Query', liquidityGauge?: { __typename?: 'LiquidityGauge', symbol: string } | null };


export const GaugeDocument = gql`
    query Gauge($gaugeId: ID!) {
  liquidityGauge(id: $gaugeId) {
    symbol
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    Gauge(variables: GaugeQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GaugeQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GaugeQuery>(GaugeDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Gauge', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;