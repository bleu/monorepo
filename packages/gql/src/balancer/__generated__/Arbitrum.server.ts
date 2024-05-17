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
  Timestamp: { input: any; output: any; }
};

export type Aggregation_Interval =
  | 'day'
  | 'hour'
  | '%future added value';

export type AmpUpdate = {
  __typename?: 'AmpUpdate';
  endAmp: Scalars['BigInt']['output'];
  endTimestamp: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  poolId: Pool;
  scheduledTimestamp: Scalars['Int']['output'];
  startAmp: Scalars['BigInt']['output'];
  startTimestamp: Scalars['BigInt']['output'];
};

export type AmpUpdate_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<AmpUpdate_Filter>>>;
  endAmp?: InputMaybe<Scalars['BigInt']['input']>;
  endAmp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  endAmp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  endAmp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  endAmp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  endAmp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  endAmp_not?: InputMaybe<Scalars['BigInt']['input']>;
  endAmp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  endTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  endTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  endTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  endTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  endTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  endTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  endTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  endTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<AmpUpdate_Filter>>>;
  poolId?: InputMaybe<Scalars['String']['input']>;
  poolId_?: InputMaybe<Pool_Filter>;
  poolId_contains?: InputMaybe<Scalars['String']['input']>;
  poolId_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  poolId_ends_with?: InputMaybe<Scalars['String']['input']>;
  poolId_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  poolId_gt?: InputMaybe<Scalars['String']['input']>;
  poolId_gte?: InputMaybe<Scalars['String']['input']>;
  poolId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  poolId_lt?: InputMaybe<Scalars['String']['input']>;
  poolId_lte?: InputMaybe<Scalars['String']['input']>;
  poolId_not?: InputMaybe<Scalars['String']['input']>;
  poolId_not_contains?: InputMaybe<Scalars['String']['input']>;
  poolId_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  poolId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  poolId_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  poolId_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  poolId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  poolId_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  poolId_starts_with?: InputMaybe<Scalars['String']['input']>;
  poolId_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  scheduledTimestamp?: InputMaybe<Scalars['Int']['input']>;
  scheduledTimestamp_gt?: InputMaybe<Scalars['Int']['input']>;
  scheduledTimestamp_gte?: InputMaybe<Scalars['Int']['input']>;
  scheduledTimestamp_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  scheduledTimestamp_lt?: InputMaybe<Scalars['Int']['input']>;
  scheduledTimestamp_lte?: InputMaybe<Scalars['Int']['input']>;
  scheduledTimestamp_not?: InputMaybe<Scalars['Int']['input']>;
  scheduledTimestamp_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  startAmp?: InputMaybe<Scalars['BigInt']['input']>;
  startAmp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  startAmp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  startAmp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  startAmp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  startAmp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  startAmp_not?: InputMaybe<Scalars['BigInt']['input']>;
  startAmp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  startTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  startTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  startTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  startTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  startTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  startTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  startTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  startTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type AmpUpdate_OrderBy =
  | 'endAmp'
  | 'endTimestamp'
  | 'id'
  | 'poolId'
  | 'poolId__address'
  | 'poolId__alpha'
  | 'poolId__amp'
  | 'poolId__baseToken'
  | 'poolId__beta'
  | 'poolId__c'
  | 'poolId__createTime'
  | 'poolId__dSq'
  | 'poolId__delta'
  | 'poolId__epsilon'
  | 'poolId__expiryTime'
  | 'poolId__factory'
  | 'poolId__holdersCount'
  | 'poolId__id'
  | 'poolId__isInRecoveryMode'
  | 'poolId__isPaused'
  | 'poolId__joinExitEnabled'
  | 'poolId__lambda'
  | 'poolId__lastJoinExitAmp'
  | 'poolId__lastPostJoinExitInvariant'
  | 'poolId__lowerTarget'
  | 'poolId__mainIndex'
  | 'poolId__managementAumFee'
  | 'poolId__managementFee'
  | 'poolId__mustAllowlistLPs'
  | 'poolId__name'
  | 'poolId__oracleEnabled'
  | 'poolId__owner'
  | 'poolId__poolType'
  | 'poolId__poolTypeVersion'
  | 'poolId__principalToken'
  | 'poolId__protocolAumFeeCache'
  | 'poolId__protocolId'
  | 'poolId__protocolSwapFeeCache'
  | 'poolId__protocolYieldFeeCache'
  | 'poolId__root3Alpha'
  | 'poolId__s'
  | 'poolId__sqrtAlpha'
  | 'poolId__sqrtBeta'
  | 'poolId__strategyType'
  | 'poolId__swapEnabled'
  | 'poolId__swapEnabledCurationSignal'
  | 'poolId__swapEnabledInternal'
  | 'poolId__swapFee'
  | 'poolId__swapsCount'
  | 'poolId__symbol'
  | 'poolId__tauAlphaX'
  | 'poolId__tauAlphaY'
  | 'poolId__tauBetaX'
  | 'poolId__tauBetaY'
  | 'poolId__totalAumFeeCollectedInBPT'
  | 'poolId__totalLiquidity'
  | 'poolId__totalLiquiditySansBPT'
  | 'poolId__totalProtocolFee'
  | 'poolId__totalProtocolFeePaidInBPT'
  | 'poolId__totalShares'
  | 'poolId__totalSwapFee'
  | 'poolId__totalSwapVolume'
  | 'poolId__totalWeight'
  | 'poolId__tx'
  | 'poolId__u'
  | 'poolId__unitSeconds'
  | 'poolId__upperTarget'
  | 'poolId__v'
  | 'poolId__w'
  | 'poolId__wrappedIndex'
  | 'poolId__z'
  | 'scheduledTimestamp'
  | 'startAmp'
  | 'startTimestamp'
  | '%future added value';

export type Balancer = {
  __typename?: 'Balancer';
  id: Scalars['ID']['output'];
  poolCount: Scalars['Int']['output'];
  pools?: Maybe<Array<Pool>>;
  protocolFeesCollector?: Maybe<Scalars['Bytes']['output']>;
  snapshots?: Maybe<Array<BalancerSnapshot>>;
  totalLiquidity: Scalars['BigDecimal']['output'];
  totalProtocolFee?: Maybe<Scalars['BigDecimal']['output']>;
  totalSwapCount: Scalars['BigInt']['output'];
  totalSwapFee: Scalars['BigDecimal']['output'];
  totalSwapVolume: Scalars['BigDecimal']['output'];
};


export type BalancerPoolsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Pool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Pool_Filter>;
};


export type BalancerSnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<BalancerSnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<BalancerSnapshot_Filter>;
};

export type BalancerSnapshot = {
  __typename?: 'BalancerSnapshot';
  id: Scalars['ID']['output'];
  poolCount: Scalars['Int']['output'];
  timestamp: Scalars['Int']['output'];
  totalLiquidity: Scalars['BigDecimal']['output'];
  totalProtocolFee?: Maybe<Scalars['BigDecimal']['output']>;
  totalSwapCount: Scalars['BigInt']['output'];
  totalSwapFee: Scalars['BigDecimal']['output'];
  totalSwapVolume: Scalars['BigDecimal']['output'];
  vault: Balancer;
};

export type BalancerSnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<BalancerSnapshot_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<BalancerSnapshot_Filter>>>;
  poolCount?: InputMaybe<Scalars['Int']['input']>;
  poolCount_gt?: InputMaybe<Scalars['Int']['input']>;
  poolCount_gte?: InputMaybe<Scalars['Int']['input']>;
  poolCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  poolCount_lt?: InputMaybe<Scalars['Int']['input']>;
  poolCount_lte?: InputMaybe<Scalars['Int']['input']>;
  poolCount_not?: InputMaybe<Scalars['Int']['input']>;
  poolCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  timestamp?: InputMaybe<Scalars['Int']['input']>;
  timestamp_gt?: InputMaybe<Scalars['Int']['input']>;
  timestamp_gte?: InputMaybe<Scalars['Int']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']['input']>;
  timestamp_lte?: InputMaybe<Scalars['Int']['input']>;
  timestamp_not?: InputMaybe<Scalars['Int']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  totalLiquidity?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidity_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidity_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidity_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalLiquidity_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidity_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidity_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidity_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalProtocolFee?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalProtocolFee_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalProtocolFee_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalProtocolFee_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalProtocolFee_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalProtocolFee_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalProtocolFee_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalProtocolFee_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalSwapCount?: InputMaybe<Scalars['BigInt']['input']>;
  totalSwapCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalSwapCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalSwapCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalSwapCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalSwapCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalSwapCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalSwapCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalSwapFee?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapFee_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapFee_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapFee_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalSwapFee_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapFee_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapFee_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapFee_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalSwapVolume?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapVolume_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapVolume_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapVolume_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalSwapVolume_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapVolume_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapVolume_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  vault?: InputMaybe<Scalars['String']['input']>;
  vault_?: InputMaybe<Balancer_Filter>;
  vault_contains?: InputMaybe<Scalars['String']['input']>;
  vault_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_gt?: InputMaybe<Scalars['String']['input']>;
  vault_gte?: InputMaybe<Scalars['String']['input']>;
  vault_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_lt?: InputMaybe<Scalars['String']['input']>;
  vault_lte?: InputMaybe<Scalars['String']['input']>;
  vault_not?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains?: InputMaybe<Scalars['String']['input']>;
  vault_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vault_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with?: InputMaybe<Scalars['String']['input']>;
  vault_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export type BalancerSnapshot_OrderBy =
  | 'id'
  | 'poolCount'
  | 'timestamp'
  | 'totalLiquidity'
  | 'totalProtocolFee'
  | 'totalSwapCount'
  | 'totalSwapFee'
  | 'totalSwapVolume'
  | 'vault'
  | 'vault__id'
  | 'vault__poolCount'
  | 'vault__protocolFeesCollector'
  | 'vault__totalLiquidity'
  | 'vault__totalProtocolFee'
  | 'vault__totalSwapCount'
  | 'vault__totalSwapFee'
  | 'vault__totalSwapVolume'
  | '%future added value';

export type Balancer_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Balancer_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Balancer_Filter>>>;
  poolCount?: InputMaybe<Scalars['Int']['input']>;
  poolCount_gt?: InputMaybe<Scalars['Int']['input']>;
  poolCount_gte?: InputMaybe<Scalars['Int']['input']>;
  poolCount_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  poolCount_lt?: InputMaybe<Scalars['Int']['input']>;
  poolCount_lte?: InputMaybe<Scalars['Int']['input']>;
  poolCount_not?: InputMaybe<Scalars['Int']['input']>;
  poolCount_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  pools_?: InputMaybe<Pool_Filter>;
  protocolFeesCollector?: InputMaybe<Scalars['Bytes']['input']>;
  protocolFeesCollector_contains?: InputMaybe<Scalars['Bytes']['input']>;
  protocolFeesCollector_gt?: InputMaybe<Scalars['Bytes']['input']>;
  protocolFeesCollector_gte?: InputMaybe<Scalars['Bytes']['input']>;
  protocolFeesCollector_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  protocolFeesCollector_lt?: InputMaybe<Scalars['Bytes']['input']>;
  protocolFeesCollector_lte?: InputMaybe<Scalars['Bytes']['input']>;
  protocolFeesCollector_not?: InputMaybe<Scalars['Bytes']['input']>;
  protocolFeesCollector_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  protocolFeesCollector_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  snapshots_?: InputMaybe<BalancerSnapshot_Filter>;
  totalLiquidity?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidity_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidity_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidity_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalLiquidity_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidity_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidity_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidity_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalProtocolFee?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalProtocolFee_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalProtocolFee_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalProtocolFee_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalProtocolFee_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalProtocolFee_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalProtocolFee_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalProtocolFee_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalSwapCount?: InputMaybe<Scalars['BigInt']['input']>;
  totalSwapCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalSwapCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalSwapCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalSwapCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalSwapCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalSwapCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalSwapCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalSwapFee?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapFee_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapFee_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapFee_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalSwapFee_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapFee_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapFee_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapFee_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalSwapVolume?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapVolume_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapVolume_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapVolume_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalSwapVolume_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapVolume_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapVolume_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
};

export type Balancer_OrderBy =
  | 'id'
  | 'poolCount'
  | 'pools'
  | 'protocolFeesCollector'
  | 'snapshots'
  | 'totalLiquidity'
  | 'totalProtocolFee'
  | 'totalSwapCount'
  | 'totalSwapFee'
  | 'totalSwapVolume'
  | '%future added value';

export type BlockChangedFilter = {
  number_gte: Scalars['Int']['input'];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  number?: InputMaybe<Scalars['Int']['input']>;
  number_gte?: InputMaybe<Scalars['Int']['input']>;
};

export type CircuitBreaker = {
  __typename?: 'CircuitBreaker';
  bptPrice: Scalars['BigDecimal']['output'];
  id: Scalars['ID']['output'];
  lowerBoundPercentage: Scalars['BigDecimal']['output'];
  pool: Pool;
  token: PoolToken;
  upperBoundPercentage: Scalars['BigDecimal']['output'];
};

export type CircuitBreaker_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<CircuitBreaker_Filter>>>;
  bptPrice?: InputMaybe<Scalars['BigDecimal']['input']>;
  bptPrice_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  bptPrice_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  bptPrice_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  bptPrice_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  bptPrice_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  bptPrice_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  bptPrice_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  lowerBoundPercentage?: InputMaybe<Scalars['BigDecimal']['input']>;
  lowerBoundPercentage_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  lowerBoundPercentage_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  lowerBoundPercentage_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  lowerBoundPercentage_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  lowerBoundPercentage_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  lowerBoundPercentage_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  lowerBoundPercentage_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  or?: InputMaybe<Array<InputMaybe<CircuitBreaker_Filter>>>;
  pool?: InputMaybe<Scalars['String']['input']>;
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
  token?: InputMaybe<Scalars['String']['input']>;
  token_?: InputMaybe<PoolToken_Filter>;
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
  upperBoundPercentage?: InputMaybe<Scalars['BigDecimal']['input']>;
  upperBoundPercentage_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  upperBoundPercentage_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  upperBoundPercentage_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  upperBoundPercentage_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  upperBoundPercentage_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  upperBoundPercentage_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  upperBoundPercentage_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
};

export type CircuitBreaker_OrderBy =
  | 'bptPrice'
  | 'id'
  | 'lowerBoundPercentage'
  | 'pool'
  | 'pool__address'
  | 'pool__alpha'
  | 'pool__amp'
  | 'pool__baseToken'
  | 'pool__beta'
  | 'pool__c'
  | 'pool__createTime'
  | 'pool__dSq'
  | 'pool__delta'
  | 'pool__epsilon'
  | 'pool__expiryTime'
  | 'pool__factory'
  | 'pool__holdersCount'
  | 'pool__id'
  | 'pool__isInRecoveryMode'
  | 'pool__isPaused'
  | 'pool__joinExitEnabled'
  | 'pool__lambda'
  | 'pool__lastJoinExitAmp'
  | 'pool__lastPostJoinExitInvariant'
  | 'pool__lowerTarget'
  | 'pool__mainIndex'
  | 'pool__managementAumFee'
  | 'pool__managementFee'
  | 'pool__mustAllowlistLPs'
  | 'pool__name'
  | 'pool__oracleEnabled'
  | 'pool__owner'
  | 'pool__poolType'
  | 'pool__poolTypeVersion'
  | 'pool__principalToken'
  | 'pool__protocolAumFeeCache'
  | 'pool__protocolId'
  | 'pool__protocolSwapFeeCache'
  | 'pool__protocolYieldFeeCache'
  | 'pool__root3Alpha'
  | 'pool__s'
  | 'pool__sqrtAlpha'
  | 'pool__sqrtBeta'
  | 'pool__strategyType'
  | 'pool__swapEnabled'
  | 'pool__swapEnabledCurationSignal'
  | 'pool__swapEnabledInternal'
  | 'pool__swapFee'
  | 'pool__swapsCount'
  | 'pool__symbol'
  | 'pool__tauAlphaX'
  | 'pool__tauAlphaY'
  | 'pool__tauBetaX'
  | 'pool__tauBetaY'
  | 'pool__totalAumFeeCollectedInBPT'
  | 'pool__totalLiquidity'
  | 'pool__totalLiquiditySansBPT'
  | 'pool__totalProtocolFee'
  | 'pool__totalProtocolFeePaidInBPT'
  | 'pool__totalShares'
  | 'pool__totalSwapFee'
  | 'pool__totalSwapVolume'
  | 'pool__totalWeight'
  | 'pool__tx'
  | 'pool__u'
  | 'pool__unitSeconds'
  | 'pool__upperTarget'
  | 'pool__v'
  | 'pool__w'
  | 'pool__wrappedIndex'
  | 'pool__z'
  | 'token'
  | 'token__address'
  | 'token__assetManager'
  | 'token__balance'
  | 'token__cashBalance'
  | 'token__decimals'
  | 'token__id'
  | 'token__index'
  | 'token__isExemptFromYieldProtocolFee'
  | 'token__managedBalance'
  | 'token__name'
  | 'token__oldPriceRate'
  | 'token__paidProtocolFees'
  | 'token__priceRate'
  | 'token__symbol'
  | 'token__weight'
  | 'upperBoundPercentage'
  | '%future added value';

export type FxOracle = {
  __typename?: 'FXOracle';
  decimals?: Maybe<Scalars['Int']['output']>;
  divisor?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  tokens: Array<Scalars['Bytes']['output']>;
};

export type FxOracle_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<FxOracle_Filter>>>;
  decimals?: InputMaybe<Scalars['Int']['input']>;
  decimals_gt?: InputMaybe<Scalars['Int']['input']>;
  decimals_gte?: InputMaybe<Scalars['Int']['input']>;
  decimals_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  decimals_lt?: InputMaybe<Scalars['Int']['input']>;
  decimals_lte?: InputMaybe<Scalars['Int']['input']>;
  decimals_not?: InputMaybe<Scalars['Int']['input']>;
  decimals_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  divisor?: InputMaybe<Scalars['String']['input']>;
  divisor_contains?: InputMaybe<Scalars['String']['input']>;
  divisor_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  divisor_ends_with?: InputMaybe<Scalars['String']['input']>;
  divisor_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  divisor_gt?: InputMaybe<Scalars['String']['input']>;
  divisor_gte?: InputMaybe<Scalars['String']['input']>;
  divisor_in?: InputMaybe<Array<Scalars['String']['input']>>;
  divisor_lt?: InputMaybe<Scalars['String']['input']>;
  divisor_lte?: InputMaybe<Scalars['String']['input']>;
  divisor_not?: InputMaybe<Scalars['String']['input']>;
  divisor_not_contains?: InputMaybe<Scalars['String']['input']>;
  divisor_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  divisor_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  divisor_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  divisor_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  divisor_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  divisor_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  divisor_starts_with?: InputMaybe<Scalars['String']['input']>;
  divisor_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<FxOracle_Filter>>>;
  tokens?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  tokens_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  tokens_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  tokens_not?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  tokens_not_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  tokens_not_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export type FxOracle_OrderBy =
  | 'decimals'
  | 'divisor'
  | 'id'
  | 'tokens'
  | '%future added value';

export type GradualWeightUpdate = {
  __typename?: 'GradualWeightUpdate';
  endTimestamp: Scalars['BigInt']['output'];
  endWeights: Array<Scalars['BigInt']['output']>;
  id: Scalars['ID']['output'];
  poolId: Pool;
  scheduledTimestamp: Scalars['Int']['output'];
  startTimestamp: Scalars['BigInt']['output'];
  startWeights: Array<Scalars['BigInt']['output']>;
};

export type GradualWeightUpdate_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<GradualWeightUpdate_Filter>>>;
  endTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  endTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  endTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  endTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  endTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  endTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  endTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  endTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  endWeights?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  endWeights_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  endWeights_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  endWeights_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  endWeights_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  endWeights_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<GradualWeightUpdate_Filter>>>;
  poolId?: InputMaybe<Scalars['String']['input']>;
  poolId_?: InputMaybe<Pool_Filter>;
  poolId_contains?: InputMaybe<Scalars['String']['input']>;
  poolId_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  poolId_ends_with?: InputMaybe<Scalars['String']['input']>;
  poolId_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  poolId_gt?: InputMaybe<Scalars['String']['input']>;
  poolId_gte?: InputMaybe<Scalars['String']['input']>;
  poolId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  poolId_lt?: InputMaybe<Scalars['String']['input']>;
  poolId_lte?: InputMaybe<Scalars['String']['input']>;
  poolId_not?: InputMaybe<Scalars['String']['input']>;
  poolId_not_contains?: InputMaybe<Scalars['String']['input']>;
  poolId_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  poolId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  poolId_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  poolId_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  poolId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  poolId_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  poolId_starts_with?: InputMaybe<Scalars['String']['input']>;
  poolId_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  scheduledTimestamp?: InputMaybe<Scalars['Int']['input']>;
  scheduledTimestamp_gt?: InputMaybe<Scalars['Int']['input']>;
  scheduledTimestamp_gte?: InputMaybe<Scalars['Int']['input']>;
  scheduledTimestamp_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  scheduledTimestamp_lt?: InputMaybe<Scalars['Int']['input']>;
  scheduledTimestamp_lte?: InputMaybe<Scalars['Int']['input']>;
  scheduledTimestamp_not?: InputMaybe<Scalars['Int']['input']>;
  scheduledTimestamp_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  startTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  startTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  startTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  startTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  startTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  startTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  startTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  startTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  startWeights?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  startWeights_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  startWeights_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  startWeights_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  startWeights_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  startWeights_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type GradualWeightUpdate_OrderBy =
  | 'endTimestamp'
  | 'endWeights'
  | 'id'
  | 'poolId'
  | 'poolId__address'
  | 'poolId__alpha'
  | 'poolId__amp'
  | 'poolId__baseToken'
  | 'poolId__beta'
  | 'poolId__c'
  | 'poolId__createTime'
  | 'poolId__dSq'
  | 'poolId__delta'
  | 'poolId__epsilon'
  | 'poolId__expiryTime'
  | 'poolId__factory'
  | 'poolId__holdersCount'
  | 'poolId__id'
  | 'poolId__isInRecoveryMode'
  | 'poolId__isPaused'
  | 'poolId__joinExitEnabled'
  | 'poolId__lambda'
  | 'poolId__lastJoinExitAmp'
  | 'poolId__lastPostJoinExitInvariant'
  | 'poolId__lowerTarget'
  | 'poolId__mainIndex'
  | 'poolId__managementAumFee'
  | 'poolId__managementFee'
  | 'poolId__mustAllowlistLPs'
  | 'poolId__name'
  | 'poolId__oracleEnabled'
  | 'poolId__owner'
  | 'poolId__poolType'
  | 'poolId__poolTypeVersion'
  | 'poolId__principalToken'
  | 'poolId__protocolAumFeeCache'
  | 'poolId__protocolId'
  | 'poolId__protocolSwapFeeCache'
  | 'poolId__protocolYieldFeeCache'
  | 'poolId__root3Alpha'
  | 'poolId__s'
  | 'poolId__sqrtAlpha'
  | 'poolId__sqrtBeta'
  | 'poolId__strategyType'
  | 'poolId__swapEnabled'
  | 'poolId__swapEnabledCurationSignal'
  | 'poolId__swapEnabledInternal'
  | 'poolId__swapFee'
  | 'poolId__swapsCount'
  | 'poolId__symbol'
  | 'poolId__tauAlphaX'
  | 'poolId__tauAlphaY'
  | 'poolId__tauBetaX'
  | 'poolId__tauBetaY'
  | 'poolId__totalAumFeeCollectedInBPT'
  | 'poolId__totalLiquidity'
  | 'poolId__totalLiquiditySansBPT'
  | 'poolId__totalProtocolFee'
  | 'poolId__totalProtocolFeePaidInBPT'
  | 'poolId__totalShares'
  | 'poolId__totalSwapFee'
  | 'poolId__totalSwapVolume'
  | 'poolId__totalWeight'
  | 'poolId__tx'
  | 'poolId__u'
  | 'poolId__unitSeconds'
  | 'poolId__upperTarget'
  | 'poolId__v'
  | 'poolId__w'
  | 'poolId__wrappedIndex'
  | 'poolId__z'
  | 'scheduledTimestamp'
  | 'startTimestamp'
  | 'startWeights'
  | '%future added value';

export type InvestType =
  | 'Exit'
  | 'Join'
  | '%future added value';

export type JoinExit = {
  __typename?: 'JoinExit';
  amounts: Array<Scalars['BigDecimal']['output']>;
  block?: Maybe<Scalars['BigInt']['output']>;
  id: Scalars['ID']['output'];
  pool: Pool;
  sender: Scalars['Bytes']['output'];
  timestamp: Scalars['Int']['output'];
  tx: Scalars['Bytes']['output'];
  type: InvestType;
  user: User;
  valueUSD?: Maybe<Scalars['BigDecimal']['output']>;
};

export type JoinExit_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amounts?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amounts_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amounts_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amounts_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amounts_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amounts_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  and?: InputMaybe<Array<InputMaybe<JoinExit_Filter>>>;
  block?: InputMaybe<Scalars['BigInt']['input']>;
  block_gt?: InputMaybe<Scalars['BigInt']['input']>;
  block_gte?: InputMaybe<Scalars['BigInt']['input']>;
  block_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  block_lt?: InputMaybe<Scalars['BigInt']['input']>;
  block_lte?: InputMaybe<Scalars['BigInt']['input']>;
  block_not?: InputMaybe<Scalars['BigInt']['input']>;
  block_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<JoinExit_Filter>>>;
  pool?: InputMaybe<Scalars['String']['input']>;
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
  timestamp?: InputMaybe<Scalars['Int']['input']>;
  timestamp_gt?: InputMaybe<Scalars['Int']['input']>;
  timestamp_gte?: InputMaybe<Scalars['Int']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']['input']>;
  timestamp_lte?: InputMaybe<Scalars['Int']['input']>;
  timestamp_not?: InputMaybe<Scalars['Int']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  tx?: InputMaybe<Scalars['Bytes']['input']>;
  tx_contains?: InputMaybe<Scalars['Bytes']['input']>;
  tx_gt?: InputMaybe<Scalars['Bytes']['input']>;
  tx_gte?: InputMaybe<Scalars['Bytes']['input']>;
  tx_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  tx_lt?: InputMaybe<Scalars['Bytes']['input']>;
  tx_lte?: InputMaybe<Scalars['Bytes']['input']>;
  tx_not?: InputMaybe<Scalars['Bytes']['input']>;
  tx_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  tx_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  type?: InputMaybe<InvestType>;
  type_in?: InputMaybe<Array<InvestType>>;
  type_not?: InputMaybe<InvestType>;
  type_not_in?: InputMaybe<Array<InvestType>>;
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
  valueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  valueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  valueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  valueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  valueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  valueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  valueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  valueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
};

export type JoinExit_OrderBy =
  | 'amounts'
  | 'block'
  | 'id'
  | 'pool'
  | 'pool__address'
  | 'pool__alpha'
  | 'pool__amp'
  | 'pool__baseToken'
  | 'pool__beta'
  | 'pool__c'
  | 'pool__createTime'
  | 'pool__dSq'
  | 'pool__delta'
  | 'pool__epsilon'
  | 'pool__expiryTime'
  | 'pool__factory'
  | 'pool__holdersCount'
  | 'pool__id'
  | 'pool__isInRecoveryMode'
  | 'pool__isPaused'
  | 'pool__joinExitEnabled'
  | 'pool__lambda'
  | 'pool__lastJoinExitAmp'
  | 'pool__lastPostJoinExitInvariant'
  | 'pool__lowerTarget'
  | 'pool__mainIndex'
  | 'pool__managementAumFee'
  | 'pool__managementFee'
  | 'pool__mustAllowlistLPs'
  | 'pool__name'
  | 'pool__oracleEnabled'
  | 'pool__owner'
  | 'pool__poolType'
  | 'pool__poolTypeVersion'
  | 'pool__principalToken'
  | 'pool__protocolAumFeeCache'
  | 'pool__protocolId'
  | 'pool__protocolSwapFeeCache'
  | 'pool__protocolYieldFeeCache'
  | 'pool__root3Alpha'
  | 'pool__s'
  | 'pool__sqrtAlpha'
  | 'pool__sqrtBeta'
  | 'pool__strategyType'
  | 'pool__swapEnabled'
  | 'pool__swapEnabledCurationSignal'
  | 'pool__swapEnabledInternal'
  | 'pool__swapFee'
  | 'pool__swapsCount'
  | 'pool__symbol'
  | 'pool__tauAlphaX'
  | 'pool__tauAlphaY'
  | 'pool__tauBetaX'
  | 'pool__tauBetaY'
  | 'pool__totalAumFeeCollectedInBPT'
  | 'pool__totalLiquidity'
  | 'pool__totalLiquiditySansBPT'
  | 'pool__totalProtocolFee'
  | 'pool__totalProtocolFeePaidInBPT'
  | 'pool__totalShares'
  | 'pool__totalSwapFee'
  | 'pool__totalSwapVolume'
  | 'pool__totalWeight'
  | 'pool__tx'
  | 'pool__u'
  | 'pool__unitSeconds'
  | 'pool__upperTarget'
  | 'pool__v'
  | 'pool__w'
  | 'pool__wrappedIndex'
  | 'pool__z'
  | 'sender'
  | 'timestamp'
  | 'tx'
  | 'type'
  | 'user'
  | 'user__id'
  | 'valueUSD'
  | '%future added value';

export type LatestPrice = {
  __typename?: 'LatestPrice';
  asset: Scalars['Bytes']['output'];
  block: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  poolId: Pool;
  price: Scalars['BigDecimal']['output'];
  pricingAsset: Scalars['Bytes']['output'];
};

export type LatestPrice_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<LatestPrice_Filter>>>;
  asset?: InputMaybe<Scalars['Bytes']['input']>;
  asset_contains?: InputMaybe<Scalars['Bytes']['input']>;
  asset_gt?: InputMaybe<Scalars['Bytes']['input']>;
  asset_gte?: InputMaybe<Scalars['Bytes']['input']>;
  asset_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  asset_lt?: InputMaybe<Scalars['Bytes']['input']>;
  asset_lte?: InputMaybe<Scalars['Bytes']['input']>;
  asset_not?: InputMaybe<Scalars['Bytes']['input']>;
  asset_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  asset_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  block?: InputMaybe<Scalars['BigInt']['input']>;
  block_gt?: InputMaybe<Scalars['BigInt']['input']>;
  block_gte?: InputMaybe<Scalars['BigInt']['input']>;
  block_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  block_lt?: InputMaybe<Scalars['BigInt']['input']>;
  block_lte?: InputMaybe<Scalars['BigInt']['input']>;
  block_not?: InputMaybe<Scalars['BigInt']['input']>;
  block_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<LatestPrice_Filter>>>;
  poolId?: InputMaybe<Scalars['String']['input']>;
  poolId_?: InputMaybe<Pool_Filter>;
  poolId_contains?: InputMaybe<Scalars['String']['input']>;
  poolId_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  poolId_ends_with?: InputMaybe<Scalars['String']['input']>;
  poolId_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  poolId_gt?: InputMaybe<Scalars['String']['input']>;
  poolId_gte?: InputMaybe<Scalars['String']['input']>;
  poolId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  poolId_lt?: InputMaybe<Scalars['String']['input']>;
  poolId_lte?: InputMaybe<Scalars['String']['input']>;
  poolId_not?: InputMaybe<Scalars['String']['input']>;
  poolId_not_contains?: InputMaybe<Scalars['String']['input']>;
  poolId_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  poolId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  poolId_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  poolId_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  poolId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  poolId_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  poolId_starts_with?: InputMaybe<Scalars['String']['input']>;
  poolId_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  price_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  pricingAsset?: InputMaybe<Scalars['Bytes']['input']>;
  pricingAsset_contains?: InputMaybe<Scalars['Bytes']['input']>;
  pricingAsset_gt?: InputMaybe<Scalars['Bytes']['input']>;
  pricingAsset_gte?: InputMaybe<Scalars['Bytes']['input']>;
  pricingAsset_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  pricingAsset_lt?: InputMaybe<Scalars['Bytes']['input']>;
  pricingAsset_lte?: InputMaybe<Scalars['Bytes']['input']>;
  pricingAsset_not?: InputMaybe<Scalars['Bytes']['input']>;
  pricingAsset_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  pricingAsset_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export type LatestPrice_OrderBy =
  | 'asset'
  | 'block'
  | 'id'
  | 'poolId'
  | 'poolId__address'
  | 'poolId__alpha'
  | 'poolId__amp'
  | 'poolId__baseToken'
  | 'poolId__beta'
  | 'poolId__c'
  | 'poolId__createTime'
  | 'poolId__dSq'
  | 'poolId__delta'
  | 'poolId__epsilon'
  | 'poolId__expiryTime'
  | 'poolId__factory'
  | 'poolId__holdersCount'
  | 'poolId__id'
  | 'poolId__isInRecoveryMode'
  | 'poolId__isPaused'
  | 'poolId__joinExitEnabled'
  | 'poolId__lambda'
  | 'poolId__lastJoinExitAmp'
  | 'poolId__lastPostJoinExitInvariant'
  | 'poolId__lowerTarget'
  | 'poolId__mainIndex'
  | 'poolId__managementAumFee'
  | 'poolId__managementFee'
  | 'poolId__mustAllowlistLPs'
  | 'poolId__name'
  | 'poolId__oracleEnabled'
  | 'poolId__owner'
  | 'poolId__poolType'
  | 'poolId__poolTypeVersion'
  | 'poolId__principalToken'
  | 'poolId__protocolAumFeeCache'
  | 'poolId__protocolId'
  | 'poolId__protocolSwapFeeCache'
  | 'poolId__protocolYieldFeeCache'
  | 'poolId__root3Alpha'
  | 'poolId__s'
  | 'poolId__sqrtAlpha'
  | 'poolId__sqrtBeta'
  | 'poolId__strategyType'
  | 'poolId__swapEnabled'
  | 'poolId__swapEnabledCurationSignal'
  | 'poolId__swapEnabledInternal'
  | 'poolId__swapFee'
  | 'poolId__swapsCount'
  | 'poolId__symbol'
  | 'poolId__tauAlphaX'
  | 'poolId__tauAlphaY'
  | 'poolId__tauBetaX'
  | 'poolId__tauBetaY'
  | 'poolId__totalAumFeeCollectedInBPT'
  | 'poolId__totalLiquidity'
  | 'poolId__totalLiquiditySansBPT'
  | 'poolId__totalProtocolFee'
  | 'poolId__totalProtocolFeePaidInBPT'
  | 'poolId__totalShares'
  | 'poolId__totalSwapFee'
  | 'poolId__totalSwapVolume'
  | 'poolId__totalWeight'
  | 'poolId__tx'
  | 'poolId__u'
  | 'poolId__unitSeconds'
  | 'poolId__upperTarget'
  | 'poolId__v'
  | 'poolId__w'
  | 'poolId__wrappedIndex'
  | 'poolId__z'
  | 'price'
  | 'pricingAsset'
  | '%future added value';

export type ManagementOperation = {
  __typename?: 'ManagementOperation';
  cashDelta: Scalars['BigDecimal']['output'];
  id: Scalars['ID']['output'];
  managedDelta: Scalars['BigDecimal']['output'];
  poolTokenId: PoolToken;
  timestamp: Scalars['Int']['output'];
  type: OperationType;
};

export type ManagementOperation_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ManagementOperation_Filter>>>;
  cashDelta?: InputMaybe<Scalars['BigDecimal']['input']>;
  cashDelta_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cashDelta_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cashDelta_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cashDelta_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cashDelta_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cashDelta_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cashDelta_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  managedDelta?: InputMaybe<Scalars['BigDecimal']['input']>;
  managedDelta_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  managedDelta_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  managedDelta_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  managedDelta_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  managedDelta_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  managedDelta_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  managedDelta_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  or?: InputMaybe<Array<InputMaybe<ManagementOperation_Filter>>>;
  poolTokenId?: InputMaybe<Scalars['String']['input']>;
  poolTokenId_?: InputMaybe<PoolToken_Filter>;
  poolTokenId_contains?: InputMaybe<Scalars['String']['input']>;
  poolTokenId_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  poolTokenId_ends_with?: InputMaybe<Scalars['String']['input']>;
  poolTokenId_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  poolTokenId_gt?: InputMaybe<Scalars['String']['input']>;
  poolTokenId_gte?: InputMaybe<Scalars['String']['input']>;
  poolTokenId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  poolTokenId_lt?: InputMaybe<Scalars['String']['input']>;
  poolTokenId_lte?: InputMaybe<Scalars['String']['input']>;
  poolTokenId_not?: InputMaybe<Scalars['String']['input']>;
  poolTokenId_not_contains?: InputMaybe<Scalars['String']['input']>;
  poolTokenId_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  poolTokenId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  poolTokenId_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  poolTokenId_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  poolTokenId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  poolTokenId_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  poolTokenId_starts_with?: InputMaybe<Scalars['String']['input']>;
  poolTokenId_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['Int']['input']>;
  timestamp_gt?: InputMaybe<Scalars['Int']['input']>;
  timestamp_gte?: InputMaybe<Scalars['Int']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']['input']>;
  timestamp_lte?: InputMaybe<Scalars['Int']['input']>;
  timestamp_not?: InputMaybe<Scalars['Int']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  type?: InputMaybe<OperationType>;
  type_in?: InputMaybe<Array<OperationType>>;
  type_not?: InputMaybe<OperationType>;
  type_not_in?: InputMaybe<Array<OperationType>>;
};

export type ManagementOperation_OrderBy =
  | 'cashDelta'
  | 'id'
  | 'managedDelta'
  | 'poolTokenId'
  | 'poolTokenId__address'
  | 'poolTokenId__assetManager'
  | 'poolTokenId__balance'
  | 'poolTokenId__cashBalance'
  | 'poolTokenId__decimals'
  | 'poolTokenId__id'
  | 'poolTokenId__index'
  | 'poolTokenId__isExemptFromYieldProtocolFee'
  | 'poolTokenId__managedBalance'
  | 'poolTokenId__name'
  | 'poolTokenId__oldPriceRate'
  | 'poolTokenId__paidProtocolFees'
  | 'poolTokenId__priceRate'
  | 'poolTokenId__symbol'
  | 'poolTokenId__weight'
  | 'timestamp'
  | 'type'
  | '%future added value';

export type OperationType =
  | 'Deposit'
  | 'Update'
  | 'Withdraw'
  | '%future added value';

/** Defines the order direction, either ascending or descending */
export type OrderDirection =
  | 'asc'
  | 'desc'
  | '%future added value';

export type Pool = {
  __typename?: 'Pool';
  address: Scalars['Bytes']['output'];
  alpha?: Maybe<Scalars['BigDecimal']['output']>;
  amp?: Maybe<Scalars['BigInt']['output']>;
  ampUpdates?: Maybe<Array<AmpUpdate>>;
  baseToken?: Maybe<Scalars['Bytes']['output']>;
  beta?: Maybe<Scalars['BigDecimal']['output']>;
  c?: Maybe<Scalars['BigDecimal']['output']>;
  circuitBreakers?: Maybe<Array<CircuitBreaker>>;
  createTime: Scalars['Int']['output'];
  dSq?: Maybe<Scalars['BigDecimal']['output']>;
  delta?: Maybe<Scalars['BigDecimal']['output']>;
  epsilon?: Maybe<Scalars['BigDecimal']['output']>;
  expiryTime?: Maybe<Scalars['BigInt']['output']>;
  factory?: Maybe<Scalars['Bytes']['output']>;
  historicalValues?: Maybe<Array<PoolHistoricalLiquidity>>;
  holdersCount: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  isInRecoveryMode?: Maybe<Scalars['Boolean']['output']>;
  isPaused?: Maybe<Scalars['Boolean']['output']>;
  joinExitEnabled?: Maybe<Scalars['Boolean']['output']>;
  joinsExits?: Maybe<Array<JoinExit>>;
  lambda?: Maybe<Scalars['BigDecimal']['output']>;
  lastJoinExitAmp?: Maybe<Scalars['BigInt']['output']>;
  lastPostJoinExitInvariant?: Maybe<Scalars['BigDecimal']['output']>;
  latestAmpUpdate?: Maybe<AmpUpdate>;
  lowerTarget?: Maybe<Scalars['BigDecimal']['output']>;
  mainIndex?: Maybe<Scalars['Int']['output']>;
  managementAumFee?: Maybe<Scalars['BigDecimal']['output']>;
  managementFee?: Maybe<Scalars['BigDecimal']['output']>;
  mustAllowlistLPs?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  oracleEnabled: Scalars['Boolean']['output'];
  owner?: Maybe<Scalars['Bytes']['output']>;
  poolType?: Maybe<Scalars['String']['output']>;
  poolTypeVersion?: Maybe<Scalars['Int']['output']>;
  priceRateProviders?: Maybe<Array<PriceRateProvider>>;
  principalToken?: Maybe<Scalars['Bytes']['output']>;
  protocolAumFeeCache?: Maybe<Scalars['BigDecimal']['output']>;
  protocolId?: Maybe<Scalars['Int']['output']>;
  protocolIdData?: Maybe<ProtocolIdData>;
  protocolSwapFeeCache?: Maybe<Scalars['BigDecimal']['output']>;
  protocolYieldFeeCache?: Maybe<Scalars['BigDecimal']['output']>;
  root3Alpha?: Maybe<Scalars['BigDecimal']['output']>;
  s?: Maybe<Scalars['BigDecimal']['output']>;
  shares?: Maybe<Array<PoolShare>>;
  snapshots?: Maybe<Array<PoolSnapshot>>;
  sqrtAlpha?: Maybe<Scalars['BigDecimal']['output']>;
  sqrtBeta?: Maybe<Scalars['BigDecimal']['output']>;
  strategyType: Scalars['Int']['output'];
  /** Indicates if a pool can be swapped against. Combines multiple sources, including offchain curation */
  swapEnabled: Scalars['Boolean']['output'];
  /** External indication from an offchain permissioned actor */
  swapEnabledCurationSignal?: Maybe<Scalars['Boolean']['output']>;
  /** The native swapEnabled boolean. internal to the pool. Only applies to Gyro, LBPs and InvestmentPools */
  swapEnabledInternal?: Maybe<Scalars['Boolean']['output']>;
  swapFee: Scalars['BigDecimal']['output'];
  swaps?: Maybe<Array<Swap>>;
  swapsCount: Scalars['BigInt']['output'];
  symbol?: Maybe<Scalars['String']['output']>;
  tauAlphaX?: Maybe<Scalars['BigDecimal']['output']>;
  tauAlphaY?: Maybe<Scalars['BigDecimal']['output']>;
  tauBetaX?: Maybe<Scalars['BigDecimal']['output']>;
  tauBetaY?: Maybe<Scalars['BigDecimal']['output']>;
  tokens?: Maybe<Array<PoolToken>>;
  tokensList: Array<Scalars['Bytes']['output']>;
  totalAumFeeCollectedInBPT?: Maybe<Scalars['BigDecimal']['output']>;
  totalLiquidity: Scalars['BigDecimal']['output'];
  totalLiquiditySansBPT?: Maybe<Scalars['BigDecimal']['output']>;
  totalProtocolFee?: Maybe<Scalars['BigDecimal']['output']>;
  totalProtocolFeePaidInBPT?: Maybe<Scalars['BigDecimal']['output']>;
  totalShares: Scalars['BigDecimal']['output'];
  totalSwapFee: Scalars['BigDecimal']['output'];
  totalSwapVolume: Scalars['BigDecimal']['output'];
  totalWeight?: Maybe<Scalars['BigDecimal']['output']>;
  tx?: Maybe<Scalars['Bytes']['output']>;
  u?: Maybe<Scalars['BigDecimal']['output']>;
  unitSeconds?: Maybe<Scalars['BigInt']['output']>;
  upperTarget?: Maybe<Scalars['BigDecimal']['output']>;
  v?: Maybe<Scalars['BigDecimal']['output']>;
  vaultID: Balancer;
  w?: Maybe<Scalars['BigDecimal']['output']>;
  weightUpdates?: Maybe<Array<GradualWeightUpdate>>;
  wrappedIndex?: Maybe<Scalars['Int']['output']>;
  z?: Maybe<Scalars['BigDecimal']['output']>;
};


export type PoolAmpUpdatesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AmpUpdate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<AmpUpdate_Filter>;
};


export type PoolCircuitBreakersArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<CircuitBreaker_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<CircuitBreaker_Filter>;
};


export type PoolHistoricalValuesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolHistoricalLiquidity_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PoolHistoricalLiquidity_Filter>;
};


export type PoolJoinsExitsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<JoinExit_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<JoinExit_Filter>;
};


export type PoolPriceRateProvidersArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PriceRateProvider_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PriceRateProvider_Filter>;
};


export type PoolSharesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolShare_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PoolShare_Filter>;
};


export type PoolSnapshotsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolSnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PoolSnapshot_Filter>;
};


export type PoolSwapsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Swap_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Swap_Filter>;
};


export type PoolTokensArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PoolToken_Filter>;
};


export type PoolWeightUpdatesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GradualWeightUpdate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<GradualWeightUpdate_Filter>;
};

export type PoolContract = {
  __typename?: 'PoolContract';
  id: Scalars['ID']['output'];
  pool: Pool;
};

export type PoolContract_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<PoolContract_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<PoolContract_Filter>>>;
  pool?: InputMaybe<Scalars['String']['input']>;
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
};

export type PoolContract_OrderBy =
  | 'id'
  | 'pool'
  | 'pool__address'
  | 'pool__alpha'
  | 'pool__amp'
  | 'pool__baseToken'
  | 'pool__beta'
  | 'pool__c'
  | 'pool__createTime'
  | 'pool__dSq'
  | 'pool__delta'
  | 'pool__epsilon'
  | 'pool__expiryTime'
  | 'pool__factory'
  | 'pool__holdersCount'
  | 'pool__id'
  | 'pool__isInRecoveryMode'
  | 'pool__isPaused'
  | 'pool__joinExitEnabled'
  | 'pool__lambda'
  | 'pool__lastJoinExitAmp'
  | 'pool__lastPostJoinExitInvariant'
  | 'pool__lowerTarget'
  | 'pool__mainIndex'
  | 'pool__managementAumFee'
  | 'pool__managementFee'
  | 'pool__mustAllowlistLPs'
  | 'pool__name'
  | 'pool__oracleEnabled'
  | 'pool__owner'
  | 'pool__poolType'
  | 'pool__poolTypeVersion'
  | 'pool__principalToken'
  | 'pool__protocolAumFeeCache'
  | 'pool__protocolId'
  | 'pool__protocolSwapFeeCache'
  | 'pool__protocolYieldFeeCache'
  | 'pool__root3Alpha'
  | 'pool__s'
  | 'pool__sqrtAlpha'
  | 'pool__sqrtBeta'
  | 'pool__strategyType'
  | 'pool__swapEnabled'
  | 'pool__swapEnabledCurationSignal'
  | 'pool__swapEnabledInternal'
  | 'pool__swapFee'
  | 'pool__swapsCount'
  | 'pool__symbol'
  | 'pool__tauAlphaX'
  | 'pool__tauAlphaY'
  | 'pool__tauBetaX'
  | 'pool__tauBetaY'
  | 'pool__totalAumFeeCollectedInBPT'
  | 'pool__totalLiquidity'
  | 'pool__totalLiquiditySansBPT'
  | 'pool__totalProtocolFee'
  | 'pool__totalProtocolFeePaidInBPT'
  | 'pool__totalShares'
  | 'pool__totalSwapFee'
  | 'pool__totalSwapVolume'
  | 'pool__totalWeight'
  | 'pool__tx'
  | 'pool__u'
  | 'pool__unitSeconds'
  | 'pool__upperTarget'
  | 'pool__v'
  | 'pool__w'
  | 'pool__wrappedIndex'
  | 'pool__z'
  | '%future added value';

export type PoolHistoricalLiquidity = {
  __typename?: 'PoolHistoricalLiquidity';
  block: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  poolId: Pool;
  poolLiquidity: Scalars['BigDecimal']['output'];
  poolShareValue: Scalars['BigDecimal']['output'];
  poolTotalShares: Scalars['BigDecimal']['output'];
  pricingAsset: Scalars['Bytes']['output'];
};

export type PoolHistoricalLiquidity_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<PoolHistoricalLiquidity_Filter>>>;
  block?: InputMaybe<Scalars['BigInt']['input']>;
  block_gt?: InputMaybe<Scalars['BigInt']['input']>;
  block_gte?: InputMaybe<Scalars['BigInt']['input']>;
  block_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  block_lt?: InputMaybe<Scalars['BigInt']['input']>;
  block_lte?: InputMaybe<Scalars['BigInt']['input']>;
  block_not?: InputMaybe<Scalars['BigInt']['input']>;
  block_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<PoolHistoricalLiquidity_Filter>>>;
  poolId?: InputMaybe<Scalars['String']['input']>;
  poolId_?: InputMaybe<Pool_Filter>;
  poolId_contains?: InputMaybe<Scalars['String']['input']>;
  poolId_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  poolId_ends_with?: InputMaybe<Scalars['String']['input']>;
  poolId_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  poolId_gt?: InputMaybe<Scalars['String']['input']>;
  poolId_gte?: InputMaybe<Scalars['String']['input']>;
  poolId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  poolId_lt?: InputMaybe<Scalars['String']['input']>;
  poolId_lte?: InputMaybe<Scalars['String']['input']>;
  poolId_not?: InputMaybe<Scalars['String']['input']>;
  poolId_not_contains?: InputMaybe<Scalars['String']['input']>;
  poolId_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  poolId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  poolId_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  poolId_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  poolId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  poolId_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  poolId_starts_with?: InputMaybe<Scalars['String']['input']>;
  poolId_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  poolLiquidity?: InputMaybe<Scalars['BigDecimal']['input']>;
  poolLiquidity_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  poolLiquidity_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  poolLiquidity_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  poolLiquidity_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  poolLiquidity_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  poolLiquidity_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  poolLiquidity_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  poolShareValue?: InputMaybe<Scalars['BigDecimal']['input']>;
  poolShareValue_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  poolShareValue_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  poolShareValue_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  poolShareValue_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  poolShareValue_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  poolShareValue_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  poolShareValue_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  poolTotalShares?: InputMaybe<Scalars['BigDecimal']['input']>;
  poolTotalShares_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  poolTotalShares_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  poolTotalShares_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  poolTotalShares_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  poolTotalShares_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  poolTotalShares_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  poolTotalShares_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  pricingAsset?: InputMaybe<Scalars['Bytes']['input']>;
  pricingAsset_contains?: InputMaybe<Scalars['Bytes']['input']>;
  pricingAsset_gt?: InputMaybe<Scalars['Bytes']['input']>;
  pricingAsset_gte?: InputMaybe<Scalars['Bytes']['input']>;
  pricingAsset_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  pricingAsset_lt?: InputMaybe<Scalars['Bytes']['input']>;
  pricingAsset_lte?: InputMaybe<Scalars['Bytes']['input']>;
  pricingAsset_not?: InputMaybe<Scalars['Bytes']['input']>;
  pricingAsset_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  pricingAsset_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
};

export type PoolHistoricalLiquidity_OrderBy =
  | 'block'
  | 'id'
  | 'poolId'
  | 'poolId__address'
  | 'poolId__alpha'
  | 'poolId__amp'
  | 'poolId__baseToken'
  | 'poolId__beta'
  | 'poolId__c'
  | 'poolId__createTime'
  | 'poolId__dSq'
  | 'poolId__delta'
  | 'poolId__epsilon'
  | 'poolId__expiryTime'
  | 'poolId__factory'
  | 'poolId__holdersCount'
  | 'poolId__id'
  | 'poolId__isInRecoveryMode'
  | 'poolId__isPaused'
  | 'poolId__joinExitEnabled'
  | 'poolId__lambda'
  | 'poolId__lastJoinExitAmp'
  | 'poolId__lastPostJoinExitInvariant'
  | 'poolId__lowerTarget'
  | 'poolId__mainIndex'
  | 'poolId__managementAumFee'
  | 'poolId__managementFee'
  | 'poolId__mustAllowlistLPs'
  | 'poolId__name'
  | 'poolId__oracleEnabled'
  | 'poolId__owner'
  | 'poolId__poolType'
  | 'poolId__poolTypeVersion'
  | 'poolId__principalToken'
  | 'poolId__protocolAumFeeCache'
  | 'poolId__protocolId'
  | 'poolId__protocolSwapFeeCache'
  | 'poolId__protocolYieldFeeCache'
  | 'poolId__root3Alpha'
  | 'poolId__s'
  | 'poolId__sqrtAlpha'
  | 'poolId__sqrtBeta'
  | 'poolId__strategyType'
  | 'poolId__swapEnabled'
  | 'poolId__swapEnabledCurationSignal'
  | 'poolId__swapEnabledInternal'
  | 'poolId__swapFee'
  | 'poolId__swapsCount'
  | 'poolId__symbol'
  | 'poolId__tauAlphaX'
  | 'poolId__tauAlphaY'
  | 'poolId__tauBetaX'
  | 'poolId__tauBetaY'
  | 'poolId__totalAumFeeCollectedInBPT'
  | 'poolId__totalLiquidity'
  | 'poolId__totalLiquiditySansBPT'
  | 'poolId__totalProtocolFee'
  | 'poolId__totalProtocolFeePaidInBPT'
  | 'poolId__totalShares'
  | 'poolId__totalSwapFee'
  | 'poolId__totalSwapVolume'
  | 'poolId__totalWeight'
  | 'poolId__tx'
  | 'poolId__u'
  | 'poolId__unitSeconds'
  | 'poolId__upperTarget'
  | 'poolId__v'
  | 'poolId__w'
  | 'poolId__wrappedIndex'
  | 'poolId__z'
  | 'poolLiquidity'
  | 'poolShareValue'
  | 'poolTotalShares'
  | 'pricingAsset'
  | '%future added value';

export type PoolShare = {
  __typename?: 'PoolShare';
  balance: Scalars['BigDecimal']['output'];
  id: Scalars['ID']['output'];
  poolId: Pool;
  userAddress: User;
};

export type PoolShare_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<PoolShare_Filter>>>;
  balance?: InputMaybe<Scalars['BigDecimal']['input']>;
  balance_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  balance_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  balance_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  balance_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  balance_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  balance_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  balance_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<PoolShare_Filter>>>;
  poolId?: InputMaybe<Scalars['String']['input']>;
  poolId_?: InputMaybe<Pool_Filter>;
  poolId_contains?: InputMaybe<Scalars['String']['input']>;
  poolId_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  poolId_ends_with?: InputMaybe<Scalars['String']['input']>;
  poolId_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  poolId_gt?: InputMaybe<Scalars['String']['input']>;
  poolId_gte?: InputMaybe<Scalars['String']['input']>;
  poolId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  poolId_lt?: InputMaybe<Scalars['String']['input']>;
  poolId_lte?: InputMaybe<Scalars['String']['input']>;
  poolId_not?: InputMaybe<Scalars['String']['input']>;
  poolId_not_contains?: InputMaybe<Scalars['String']['input']>;
  poolId_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  poolId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  poolId_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  poolId_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  poolId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  poolId_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  poolId_starts_with?: InputMaybe<Scalars['String']['input']>;
  poolId_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  userAddress?: InputMaybe<Scalars['String']['input']>;
  userAddress_?: InputMaybe<User_Filter>;
  userAddress_contains?: InputMaybe<Scalars['String']['input']>;
  userAddress_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  userAddress_ends_with?: InputMaybe<Scalars['String']['input']>;
  userAddress_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  userAddress_gt?: InputMaybe<Scalars['String']['input']>;
  userAddress_gte?: InputMaybe<Scalars['String']['input']>;
  userAddress_in?: InputMaybe<Array<Scalars['String']['input']>>;
  userAddress_lt?: InputMaybe<Scalars['String']['input']>;
  userAddress_lte?: InputMaybe<Scalars['String']['input']>;
  userAddress_not?: InputMaybe<Scalars['String']['input']>;
  userAddress_not_contains?: InputMaybe<Scalars['String']['input']>;
  userAddress_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  userAddress_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  userAddress_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  userAddress_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  userAddress_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  userAddress_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  userAddress_starts_with?: InputMaybe<Scalars['String']['input']>;
  userAddress_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export type PoolShare_OrderBy =
  | 'balance'
  | 'id'
  | 'poolId'
  | 'poolId__address'
  | 'poolId__alpha'
  | 'poolId__amp'
  | 'poolId__baseToken'
  | 'poolId__beta'
  | 'poolId__c'
  | 'poolId__createTime'
  | 'poolId__dSq'
  | 'poolId__delta'
  | 'poolId__epsilon'
  | 'poolId__expiryTime'
  | 'poolId__factory'
  | 'poolId__holdersCount'
  | 'poolId__id'
  | 'poolId__isInRecoveryMode'
  | 'poolId__isPaused'
  | 'poolId__joinExitEnabled'
  | 'poolId__lambda'
  | 'poolId__lastJoinExitAmp'
  | 'poolId__lastPostJoinExitInvariant'
  | 'poolId__lowerTarget'
  | 'poolId__mainIndex'
  | 'poolId__managementAumFee'
  | 'poolId__managementFee'
  | 'poolId__mustAllowlistLPs'
  | 'poolId__name'
  | 'poolId__oracleEnabled'
  | 'poolId__owner'
  | 'poolId__poolType'
  | 'poolId__poolTypeVersion'
  | 'poolId__principalToken'
  | 'poolId__protocolAumFeeCache'
  | 'poolId__protocolId'
  | 'poolId__protocolSwapFeeCache'
  | 'poolId__protocolYieldFeeCache'
  | 'poolId__root3Alpha'
  | 'poolId__s'
  | 'poolId__sqrtAlpha'
  | 'poolId__sqrtBeta'
  | 'poolId__strategyType'
  | 'poolId__swapEnabled'
  | 'poolId__swapEnabledCurationSignal'
  | 'poolId__swapEnabledInternal'
  | 'poolId__swapFee'
  | 'poolId__swapsCount'
  | 'poolId__symbol'
  | 'poolId__tauAlphaX'
  | 'poolId__tauAlphaY'
  | 'poolId__tauBetaX'
  | 'poolId__tauBetaY'
  | 'poolId__totalAumFeeCollectedInBPT'
  | 'poolId__totalLiquidity'
  | 'poolId__totalLiquiditySansBPT'
  | 'poolId__totalProtocolFee'
  | 'poolId__totalProtocolFeePaidInBPT'
  | 'poolId__totalShares'
  | 'poolId__totalSwapFee'
  | 'poolId__totalSwapVolume'
  | 'poolId__totalWeight'
  | 'poolId__tx'
  | 'poolId__u'
  | 'poolId__unitSeconds'
  | 'poolId__upperTarget'
  | 'poolId__v'
  | 'poolId__w'
  | 'poolId__wrappedIndex'
  | 'poolId__z'
  | 'userAddress'
  | 'userAddress__id'
  | '%future added value';

export type PoolSnapshot = {
  __typename?: 'PoolSnapshot';
  amounts: Array<Scalars['BigDecimal']['output']>;
  holdersCount: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  liquidity: Scalars['BigDecimal']['output'];
  pool: Pool;
  protocolFee?: Maybe<Scalars['BigDecimal']['output']>;
  swapFees: Scalars['BigDecimal']['output'];
  swapVolume: Scalars['BigDecimal']['output'];
  swapsCount: Scalars['BigInt']['output'];
  timestamp: Scalars['Int']['output'];
  totalShares: Scalars['BigDecimal']['output'];
};

export type PoolSnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amounts?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amounts_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amounts_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amounts_not?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amounts_not_contains?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amounts_not_contains_nocase?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  and?: InputMaybe<Array<InputMaybe<PoolSnapshot_Filter>>>;
  holdersCount?: InputMaybe<Scalars['BigInt']['input']>;
  holdersCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  holdersCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  holdersCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  holdersCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  holdersCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  holdersCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  holdersCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  or?: InputMaybe<Array<InputMaybe<PoolSnapshot_Filter>>>;
  pool?: InputMaybe<Scalars['String']['input']>;
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
  protocolFee?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolFee_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolFee_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolFee_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  protocolFee_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolFee_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolFee_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolFee_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  swapFees?: InputMaybe<Scalars['BigDecimal']['input']>;
  swapFees_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  swapFees_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  swapFees_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  swapFees_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  swapFees_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  swapFees_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  swapFees_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  swapVolume?: InputMaybe<Scalars['BigDecimal']['input']>;
  swapVolume_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  swapVolume_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  swapVolume_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  swapVolume_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  swapVolume_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  swapVolume_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  swapVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  swapsCount?: InputMaybe<Scalars['BigInt']['input']>;
  swapsCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  swapsCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  swapsCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  swapsCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  swapsCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  swapsCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  swapsCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp?: InputMaybe<Scalars['Int']['input']>;
  timestamp_gt?: InputMaybe<Scalars['Int']['input']>;
  timestamp_gte?: InputMaybe<Scalars['Int']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']['input']>;
  timestamp_lte?: InputMaybe<Scalars['Int']['input']>;
  timestamp_not?: InputMaybe<Scalars['Int']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  totalShares?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalShares_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalShares_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalShares_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalShares_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalShares_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalShares_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalShares_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
};

export type PoolSnapshot_OrderBy =
  | 'amounts'
  | 'holdersCount'
  | 'id'
  | 'liquidity'
  | 'pool'
  | 'pool__address'
  | 'pool__alpha'
  | 'pool__amp'
  | 'pool__baseToken'
  | 'pool__beta'
  | 'pool__c'
  | 'pool__createTime'
  | 'pool__dSq'
  | 'pool__delta'
  | 'pool__epsilon'
  | 'pool__expiryTime'
  | 'pool__factory'
  | 'pool__holdersCount'
  | 'pool__id'
  | 'pool__isInRecoveryMode'
  | 'pool__isPaused'
  | 'pool__joinExitEnabled'
  | 'pool__lambda'
  | 'pool__lastJoinExitAmp'
  | 'pool__lastPostJoinExitInvariant'
  | 'pool__lowerTarget'
  | 'pool__mainIndex'
  | 'pool__managementAumFee'
  | 'pool__managementFee'
  | 'pool__mustAllowlistLPs'
  | 'pool__name'
  | 'pool__oracleEnabled'
  | 'pool__owner'
  | 'pool__poolType'
  | 'pool__poolTypeVersion'
  | 'pool__principalToken'
  | 'pool__protocolAumFeeCache'
  | 'pool__protocolId'
  | 'pool__protocolSwapFeeCache'
  | 'pool__protocolYieldFeeCache'
  | 'pool__root3Alpha'
  | 'pool__s'
  | 'pool__sqrtAlpha'
  | 'pool__sqrtBeta'
  | 'pool__strategyType'
  | 'pool__swapEnabled'
  | 'pool__swapEnabledCurationSignal'
  | 'pool__swapEnabledInternal'
  | 'pool__swapFee'
  | 'pool__swapsCount'
  | 'pool__symbol'
  | 'pool__tauAlphaX'
  | 'pool__tauAlphaY'
  | 'pool__tauBetaX'
  | 'pool__tauBetaY'
  | 'pool__totalAumFeeCollectedInBPT'
  | 'pool__totalLiquidity'
  | 'pool__totalLiquiditySansBPT'
  | 'pool__totalProtocolFee'
  | 'pool__totalProtocolFeePaidInBPT'
  | 'pool__totalShares'
  | 'pool__totalSwapFee'
  | 'pool__totalSwapVolume'
  | 'pool__totalWeight'
  | 'pool__tx'
  | 'pool__u'
  | 'pool__unitSeconds'
  | 'pool__upperTarget'
  | 'pool__v'
  | 'pool__w'
  | 'pool__wrappedIndex'
  | 'pool__z'
  | 'protocolFee'
  | 'swapFees'
  | 'swapVolume'
  | 'swapsCount'
  | 'timestamp'
  | 'totalShares'
  | '%future added value';

export type PoolToken = {
  __typename?: 'PoolToken';
  address: Scalars['String']['output'];
  assetManager: Scalars['Bytes']['output'];
  balance: Scalars['BigDecimal']['output'];
  cashBalance: Scalars['BigDecimal']['output'];
  circuitBreaker?: Maybe<CircuitBreaker>;
  decimals: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  index?: Maybe<Scalars['Int']['output']>;
  isExemptFromYieldProtocolFee?: Maybe<Scalars['Boolean']['output']>;
  managedBalance: Scalars['BigDecimal']['output'];
  managements?: Maybe<Array<ManagementOperation>>;
  name: Scalars['String']['output'];
  oldPriceRate?: Maybe<Scalars['BigDecimal']['output']>;
  paidProtocolFees?: Maybe<Scalars['BigDecimal']['output']>;
  poolId?: Maybe<Pool>;
  priceRate: Scalars['BigDecimal']['output'];
  symbol: Scalars['String']['output'];
  token: Token;
  weight?: Maybe<Scalars['BigDecimal']['output']>;
};


export type PoolTokenManagementsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ManagementOperation_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<ManagementOperation_Filter>;
};

export type PoolToken_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  address?: InputMaybe<Scalars['String']['input']>;
  address_contains?: InputMaybe<Scalars['String']['input']>;
  address_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  address_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  address_gt?: InputMaybe<Scalars['String']['input']>;
  address_gte?: InputMaybe<Scalars['String']['input']>;
  address_in?: InputMaybe<Array<Scalars['String']['input']>>;
  address_lt?: InputMaybe<Scalars['String']['input']>;
  address_lte?: InputMaybe<Scalars['String']['input']>;
  address_not?: InputMaybe<Scalars['String']['input']>;
  address_not_contains?: InputMaybe<Scalars['String']['input']>;
  address_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  address_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  address_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  address_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  address_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  address_starts_with?: InputMaybe<Scalars['String']['input']>;
  address_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  and?: InputMaybe<Array<InputMaybe<PoolToken_Filter>>>;
  assetManager?: InputMaybe<Scalars['Bytes']['input']>;
  assetManager_contains?: InputMaybe<Scalars['Bytes']['input']>;
  assetManager_gt?: InputMaybe<Scalars['Bytes']['input']>;
  assetManager_gte?: InputMaybe<Scalars['Bytes']['input']>;
  assetManager_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  assetManager_lt?: InputMaybe<Scalars['Bytes']['input']>;
  assetManager_lte?: InputMaybe<Scalars['Bytes']['input']>;
  assetManager_not?: InputMaybe<Scalars['Bytes']['input']>;
  assetManager_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  assetManager_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  balance?: InputMaybe<Scalars['BigDecimal']['input']>;
  balance_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  balance_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  balance_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  balance_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  balance_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  balance_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  balance_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cashBalance?: InputMaybe<Scalars['BigDecimal']['input']>;
  cashBalance_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cashBalance_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cashBalance_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  cashBalance_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  cashBalance_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  cashBalance_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  cashBalance_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  circuitBreaker?: InputMaybe<Scalars['String']['input']>;
  circuitBreaker_?: InputMaybe<CircuitBreaker_Filter>;
  circuitBreaker_contains?: InputMaybe<Scalars['String']['input']>;
  circuitBreaker_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  circuitBreaker_ends_with?: InputMaybe<Scalars['String']['input']>;
  circuitBreaker_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  circuitBreaker_gt?: InputMaybe<Scalars['String']['input']>;
  circuitBreaker_gte?: InputMaybe<Scalars['String']['input']>;
  circuitBreaker_in?: InputMaybe<Array<Scalars['String']['input']>>;
  circuitBreaker_lt?: InputMaybe<Scalars['String']['input']>;
  circuitBreaker_lte?: InputMaybe<Scalars['String']['input']>;
  circuitBreaker_not?: InputMaybe<Scalars['String']['input']>;
  circuitBreaker_not_contains?: InputMaybe<Scalars['String']['input']>;
  circuitBreaker_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  circuitBreaker_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  circuitBreaker_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  circuitBreaker_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  circuitBreaker_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  circuitBreaker_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  circuitBreaker_starts_with?: InputMaybe<Scalars['String']['input']>;
  circuitBreaker_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  decimals?: InputMaybe<Scalars['Int']['input']>;
  decimals_gt?: InputMaybe<Scalars['Int']['input']>;
  decimals_gte?: InputMaybe<Scalars['Int']['input']>;
  decimals_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  decimals_lt?: InputMaybe<Scalars['Int']['input']>;
  decimals_lte?: InputMaybe<Scalars['Int']['input']>;
  decimals_not?: InputMaybe<Scalars['Int']['input']>;
  decimals_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  index?: InputMaybe<Scalars['Int']['input']>;
  index_gt?: InputMaybe<Scalars['Int']['input']>;
  index_gte?: InputMaybe<Scalars['Int']['input']>;
  index_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  index_lt?: InputMaybe<Scalars['Int']['input']>;
  index_lte?: InputMaybe<Scalars['Int']['input']>;
  index_not?: InputMaybe<Scalars['Int']['input']>;
  index_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  isExemptFromYieldProtocolFee?: InputMaybe<Scalars['Boolean']['input']>;
  isExemptFromYieldProtocolFee_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isExemptFromYieldProtocolFee_not?: InputMaybe<Scalars['Boolean']['input']>;
  isExemptFromYieldProtocolFee_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  managedBalance?: InputMaybe<Scalars['BigDecimal']['input']>;
  managedBalance_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  managedBalance_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  managedBalance_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  managedBalance_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  managedBalance_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  managedBalance_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  managedBalance_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  managements_?: InputMaybe<ManagementOperation_Filter>;
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
  oldPriceRate?: InputMaybe<Scalars['BigDecimal']['input']>;
  oldPriceRate_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  oldPriceRate_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  oldPriceRate_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  oldPriceRate_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  oldPriceRate_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  oldPriceRate_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  oldPriceRate_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  or?: InputMaybe<Array<InputMaybe<PoolToken_Filter>>>;
  paidProtocolFees?: InputMaybe<Scalars['BigDecimal']['input']>;
  paidProtocolFees_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  paidProtocolFees_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  paidProtocolFees_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  paidProtocolFees_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  paidProtocolFees_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  paidProtocolFees_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  paidProtocolFees_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  poolId?: InputMaybe<Scalars['String']['input']>;
  poolId_?: InputMaybe<Pool_Filter>;
  poolId_contains?: InputMaybe<Scalars['String']['input']>;
  poolId_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  poolId_ends_with?: InputMaybe<Scalars['String']['input']>;
  poolId_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  poolId_gt?: InputMaybe<Scalars['String']['input']>;
  poolId_gte?: InputMaybe<Scalars['String']['input']>;
  poolId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  poolId_lt?: InputMaybe<Scalars['String']['input']>;
  poolId_lte?: InputMaybe<Scalars['String']['input']>;
  poolId_not?: InputMaybe<Scalars['String']['input']>;
  poolId_not_contains?: InputMaybe<Scalars['String']['input']>;
  poolId_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  poolId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  poolId_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  poolId_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  poolId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  poolId_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  poolId_starts_with?: InputMaybe<Scalars['String']['input']>;
  poolId_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  priceRate?: InputMaybe<Scalars['BigDecimal']['input']>;
  priceRate_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  priceRate_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  priceRate_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  priceRate_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  priceRate_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  priceRate_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  priceRate_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
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
  weight?: InputMaybe<Scalars['BigDecimal']['input']>;
  weight_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  weight_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  weight_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  weight_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  weight_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  weight_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  weight_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
};

export type PoolToken_OrderBy =
  | 'address'
  | 'assetManager'
  | 'balance'
  | 'cashBalance'
  | 'circuitBreaker'
  | 'circuitBreaker__bptPrice'
  | 'circuitBreaker__id'
  | 'circuitBreaker__lowerBoundPercentage'
  | 'circuitBreaker__upperBoundPercentage'
  | 'decimals'
  | 'id'
  | 'index'
  | 'isExemptFromYieldProtocolFee'
  | 'managedBalance'
  | 'managements'
  | 'name'
  | 'oldPriceRate'
  | 'paidProtocolFees'
  | 'poolId'
  | 'poolId__address'
  | 'poolId__alpha'
  | 'poolId__amp'
  | 'poolId__baseToken'
  | 'poolId__beta'
  | 'poolId__c'
  | 'poolId__createTime'
  | 'poolId__dSq'
  | 'poolId__delta'
  | 'poolId__epsilon'
  | 'poolId__expiryTime'
  | 'poolId__factory'
  | 'poolId__holdersCount'
  | 'poolId__id'
  | 'poolId__isInRecoveryMode'
  | 'poolId__isPaused'
  | 'poolId__joinExitEnabled'
  | 'poolId__lambda'
  | 'poolId__lastJoinExitAmp'
  | 'poolId__lastPostJoinExitInvariant'
  | 'poolId__lowerTarget'
  | 'poolId__mainIndex'
  | 'poolId__managementAumFee'
  | 'poolId__managementFee'
  | 'poolId__mustAllowlistLPs'
  | 'poolId__name'
  | 'poolId__oracleEnabled'
  | 'poolId__owner'
  | 'poolId__poolType'
  | 'poolId__poolTypeVersion'
  | 'poolId__principalToken'
  | 'poolId__protocolAumFeeCache'
  | 'poolId__protocolId'
  | 'poolId__protocolSwapFeeCache'
  | 'poolId__protocolYieldFeeCache'
  | 'poolId__root3Alpha'
  | 'poolId__s'
  | 'poolId__sqrtAlpha'
  | 'poolId__sqrtBeta'
  | 'poolId__strategyType'
  | 'poolId__swapEnabled'
  | 'poolId__swapEnabledCurationSignal'
  | 'poolId__swapEnabledInternal'
  | 'poolId__swapFee'
  | 'poolId__swapsCount'
  | 'poolId__symbol'
  | 'poolId__tauAlphaX'
  | 'poolId__tauAlphaY'
  | 'poolId__tauBetaX'
  | 'poolId__tauBetaY'
  | 'poolId__totalAumFeeCollectedInBPT'
  | 'poolId__totalLiquidity'
  | 'poolId__totalLiquiditySansBPT'
  | 'poolId__totalProtocolFee'
  | 'poolId__totalProtocolFeePaidInBPT'
  | 'poolId__totalShares'
  | 'poolId__totalSwapFee'
  | 'poolId__totalSwapVolume'
  | 'poolId__totalWeight'
  | 'poolId__tx'
  | 'poolId__u'
  | 'poolId__unitSeconds'
  | 'poolId__upperTarget'
  | 'poolId__v'
  | 'poolId__w'
  | 'poolId__wrappedIndex'
  | 'poolId__z'
  | 'priceRate'
  | 'symbol'
  | 'token'
  | 'token__address'
  | 'token__decimals'
  | 'token__fxOracleDecimals'
  | 'token__id'
  | 'token__latestFXPrice'
  | 'token__latestUSDPrice'
  | 'token__latestUSDPriceTimestamp'
  | 'token__name'
  | 'token__symbol'
  | 'token__totalBalanceNotional'
  | 'token__totalBalanceUSD'
  | 'token__totalSwapCount'
  | 'token__totalVolumeNotional'
  | 'token__totalVolumeUSD'
  | 'weight'
  | '%future added value';

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
  alpha?: InputMaybe<Scalars['BigDecimal']['input']>;
  alpha_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  alpha_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  alpha_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  alpha_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  alpha_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  alpha_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  alpha_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amp?: InputMaybe<Scalars['BigInt']['input']>;
  ampUpdates_?: InputMaybe<AmpUpdate_Filter>;
  amp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amp_not?: InputMaybe<Scalars['BigInt']['input']>;
  amp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  and?: InputMaybe<Array<InputMaybe<Pool_Filter>>>;
  baseToken?: InputMaybe<Scalars['Bytes']['input']>;
  baseToken_contains?: InputMaybe<Scalars['Bytes']['input']>;
  baseToken_gt?: InputMaybe<Scalars['Bytes']['input']>;
  baseToken_gte?: InputMaybe<Scalars['Bytes']['input']>;
  baseToken_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  baseToken_lt?: InputMaybe<Scalars['Bytes']['input']>;
  baseToken_lte?: InputMaybe<Scalars['Bytes']['input']>;
  baseToken_not?: InputMaybe<Scalars['Bytes']['input']>;
  baseToken_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  baseToken_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  beta?: InputMaybe<Scalars['BigDecimal']['input']>;
  beta_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  beta_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  beta_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  beta_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  beta_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  beta_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  beta_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  c?: InputMaybe<Scalars['BigDecimal']['input']>;
  c_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  c_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  c_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  c_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  c_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  c_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  c_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  circuitBreakers_?: InputMaybe<CircuitBreaker_Filter>;
  createTime?: InputMaybe<Scalars['Int']['input']>;
  createTime_gt?: InputMaybe<Scalars['Int']['input']>;
  createTime_gte?: InputMaybe<Scalars['Int']['input']>;
  createTime_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  createTime_lt?: InputMaybe<Scalars['Int']['input']>;
  createTime_lte?: InputMaybe<Scalars['Int']['input']>;
  createTime_not?: InputMaybe<Scalars['Int']['input']>;
  createTime_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  dSq?: InputMaybe<Scalars['BigDecimal']['input']>;
  dSq_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  dSq_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  dSq_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  dSq_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  dSq_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  dSq_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  dSq_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  delta?: InputMaybe<Scalars['BigDecimal']['input']>;
  delta_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  delta_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  delta_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  delta_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  delta_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  delta_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  delta_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  epsilon?: InputMaybe<Scalars['BigDecimal']['input']>;
  epsilon_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  epsilon_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  epsilon_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  epsilon_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  epsilon_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  epsilon_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  epsilon_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  expiryTime?: InputMaybe<Scalars['BigInt']['input']>;
  expiryTime_gt?: InputMaybe<Scalars['BigInt']['input']>;
  expiryTime_gte?: InputMaybe<Scalars['BigInt']['input']>;
  expiryTime_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  expiryTime_lt?: InputMaybe<Scalars['BigInt']['input']>;
  expiryTime_lte?: InputMaybe<Scalars['BigInt']['input']>;
  expiryTime_not?: InputMaybe<Scalars['BigInt']['input']>;
  expiryTime_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  factory?: InputMaybe<Scalars['Bytes']['input']>;
  factory_contains?: InputMaybe<Scalars['Bytes']['input']>;
  factory_gt?: InputMaybe<Scalars['Bytes']['input']>;
  factory_gte?: InputMaybe<Scalars['Bytes']['input']>;
  factory_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  factory_lt?: InputMaybe<Scalars['Bytes']['input']>;
  factory_lte?: InputMaybe<Scalars['Bytes']['input']>;
  factory_not?: InputMaybe<Scalars['Bytes']['input']>;
  factory_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  factory_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  historicalValues_?: InputMaybe<PoolHistoricalLiquidity_Filter>;
  holdersCount?: InputMaybe<Scalars['BigInt']['input']>;
  holdersCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  holdersCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  holdersCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  holdersCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  holdersCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  holdersCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  holdersCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  isInRecoveryMode?: InputMaybe<Scalars['Boolean']['input']>;
  isInRecoveryMode_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isInRecoveryMode_not?: InputMaybe<Scalars['Boolean']['input']>;
  isInRecoveryMode_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isPaused?: InputMaybe<Scalars['Boolean']['input']>;
  isPaused_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isPaused_not?: InputMaybe<Scalars['Boolean']['input']>;
  isPaused_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  joinExitEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  joinExitEnabled_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  joinExitEnabled_not?: InputMaybe<Scalars['Boolean']['input']>;
  joinExitEnabled_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  joinsExits_?: InputMaybe<JoinExit_Filter>;
  lambda?: InputMaybe<Scalars['BigDecimal']['input']>;
  lambda_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  lambda_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  lambda_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  lambda_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  lambda_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  lambda_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  lambda_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  lastJoinExitAmp?: InputMaybe<Scalars['BigInt']['input']>;
  lastJoinExitAmp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  lastJoinExitAmp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  lastJoinExitAmp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastJoinExitAmp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  lastJoinExitAmp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  lastJoinExitAmp_not?: InputMaybe<Scalars['BigInt']['input']>;
  lastJoinExitAmp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  lastPostJoinExitInvariant?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPostJoinExitInvariant_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPostJoinExitInvariant_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPostJoinExitInvariant_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  lastPostJoinExitInvariant_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPostJoinExitInvariant_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPostJoinExitInvariant_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  lastPostJoinExitInvariant_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  latestAmpUpdate?: InputMaybe<Scalars['String']['input']>;
  latestAmpUpdate_?: InputMaybe<AmpUpdate_Filter>;
  latestAmpUpdate_contains?: InputMaybe<Scalars['String']['input']>;
  latestAmpUpdate_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  latestAmpUpdate_ends_with?: InputMaybe<Scalars['String']['input']>;
  latestAmpUpdate_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  latestAmpUpdate_gt?: InputMaybe<Scalars['String']['input']>;
  latestAmpUpdate_gte?: InputMaybe<Scalars['String']['input']>;
  latestAmpUpdate_in?: InputMaybe<Array<Scalars['String']['input']>>;
  latestAmpUpdate_lt?: InputMaybe<Scalars['String']['input']>;
  latestAmpUpdate_lte?: InputMaybe<Scalars['String']['input']>;
  latestAmpUpdate_not?: InputMaybe<Scalars['String']['input']>;
  latestAmpUpdate_not_contains?: InputMaybe<Scalars['String']['input']>;
  latestAmpUpdate_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  latestAmpUpdate_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  latestAmpUpdate_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  latestAmpUpdate_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  latestAmpUpdate_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  latestAmpUpdate_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  latestAmpUpdate_starts_with?: InputMaybe<Scalars['String']['input']>;
  latestAmpUpdate_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  lowerTarget?: InputMaybe<Scalars['BigDecimal']['input']>;
  lowerTarget_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  lowerTarget_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  lowerTarget_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  lowerTarget_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  lowerTarget_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  lowerTarget_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  lowerTarget_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  mainIndex?: InputMaybe<Scalars['Int']['input']>;
  mainIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  mainIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  mainIndex_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  mainIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  mainIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  mainIndex_not?: InputMaybe<Scalars['Int']['input']>;
  mainIndex_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  managementAumFee?: InputMaybe<Scalars['BigDecimal']['input']>;
  managementAumFee_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  managementAumFee_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  managementAumFee_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  managementAumFee_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  managementAumFee_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  managementAumFee_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  managementAumFee_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  managementFee?: InputMaybe<Scalars['BigDecimal']['input']>;
  managementFee_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  managementFee_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  managementFee_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  managementFee_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  managementFee_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  managementFee_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  managementFee_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  mustAllowlistLPs?: InputMaybe<Scalars['Boolean']['input']>;
  mustAllowlistLPs_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  mustAllowlistLPs_not?: InputMaybe<Scalars['Boolean']['input']>;
  mustAllowlistLPs_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
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
  or?: InputMaybe<Array<InputMaybe<Pool_Filter>>>;
  oracleEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  oracleEnabled_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  oracleEnabled_not?: InputMaybe<Scalars['Boolean']['input']>;
  oracleEnabled_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  owner?: InputMaybe<Scalars['Bytes']['input']>;
  owner_contains?: InputMaybe<Scalars['Bytes']['input']>;
  owner_gt?: InputMaybe<Scalars['Bytes']['input']>;
  owner_gte?: InputMaybe<Scalars['Bytes']['input']>;
  owner_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  owner_lt?: InputMaybe<Scalars['Bytes']['input']>;
  owner_lte?: InputMaybe<Scalars['Bytes']['input']>;
  owner_not?: InputMaybe<Scalars['Bytes']['input']>;
  owner_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  owner_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  poolType?: InputMaybe<Scalars['String']['input']>;
  poolTypeVersion?: InputMaybe<Scalars['Int']['input']>;
  poolTypeVersion_gt?: InputMaybe<Scalars['Int']['input']>;
  poolTypeVersion_gte?: InputMaybe<Scalars['Int']['input']>;
  poolTypeVersion_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  poolTypeVersion_lt?: InputMaybe<Scalars['Int']['input']>;
  poolTypeVersion_lte?: InputMaybe<Scalars['Int']['input']>;
  poolTypeVersion_not?: InputMaybe<Scalars['Int']['input']>;
  poolTypeVersion_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  poolType_contains?: InputMaybe<Scalars['String']['input']>;
  poolType_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  poolType_ends_with?: InputMaybe<Scalars['String']['input']>;
  poolType_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  poolType_gt?: InputMaybe<Scalars['String']['input']>;
  poolType_gte?: InputMaybe<Scalars['String']['input']>;
  poolType_in?: InputMaybe<Array<Scalars['String']['input']>>;
  poolType_lt?: InputMaybe<Scalars['String']['input']>;
  poolType_lte?: InputMaybe<Scalars['String']['input']>;
  poolType_not?: InputMaybe<Scalars['String']['input']>;
  poolType_not_contains?: InputMaybe<Scalars['String']['input']>;
  poolType_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  poolType_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  poolType_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  poolType_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  poolType_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  poolType_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  poolType_starts_with?: InputMaybe<Scalars['String']['input']>;
  poolType_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  priceRateProviders_?: InputMaybe<PriceRateProvider_Filter>;
  principalToken?: InputMaybe<Scalars['Bytes']['input']>;
  principalToken_contains?: InputMaybe<Scalars['Bytes']['input']>;
  principalToken_gt?: InputMaybe<Scalars['Bytes']['input']>;
  principalToken_gte?: InputMaybe<Scalars['Bytes']['input']>;
  principalToken_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  principalToken_lt?: InputMaybe<Scalars['Bytes']['input']>;
  principalToken_lte?: InputMaybe<Scalars['Bytes']['input']>;
  principalToken_not?: InputMaybe<Scalars['Bytes']['input']>;
  principalToken_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  principalToken_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  protocolAumFeeCache?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolAumFeeCache_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolAumFeeCache_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolAumFeeCache_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  protocolAumFeeCache_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolAumFeeCache_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolAumFeeCache_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolAumFeeCache_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  protocolId?: InputMaybe<Scalars['Int']['input']>;
  protocolIdData?: InputMaybe<Scalars['String']['input']>;
  protocolIdData_?: InputMaybe<ProtocolIdData_Filter>;
  protocolIdData_contains?: InputMaybe<Scalars['String']['input']>;
  protocolIdData_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocolIdData_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocolIdData_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocolIdData_gt?: InputMaybe<Scalars['String']['input']>;
  protocolIdData_gte?: InputMaybe<Scalars['String']['input']>;
  protocolIdData_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocolIdData_lt?: InputMaybe<Scalars['String']['input']>;
  protocolIdData_lte?: InputMaybe<Scalars['String']['input']>;
  protocolIdData_not?: InputMaybe<Scalars['String']['input']>;
  protocolIdData_not_contains?: InputMaybe<Scalars['String']['input']>;
  protocolIdData_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  protocolIdData_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  protocolIdData_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocolIdData_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  protocolIdData_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocolIdData_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocolIdData_starts_with?: InputMaybe<Scalars['String']['input']>;
  protocolIdData_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  protocolId_gt?: InputMaybe<Scalars['Int']['input']>;
  protocolId_gte?: InputMaybe<Scalars['Int']['input']>;
  protocolId_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  protocolId_lt?: InputMaybe<Scalars['Int']['input']>;
  protocolId_lte?: InputMaybe<Scalars['Int']['input']>;
  protocolId_not?: InputMaybe<Scalars['Int']['input']>;
  protocolId_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  protocolSwapFeeCache?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolSwapFeeCache_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolSwapFeeCache_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolSwapFeeCache_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  protocolSwapFeeCache_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolSwapFeeCache_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolSwapFeeCache_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolSwapFeeCache_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  protocolYieldFeeCache?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolYieldFeeCache_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolYieldFeeCache_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolYieldFeeCache_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  protocolYieldFeeCache_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolYieldFeeCache_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolYieldFeeCache_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  protocolYieldFeeCache_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  root3Alpha?: InputMaybe<Scalars['BigDecimal']['input']>;
  root3Alpha_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  root3Alpha_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  root3Alpha_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  root3Alpha_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  root3Alpha_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  root3Alpha_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  root3Alpha_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  s?: InputMaybe<Scalars['BigDecimal']['input']>;
  s_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  s_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  s_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  s_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  s_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  s_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  s_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  shares_?: InputMaybe<PoolShare_Filter>;
  snapshots_?: InputMaybe<PoolSnapshot_Filter>;
  sqrtAlpha?: InputMaybe<Scalars['BigDecimal']['input']>;
  sqrtAlpha_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  sqrtAlpha_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  sqrtAlpha_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  sqrtAlpha_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  sqrtAlpha_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  sqrtAlpha_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  sqrtAlpha_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  sqrtBeta?: InputMaybe<Scalars['BigDecimal']['input']>;
  sqrtBeta_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  sqrtBeta_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  sqrtBeta_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  sqrtBeta_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  sqrtBeta_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  sqrtBeta_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  sqrtBeta_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  strategyType?: InputMaybe<Scalars['Int']['input']>;
  strategyType_gt?: InputMaybe<Scalars['Int']['input']>;
  strategyType_gte?: InputMaybe<Scalars['Int']['input']>;
  strategyType_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  strategyType_lt?: InputMaybe<Scalars['Int']['input']>;
  strategyType_lte?: InputMaybe<Scalars['Int']['input']>;
  strategyType_not?: InputMaybe<Scalars['Int']['input']>;
  strategyType_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  swapEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  swapEnabledCurationSignal?: InputMaybe<Scalars['Boolean']['input']>;
  swapEnabledCurationSignal_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  swapEnabledCurationSignal_not?: InputMaybe<Scalars['Boolean']['input']>;
  swapEnabledCurationSignal_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  swapEnabledInternal?: InputMaybe<Scalars['Boolean']['input']>;
  swapEnabledInternal_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  swapEnabledInternal_not?: InputMaybe<Scalars['Boolean']['input']>;
  swapEnabledInternal_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  swapEnabled_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  swapEnabled_not?: InputMaybe<Scalars['Boolean']['input']>;
  swapEnabled_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  swapFee?: InputMaybe<Scalars['BigDecimal']['input']>;
  swapFee_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  swapFee_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  swapFee_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  swapFee_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  swapFee_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  swapFee_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  swapFee_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  swapsCount?: InputMaybe<Scalars['BigInt']['input']>;
  swapsCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  swapsCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  swapsCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  swapsCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  swapsCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  swapsCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  swapsCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  swaps_?: InputMaybe<Swap_Filter>;
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
  tauAlphaX?: InputMaybe<Scalars['BigDecimal']['input']>;
  tauAlphaX_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  tauAlphaX_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  tauAlphaX_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  tauAlphaX_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  tauAlphaX_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  tauAlphaX_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  tauAlphaX_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  tauAlphaY?: InputMaybe<Scalars['BigDecimal']['input']>;
  tauAlphaY_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  tauAlphaY_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  tauAlphaY_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  tauAlphaY_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  tauAlphaY_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  tauAlphaY_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  tauAlphaY_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  tauBetaX?: InputMaybe<Scalars['BigDecimal']['input']>;
  tauBetaX_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  tauBetaX_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  tauBetaX_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  tauBetaX_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  tauBetaX_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  tauBetaX_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  tauBetaX_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  tauBetaY?: InputMaybe<Scalars['BigDecimal']['input']>;
  tauBetaY_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  tauBetaY_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  tauBetaY_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  tauBetaY_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  tauBetaY_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  tauBetaY_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  tauBetaY_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  tokensList?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  tokensList_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  tokensList_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  tokensList_not?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  tokensList_not_contains?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  tokensList_not_contains_nocase?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  tokens_?: InputMaybe<PoolToken_Filter>;
  totalAumFeeCollectedInBPT?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalAumFeeCollectedInBPT_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalAumFeeCollectedInBPT_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalAumFeeCollectedInBPT_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalAumFeeCollectedInBPT_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalAumFeeCollectedInBPT_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalAumFeeCollectedInBPT_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalAumFeeCollectedInBPT_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalLiquidity?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquiditySansBPT?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquiditySansBPT_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquiditySansBPT_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquiditySansBPT_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalLiquiditySansBPT_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquiditySansBPT_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquiditySansBPT_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquiditySansBPT_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalLiquidity_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidity_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidity_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalLiquidity_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidity_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidity_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalLiquidity_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalProtocolFee?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalProtocolFeePaidInBPT?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalProtocolFeePaidInBPT_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalProtocolFeePaidInBPT_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalProtocolFeePaidInBPT_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalProtocolFeePaidInBPT_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalProtocolFeePaidInBPT_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalProtocolFeePaidInBPT_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalProtocolFeePaidInBPT_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalProtocolFee_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalProtocolFee_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalProtocolFee_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalProtocolFee_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalProtocolFee_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalProtocolFee_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalProtocolFee_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalShares?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalShares_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalShares_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalShares_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalShares_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalShares_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalShares_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalShares_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalSwapFee?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapFee_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapFee_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapFee_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalSwapFee_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapFee_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapFee_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapFee_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalSwapVolume?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapVolume_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapVolume_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapVolume_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalSwapVolume_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapVolume_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapVolume_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalWeight?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalWeight_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalWeight_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalWeight_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalWeight_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalWeight_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalWeight_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalWeight_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  tx?: InputMaybe<Scalars['Bytes']['input']>;
  tx_contains?: InputMaybe<Scalars['Bytes']['input']>;
  tx_gt?: InputMaybe<Scalars['Bytes']['input']>;
  tx_gte?: InputMaybe<Scalars['Bytes']['input']>;
  tx_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  tx_lt?: InputMaybe<Scalars['Bytes']['input']>;
  tx_lte?: InputMaybe<Scalars['Bytes']['input']>;
  tx_not?: InputMaybe<Scalars['Bytes']['input']>;
  tx_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  tx_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  u?: InputMaybe<Scalars['BigDecimal']['input']>;
  u_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  u_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  u_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  u_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  u_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  u_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  u_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  unitSeconds?: InputMaybe<Scalars['BigInt']['input']>;
  unitSeconds_gt?: InputMaybe<Scalars['BigInt']['input']>;
  unitSeconds_gte?: InputMaybe<Scalars['BigInt']['input']>;
  unitSeconds_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  unitSeconds_lt?: InputMaybe<Scalars['BigInt']['input']>;
  unitSeconds_lte?: InputMaybe<Scalars['BigInt']['input']>;
  unitSeconds_not?: InputMaybe<Scalars['BigInt']['input']>;
  unitSeconds_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  upperTarget?: InputMaybe<Scalars['BigDecimal']['input']>;
  upperTarget_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  upperTarget_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  upperTarget_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  upperTarget_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  upperTarget_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  upperTarget_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  upperTarget_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  v?: InputMaybe<Scalars['BigDecimal']['input']>;
  v_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  v_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  v_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  v_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  v_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  v_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  v_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  vaultID?: InputMaybe<Scalars['String']['input']>;
  vaultID_?: InputMaybe<Balancer_Filter>;
  vaultID_contains?: InputMaybe<Scalars['String']['input']>;
  vaultID_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vaultID_ends_with?: InputMaybe<Scalars['String']['input']>;
  vaultID_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vaultID_gt?: InputMaybe<Scalars['String']['input']>;
  vaultID_gte?: InputMaybe<Scalars['String']['input']>;
  vaultID_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vaultID_lt?: InputMaybe<Scalars['String']['input']>;
  vaultID_lte?: InputMaybe<Scalars['String']['input']>;
  vaultID_not?: InputMaybe<Scalars['String']['input']>;
  vaultID_not_contains?: InputMaybe<Scalars['String']['input']>;
  vaultID_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  vaultID_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  vaultID_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vaultID_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  vaultID_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  vaultID_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  vaultID_starts_with?: InputMaybe<Scalars['String']['input']>;
  vaultID_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  w?: InputMaybe<Scalars['BigDecimal']['input']>;
  w_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  w_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  w_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  w_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  w_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  w_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  w_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  weightUpdates_?: InputMaybe<GradualWeightUpdate_Filter>;
  wrappedIndex?: InputMaybe<Scalars['Int']['input']>;
  wrappedIndex_gt?: InputMaybe<Scalars['Int']['input']>;
  wrappedIndex_gte?: InputMaybe<Scalars['Int']['input']>;
  wrappedIndex_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  wrappedIndex_lt?: InputMaybe<Scalars['Int']['input']>;
  wrappedIndex_lte?: InputMaybe<Scalars['Int']['input']>;
  wrappedIndex_not?: InputMaybe<Scalars['Int']['input']>;
  wrappedIndex_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  z?: InputMaybe<Scalars['BigDecimal']['input']>;
  z_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  z_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  z_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  z_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  z_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  z_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  z_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
};

export type Pool_OrderBy =
  | 'address'
  | 'alpha'
  | 'amp'
  | 'ampUpdates'
  | 'baseToken'
  | 'beta'
  | 'c'
  | 'circuitBreakers'
  | 'createTime'
  | 'dSq'
  | 'delta'
  | 'epsilon'
  | 'expiryTime'
  | 'factory'
  | 'historicalValues'
  | 'holdersCount'
  | 'id'
  | 'isInRecoveryMode'
  | 'isPaused'
  | 'joinExitEnabled'
  | 'joinsExits'
  | 'lambda'
  | 'lastJoinExitAmp'
  | 'lastPostJoinExitInvariant'
  | 'latestAmpUpdate'
  | 'latestAmpUpdate__endAmp'
  | 'latestAmpUpdate__endTimestamp'
  | 'latestAmpUpdate__id'
  | 'latestAmpUpdate__scheduledTimestamp'
  | 'latestAmpUpdate__startAmp'
  | 'latestAmpUpdate__startTimestamp'
  | 'lowerTarget'
  | 'mainIndex'
  | 'managementAumFee'
  | 'managementFee'
  | 'mustAllowlistLPs'
  | 'name'
  | 'oracleEnabled'
  | 'owner'
  | 'poolType'
  | 'poolTypeVersion'
  | 'priceRateProviders'
  | 'principalToken'
  | 'protocolAumFeeCache'
  | 'protocolId'
  | 'protocolIdData'
  | 'protocolIdData__id'
  | 'protocolIdData__name'
  | 'protocolSwapFeeCache'
  | 'protocolYieldFeeCache'
  | 'root3Alpha'
  | 's'
  | 'shares'
  | 'snapshots'
  | 'sqrtAlpha'
  | 'sqrtBeta'
  | 'strategyType'
  | 'swapEnabled'
  | 'swapEnabledCurationSignal'
  | 'swapEnabledInternal'
  | 'swapFee'
  | 'swaps'
  | 'swapsCount'
  | 'symbol'
  | 'tauAlphaX'
  | 'tauAlphaY'
  | 'tauBetaX'
  | 'tauBetaY'
  | 'tokens'
  | 'tokensList'
  | 'totalAumFeeCollectedInBPT'
  | 'totalLiquidity'
  | 'totalLiquiditySansBPT'
  | 'totalProtocolFee'
  | 'totalProtocolFeePaidInBPT'
  | 'totalShares'
  | 'totalSwapFee'
  | 'totalSwapVolume'
  | 'totalWeight'
  | 'tx'
  | 'u'
  | 'unitSeconds'
  | 'upperTarget'
  | 'v'
  | 'vaultID'
  | 'vaultID__id'
  | 'vaultID__poolCount'
  | 'vaultID__protocolFeesCollector'
  | 'vaultID__totalLiquidity'
  | 'vaultID__totalProtocolFee'
  | 'vaultID__totalSwapCount'
  | 'vaultID__totalSwapFee'
  | 'vaultID__totalSwapVolume'
  | 'w'
  | 'weightUpdates'
  | 'wrappedIndex'
  | 'z'
  | '%future added value';

export type PriceRateProvider = {
  __typename?: 'PriceRateProvider';
  address: Scalars['Bytes']['output'];
  cacheDuration?: Maybe<Scalars['Int']['output']>;
  cacheExpiry?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  lastCached?: Maybe<Scalars['Int']['output']>;
  poolId: Pool;
  rate?: Maybe<Scalars['BigDecimal']['output']>;
  token: PoolToken;
};

export type PriceRateProvider_Filter = {
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
  and?: InputMaybe<Array<InputMaybe<PriceRateProvider_Filter>>>;
  cacheDuration?: InputMaybe<Scalars['Int']['input']>;
  cacheDuration_gt?: InputMaybe<Scalars['Int']['input']>;
  cacheDuration_gte?: InputMaybe<Scalars['Int']['input']>;
  cacheDuration_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  cacheDuration_lt?: InputMaybe<Scalars['Int']['input']>;
  cacheDuration_lte?: InputMaybe<Scalars['Int']['input']>;
  cacheDuration_not?: InputMaybe<Scalars['Int']['input']>;
  cacheDuration_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  cacheExpiry?: InputMaybe<Scalars['Int']['input']>;
  cacheExpiry_gt?: InputMaybe<Scalars['Int']['input']>;
  cacheExpiry_gte?: InputMaybe<Scalars['Int']['input']>;
  cacheExpiry_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  cacheExpiry_lt?: InputMaybe<Scalars['Int']['input']>;
  cacheExpiry_lte?: InputMaybe<Scalars['Int']['input']>;
  cacheExpiry_not?: InputMaybe<Scalars['Int']['input']>;
  cacheExpiry_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  lastCached?: InputMaybe<Scalars['Int']['input']>;
  lastCached_gt?: InputMaybe<Scalars['Int']['input']>;
  lastCached_gte?: InputMaybe<Scalars['Int']['input']>;
  lastCached_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lastCached_lt?: InputMaybe<Scalars['Int']['input']>;
  lastCached_lte?: InputMaybe<Scalars['Int']['input']>;
  lastCached_not?: InputMaybe<Scalars['Int']['input']>;
  lastCached_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  or?: InputMaybe<Array<InputMaybe<PriceRateProvider_Filter>>>;
  poolId?: InputMaybe<Scalars['String']['input']>;
  poolId_?: InputMaybe<Pool_Filter>;
  poolId_contains?: InputMaybe<Scalars['String']['input']>;
  poolId_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  poolId_ends_with?: InputMaybe<Scalars['String']['input']>;
  poolId_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  poolId_gt?: InputMaybe<Scalars['String']['input']>;
  poolId_gte?: InputMaybe<Scalars['String']['input']>;
  poolId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  poolId_lt?: InputMaybe<Scalars['String']['input']>;
  poolId_lte?: InputMaybe<Scalars['String']['input']>;
  poolId_not?: InputMaybe<Scalars['String']['input']>;
  poolId_not_contains?: InputMaybe<Scalars['String']['input']>;
  poolId_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  poolId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  poolId_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  poolId_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  poolId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  poolId_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  poolId_starts_with?: InputMaybe<Scalars['String']['input']>;
  poolId_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  rate?: InputMaybe<Scalars['BigDecimal']['input']>;
  rate_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rate_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rate_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  rate_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  rate_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  rate_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  rate_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  token?: InputMaybe<Scalars['String']['input']>;
  token_?: InputMaybe<PoolToken_Filter>;
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
};

export type PriceRateProvider_OrderBy =
  | 'address'
  | 'cacheDuration'
  | 'cacheExpiry'
  | 'id'
  | 'lastCached'
  | 'poolId'
  | 'poolId__address'
  | 'poolId__alpha'
  | 'poolId__amp'
  | 'poolId__baseToken'
  | 'poolId__beta'
  | 'poolId__c'
  | 'poolId__createTime'
  | 'poolId__dSq'
  | 'poolId__delta'
  | 'poolId__epsilon'
  | 'poolId__expiryTime'
  | 'poolId__factory'
  | 'poolId__holdersCount'
  | 'poolId__id'
  | 'poolId__isInRecoveryMode'
  | 'poolId__isPaused'
  | 'poolId__joinExitEnabled'
  | 'poolId__lambda'
  | 'poolId__lastJoinExitAmp'
  | 'poolId__lastPostJoinExitInvariant'
  | 'poolId__lowerTarget'
  | 'poolId__mainIndex'
  | 'poolId__managementAumFee'
  | 'poolId__managementFee'
  | 'poolId__mustAllowlistLPs'
  | 'poolId__name'
  | 'poolId__oracleEnabled'
  | 'poolId__owner'
  | 'poolId__poolType'
  | 'poolId__poolTypeVersion'
  | 'poolId__principalToken'
  | 'poolId__protocolAumFeeCache'
  | 'poolId__protocolId'
  | 'poolId__protocolSwapFeeCache'
  | 'poolId__protocolYieldFeeCache'
  | 'poolId__root3Alpha'
  | 'poolId__s'
  | 'poolId__sqrtAlpha'
  | 'poolId__sqrtBeta'
  | 'poolId__strategyType'
  | 'poolId__swapEnabled'
  | 'poolId__swapEnabledCurationSignal'
  | 'poolId__swapEnabledInternal'
  | 'poolId__swapFee'
  | 'poolId__swapsCount'
  | 'poolId__symbol'
  | 'poolId__tauAlphaX'
  | 'poolId__tauAlphaY'
  | 'poolId__tauBetaX'
  | 'poolId__tauBetaY'
  | 'poolId__totalAumFeeCollectedInBPT'
  | 'poolId__totalLiquidity'
  | 'poolId__totalLiquiditySansBPT'
  | 'poolId__totalProtocolFee'
  | 'poolId__totalProtocolFeePaidInBPT'
  | 'poolId__totalShares'
  | 'poolId__totalSwapFee'
  | 'poolId__totalSwapVolume'
  | 'poolId__totalWeight'
  | 'poolId__tx'
  | 'poolId__u'
  | 'poolId__unitSeconds'
  | 'poolId__upperTarget'
  | 'poolId__v'
  | 'poolId__w'
  | 'poolId__wrappedIndex'
  | 'poolId__z'
  | 'rate'
  | 'token'
  | 'token__address'
  | 'token__assetManager'
  | 'token__balance'
  | 'token__cashBalance'
  | 'token__decimals'
  | 'token__id'
  | 'token__index'
  | 'token__isExemptFromYieldProtocolFee'
  | 'token__managedBalance'
  | 'token__name'
  | 'token__oldPriceRate'
  | 'token__paidProtocolFees'
  | 'token__priceRate'
  | 'token__symbol'
  | 'token__weight'
  | '%future added value';

export type ProtocolIdData = {
  __typename?: 'ProtocolIdData';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type ProtocolIdData_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ProtocolIdData_Filter>>>;
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
  or?: InputMaybe<Array<InputMaybe<ProtocolIdData_Filter>>>;
};

export type ProtocolIdData_OrderBy =
  | 'id'
  | 'name'
  | '%future added value';

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  ampUpdate?: Maybe<AmpUpdate>;
  ampUpdates: Array<AmpUpdate>;
  balancer?: Maybe<Balancer>;
  balancerSnapshot?: Maybe<BalancerSnapshot>;
  balancerSnapshots: Array<BalancerSnapshot>;
  balancers: Array<Balancer>;
  circuitBreaker?: Maybe<CircuitBreaker>;
  circuitBreakers: Array<CircuitBreaker>;
  fxoracle?: Maybe<FxOracle>;
  fxoracles: Array<FxOracle>;
  gradualWeightUpdate?: Maybe<GradualWeightUpdate>;
  gradualWeightUpdates: Array<GradualWeightUpdate>;
  joinExit?: Maybe<JoinExit>;
  joinExits: Array<JoinExit>;
  latestPrice?: Maybe<LatestPrice>;
  latestPrices: Array<LatestPrice>;
  managementOperation?: Maybe<ManagementOperation>;
  managementOperations: Array<ManagementOperation>;
  pool?: Maybe<Pool>;
  poolContract?: Maybe<PoolContract>;
  poolContracts: Array<PoolContract>;
  poolHistoricalLiquidities: Array<PoolHistoricalLiquidity>;
  poolHistoricalLiquidity?: Maybe<PoolHistoricalLiquidity>;
  poolShare?: Maybe<PoolShare>;
  poolShares: Array<PoolShare>;
  poolSnapshot?: Maybe<PoolSnapshot>;
  poolSnapshots: Array<PoolSnapshot>;
  poolToken?: Maybe<PoolToken>;
  poolTokens: Array<PoolToken>;
  pools: Array<Pool>;
  priceRateProvider?: Maybe<PriceRateProvider>;
  priceRateProviders: Array<PriceRateProvider>;
  protocolIdData?: Maybe<ProtocolIdData>;
  protocolIdDatas: Array<ProtocolIdData>;
  swap?: Maybe<Swap>;
  swapFeeUpdate?: Maybe<SwapFeeUpdate>;
  swapFeeUpdates: Array<SwapFeeUpdate>;
  swaps: Array<Swap>;
  token?: Maybe<Token>;
  tokenPrice?: Maybe<TokenPrice>;
  tokenPrices: Array<TokenPrice>;
  tokenSnapshot?: Maybe<TokenSnapshot>;
  tokenSnapshots: Array<TokenSnapshot>;
  tokens: Array<Token>;
  tradePair?: Maybe<TradePair>;
  tradePairSnapshot?: Maybe<TradePairSnapshot>;
  tradePairSnapshots: Array<TradePairSnapshot>;
  tradePairs: Array<TradePair>;
  user?: Maybe<User>;
  userInternalBalance?: Maybe<UserInternalBalance>;
  userInternalBalances: Array<UserInternalBalance>;
  users: Array<User>;
};


export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type QueryAmpUpdateArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryAmpUpdatesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AmpUpdate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AmpUpdate_Filter>;
};


export type QueryBalancerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryBalancerSnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryBalancerSnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<BalancerSnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<BalancerSnapshot_Filter>;
};


export type QueryBalancersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Balancer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Balancer_Filter>;
};


export type QueryCircuitBreakerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryCircuitBreakersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<CircuitBreaker_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CircuitBreaker_Filter>;
};


export type QueryFxoracleArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryFxoraclesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FxOracle_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FxOracle_Filter>;
};


export type QueryGradualWeightUpdateArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryGradualWeightUpdatesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GradualWeightUpdate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<GradualWeightUpdate_Filter>;
};


export type QueryJoinExitArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryJoinExitsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<JoinExit_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<JoinExit_Filter>;
};


export type QueryLatestPriceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryLatestPricesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<LatestPrice_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LatestPrice_Filter>;
};


export type QueryManagementOperationArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryManagementOperationsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ManagementOperation_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ManagementOperation_Filter>;
};


export type QueryPoolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPoolContractArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPoolContractsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolContract_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PoolContract_Filter>;
};


export type QueryPoolHistoricalLiquiditiesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolHistoricalLiquidity_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PoolHistoricalLiquidity_Filter>;
};


export type QueryPoolHistoricalLiquidityArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPoolShareArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPoolSharesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolShare_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PoolShare_Filter>;
};


export type QueryPoolSnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPoolSnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolSnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PoolSnapshot_Filter>;
};


export type QueryPoolTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPoolTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PoolToken_Filter>;
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


export type QueryPriceRateProviderArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPriceRateProvidersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PriceRateProvider_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PriceRateProvider_Filter>;
};


export type QueryProtocolIdDataArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryProtocolIdDatasArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProtocolIdData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProtocolIdData_Filter>;
};


export type QuerySwapArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerySwapFeeUpdateArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerySwapFeeUpdatesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SwapFeeUpdate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SwapFeeUpdate_Filter>;
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


export type QueryTokenPriceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTokenPricesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokenPrice_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenPrice_Filter>;
};


export type QueryTokenSnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTokenSnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokenSnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenSnapshot_Filter>;
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


export type QueryTradePairArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTradePairSnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTradePairSnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TradePairSnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TradePairSnapshot_Filter>;
};


export type QueryTradePairsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TradePair_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TradePair_Filter>;
};


export type QueryUserArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryUserInternalBalanceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryUserInternalBalancesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UserInternalBalance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UserInternalBalance_Filter>;
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
  ampUpdate?: Maybe<AmpUpdate>;
  ampUpdates: Array<AmpUpdate>;
  balancer?: Maybe<Balancer>;
  balancerSnapshot?: Maybe<BalancerSnapshot>;
  balancerSnapshots: Array<BalancerSnapshot>;
  balancers: Array<Balancer>;
  circuitBreaker?: Maybe<CircuitBreaker>;
  circuitBreakers: Array<CircuitBreaker>;
  fxoracle?: Maybe<FxOracle>;
  fxoracles: Array<FxOracle>;
  gradualWeightUpdate?: Maybe<GradualWeightUpdate>;
  gradualWeightUpdates: Array<GradualWeightUpdate>;
  joinExit?: Maybe<JoinExit>;
  joinExits: Array<JoinExit>;
  latestPrice?: Maybe<LatestPrice>;
  latestPrices: Array<LatestPrice>;
  managementOperation?: Maybe<ManagementOperation>;
  managementOperations: Array<ManagementOperation>;
  pool?: Maybe<Pool>;
  poolContract?: Maybe<PoolContract>;
  poolContracts: Array<PoolContract>;
  poolHistoricalLiquidities: Array<PoolHistoricalLiquidity>;
  poolHistoricalLiquidity?: Maybe<PoolHistoricalLiquidity>;
  poolShare?: Maybe<PoolShare>;
  poolShares: Array<PoolShare>;
  poolSnapshot?: Maybe<PoolSnapshot>;
  poolSnapshots: Array<PoolSnapshot>;
  poolToken?: Maybe<PoolToken>;
  poolTokens: Array<PoolToken>;
  pools: Array<Pool>;
  priceRateProvider?: Maybe<PriceRateProvider>;
  priceRateProviders: Array<PriceRateProvider>;
  protocolIdData?: Maybe<ProtocolIdData>;
  protocolIdDatas: Array<ProtocolIdData>;
  swap?: Maybe<Swap>;
  swapFeeUpdate?: Maybe<SwapFeeUpdate>;
  swapFeeUpdates: Array<SwapFeeUpdate>;
  swaps: Array<Swap>;
  token?: Maybe<Token>;
  tokenPrice?: Maybe<TokenPrice>;
  tokenPrices: Array<TokenPrice>;
  tokenSnapshot?: Maybe<TokenSnapshot>;
  tokenSnapshots: Array<TokenSnapshot>;
  tokens: Array<Token>;
  tradePair?: Maybe<TradePair>;
  tradePairSnapshot?: Maybe<TradePairSnapshot>;
  tradePairSnapshots: Array<TradePairSnapshot>;
  tradePairs: Array<TradePair>;
  user?: Maybe<User>;
  userInternalBalance?: Maybe<UserInternalBalance>;
  userInternalBalances: Array<UserInternalBalance>;
  users: Array<User>;
};


export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type SubscriptionAmpUpdateArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionAmpUpdatesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AmpUpdate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<AmpUpdate_Filter>;
};


export type SubscriptionBalancerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionBalancerSnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionBalancerSnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<BalancerSnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<BalancerSnapshot_Filter>;
};


export type SubscriptionBalancersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Balancer_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Balancer_Filter>;
};


export type SubscriptionCircuitBreakerArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionCircuitBreakersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<CircuitBreaker_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CircuitBreaker_Filter>;
};


export type SubscriptionFxoracleArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionFxoraclesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<FxOracle_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FxOracle_Filter>;
};


export type SubscriptionGradualWeightUpdateArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionGradualWeightUpdatesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GradualWeightUpdate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<GradualWeightUpdate_Filter>;
};


export type SubscriptionJoinExitArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionJoinExitsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<JoinExit_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<JoinExit_Filter>;
};


export type SubscriptionLatestPriceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionLatestPricesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<LatestPrice_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LatestPrice_Filter>;
};


export type SubscriptionManagementOperationArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionManagementOperationsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ManagementOperation_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ManagementOperation_Filter>;
};


export type SubscriptionPoolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPoolContractArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPoolContractsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolContract_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PoolContract_Filter>;
};


export type SubscriptionPoolHistoricalLiquiditiesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolHistoricalLiquidity_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PoolHistoricalLiquidity_Filter>;
};


export type SubscriptionPoolHistoricalLiquidityArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPoolShareArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPoolSharesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolShare_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PoolShare_Filter>;
};


export type SubscriptionPoolSnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPoolSnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolSnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PoolSnapshot_Filter>;
};


export type SubscriptionPoolTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPoolTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PoolToken_Filter>;
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


export type SubscriptionPriceRateProviderArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPriceRateProvidersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PriceRateProvider_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PriceRateProvider_Filter>;
};


export type SubscriptionProtocolIdDataArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionProtocolIdDatasArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<ProtocolIdData_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProtocolIdData_Filter>;
};


export type SubscriptionSwapArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionSwapFeeUpdateArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionSwapFeeUpdatesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SwapFeeUpdate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SwapFeeUpdate_Filter>;
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


export type SubscriptionTokenPriceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionTokenPricesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokenPrice_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenPrice_Filter>;
};


export type SubscriptionTokenSnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionTokenSnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TokenSnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenSnapshot_Filter>;
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


export type SubscriptionTradePairArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionTradePairSnapshotArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionTradePairSnapshotsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TradePairSnapshot_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TradePairSnapshot_Filter>;
};


export type SubscriptionTradePairsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TradePair_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TradePair_Filter>;
};


export type SubscriptionUserArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionUserInternalBalanceArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionUserInternalBalancesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UserInternalBalance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UserInternalBalance_Filter>;
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
  block?: Maybe<Scalars['BigInt']['output']>;
  caller: Scalars['Bytes']['output'];
  id: Scalars['ID']['output'];
  poolId: Pool;
  timestamp: Scalars['Int']['output'];
  tokenAmountIn: Scalars['BigDecimal']['output'];
  tokenAmountOut: Scalars['BigDecimal']['output'];
  tokenIn: Scalars['Bytes']['output'];
  tokenInSym: Scalars['String']['output'];
  tokenOut: Scalars['Bytes']['output'];
  tokenOutSym: Scalars['String']['output'];
  tx: Scalars['Bytes']['output'];
  userAddress: User;
  valueUSD: Scalars['BigDecimal']['output'];
};

export type SwapFeeUpdate = {
  __typename?: 'SwapFeeUpdate';
  endSwapFeePercentage: Scalars['BigDecimal']['output'];
  endTimestamp: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  pool: Pool;
  scheduledTimestamp: Scalars['Int']['output'];
  startSwapFeePercentage: Scalars['BigDecimal']['output'];
  startTimestamp: Scalars['BigInt']['output'];
};

export type SwapFeeUpdate_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SwapFeeUpdate_Filter>>>;
  endSwapFeePercentage?: InputMaybe<Scalars['BigDecimal']['input']>;
  endSwapFeePercentage_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  endSwapFeePercentage_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  endSwapFeePercentage_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  endSwapFeePercentage_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  endSwapFeePercentage_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  endSwapFeePercentage_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  endSwapFeePercentage_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  endTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  endTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  endTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  endTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  endTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  endTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  endTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  endTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<SwapFeeUpdate_Filter>>>;
  pool?: InputMaybe<Scalars['String']['input']>;
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
  scheduledTimestamp?: InputMaybe<Scalars['Int']['input']>;
  scheduledTimestamp_gt?: InputMaybe<Scalars['Int']['input']>;
  scheduledTimestamp_gte?: InputMaybe<Scalars['Int']['input']>;
  scheduledTimestamp_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  scheduledTimestamp_lt?: InputMaybe<Scalars['Int']['input']>;
  scheduledTimestamp_lte?: InputMaybe<Scalars['Int']['input']>;
  scheduledTimestamp_not?: InputMaybe<Scalars['Int']['input']>;
  scheduledTimestamp_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  startSwapFeePercentage?: InputMaybe<Scalars['BigDecimal']['input']>;
  startSwapFeePercentage_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  startSwapFeePercentage_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  startSwapFeePercentage_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  startSwapFeePercentage_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  startSwapFeePercentage_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  startSwapFeePercentage_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  startSwapFeePercentage_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  startTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  startTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  startTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  startTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  startTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  startTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  startTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  startTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type SwapFeeUpdate_OrderBy =
  | 'endSwapFeePercentage'
  | 'endTimestamp'
  | 'id'
  | 'pool'
  | 'pool__address'
  | 'pool__alpha'
  | 'pool__amp'
  | 'pool__baseToken'
  | 'pool__beta'
  | 'pool__c'
  | 'pool__createTime'
  | 'pool__dSq'
  | 'pool__delta'
  | 'pool__epsilon'
  | 'pool__expiryTime'
  | 'pool__factory'
  | 'pool__holdersCount'
  | 'pool__id'
  | 'pool__isInRecoveryMode'
  | 'pool__isPaused'
  | 'pool__joinExitEnabled'
  | 'pool__lambda'
  | 'pool__lastJoinExitAmp'
  | 'pool__lastPostJoinExitInvariant'
  | 'pool__lowerTarget'
  | 'pool__mainIndex'
  | 'pool__managementAumFee'
  | 'pool__managementFee'
  | 'pool__mustAllowlistLPs'
  | 'pool__name'
  | 'pool__oracleEnabled'
  | 'pool__owner'
  | 'pool__poolType'
  | 'pool__poolTypeVersion'
  | 'pool__principalToken'
  | 'pool__protocolAumFeeCache'
  | 'pool__protocolId'
  | 'pool__protocolSwapFeeCache'
  | 'pool__protocolYieldFeeCache'
  | 'pool__root3Alpha'
  | 'pool__s'
  | 'pool__sqrtAlpha'
  | 'pool__sqrtBeta'
  | 'pool__strategyType'
  | 'pool__swapEnabled'
  | 'pool__swapEnabledCurationSignal'
  | 'pool__swapEnabledInternal'
  | 'pool__swapFee'
  | 'pool__swapsCount'
  | 'pool__symbol'
  | 'pool__tauAlphaX'
  | 'pool__tauAlphaY'
  | 'pool__tauBetaX'
  | 'pool__tauBetaY'
  | 'pool__totalAumFeeCollectedInBPT'
  | 'pool__totalLiquidity'
  | 'pool__totalLiquiditySansBPT'
  | 'pool__totalProtocolFee'
  | 'pool__totalProtocolFeePaidInBPT'
  | 'pool__totalShares'
  | 'pool__totalSwapFee'
  | 'pool__totalSwapVolume'
  | 'pool__totalWeight'
  | 'pool__tx'
  | 'pool__u'
  | 'pool__unitSeconds'
  | 'pool__upperTarget'
  | 'pool__v'
  | 'pool__w'
  | 'pool__wrappedIndex'
  | 'pool__z'
  | 'scheduledTimestamp'
  | 'startSwapFeePercentage'
  | 'startTimestamp'
  | '%future added value';

export type Swap_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Swap_Filter>>>;
  block?: InputMaybe<Scalars['BigInt']['input']>;
  block_gt?: InputMaybe<Scalars['BigInt']['input']>;
  block_gte?: InputMaybe<Scalars['BigInt']['input']>;
  block_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  block_lt?: InputMaybe<Scalars['BigInt']['input']>;
  block_lte?: InputMaybe<Scalars['BigInt']['input']>;
  block_not?: InputMaybe<Scalars['BigInt']['input']>;
  block_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  caller?: InputMaybe<Scalars['Bytes']['input']>;
  caller_contains?: InputMaybe<Scalars['Bytes']['input']>;
  caller_gt?: InputMaybe<Scalars['Bytes']['input']>;
  caller_gte?: InputMaybe<Scalars['Bytes']['input']>;
  caller_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  caller_lt?: InputMaybe<Scalars['Bytes']['input']>;
  caller_lte?: InputMaybe<Scalars['Bytes']['input']>;
  caller_not?: InputMaybe<Scalars['Bytes']['input']>;
  caller_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  caller_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Swap_Filter>>>;
  poolId?: InputMaybe<Scalars['String']['input']>;
  poolId_?: InputMaybe<Pool_Filter>;
  poolId_contains?: InputMaybe<Scalars['String']['input']>;
  poolId_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  poolId_ends_with?: InputMaybe<Scalars['String']['input']>;
  poolId_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  poolId_gt?: InputMaybe<Scalars['String']['input']>;
  poolId_gte?: InputMaybe<Scalars['String']['input']>;
  poolId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  poolId_lt?: InputMaybe<Scalars['String']['input']>;
  poolId_lte?: InputMaybe<Scalars['String']['input']>;
  poolId_not?: InputMaybe<Scalars['String']['input']>;
  poolId_not_contains?: InputMaybe<Scalars['String']['input']>;
  poolId_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  poolId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  poolId_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  poolId_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  poolId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  poolId_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  poolId_starts_with?: InputMaybe<Scalars['String']['input']>;
  poolId_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['Int']['input']>;
  timestamp_gt?: InputMaybe<Scalars['Int']['input']>;
  timestamp_gte?: InputMaybe<Scalars['Int']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']['input']>;
  timestamp_lte?: InputMaybe<Scalars['Int']['input']>;
  timestamp_not?: InputMaybe<Scalars['Int']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  tokenAmountIn?: InputMaybe<Scalars['BigDecimal']['input']>;
  tokenAmountIn_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  tokenAmountIn_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  tokenAmountIn_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  tokenAmountIn_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  tokenAmountIn_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  tokenAmountIn_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  tokenAmountIn_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  tokenAmountOut?: InputMaybe<Scalars['BigDecimal']['input']>;
  tokenAmountOut_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  tokenAmountOut_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  tokenAmountOut_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  tokenAmountOut_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  tokenAmountOut_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  tokenAmountOut_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  tokenAmountOut_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  tokenIn?: InputMaybe<Scalars['Bytes']['input']>;
  tokenInSym?: InputMaybe<Scalars['String']['input']>;
  tokenInSym_contains?: InputMaybe<Scalars['String']['input']>;
  tokenInSym_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenInSym_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenInSym_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenInSym_gt?: InputMaybe<Scalars['String']['input']>;
  tokenInSym_gte?: InputMaybe<Scalars['String']['input']>;
  tokenInSym_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tokenInSym_lt?: InputMaybe<Scalars['String']['input']>;
  tokenInSym_lte?: InputMaybe<Scalars['String']['input']>;
  tokenInSym_not?: InputMaybe<Scalars['String']['input']>;
  tokenInSym_not_contains?: InputMaybe<Scalars['String']['input']>;
  tokenInSym_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenInSym_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenInSym_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenInSym_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tokenInSym_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenInSym_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenInSym_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenInSym_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenIn_contains?: InputMaybe<Scalars['Bytes']['input']>;
  tokenIn_gt?: InputMaybe<Scalars['Bytes']['input']>;
  tokenIn_gte?: InputMaybe<Scalars['Bytes']['input']>;
  tokenIn_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  tokenIn_lt?: InputMaybe<Scalars['Bytes']['input']>;
  tokenIn_lte?: InputMaybe<Scalars['Bytes']['input']>;
  tokenIn_not?: InputMaybe<Scalars['Bytes']['input']>;
  tokenIn_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  tokenIn_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  tokenOut?: InputMaybe<Scalars['Bytes']['input']>;
  tokenOutSym?: InputMaybe<Scalars['String']['input']>;
  tokenOutSym_contains?: InputMaybe<Scalars['String']['input']>;
  tokenOutSym_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenOutSym_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenOutSym_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenOutSym_gt?: InputMaybe<Scalars['String']['input']>;
  tokenOutSym_gte?: InputMaybe<Scalars['String']['input']>;
  tokenOutSym_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tokenOutSym_lt?: InputMaybe<Scalars['String']['input']>;
  tokenOutSym_lte?: InputMaybe<Scalars['String']['input']>;
  tokenOutSym_not?: InputMaybe<Scalars['String']['input']>;
  tokenOutSym_not_contains?: InputMaybe<Scalars['String']['input']>;
  tokenOutSym_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenOutSym_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenOutSym_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenOutSym_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tokenOutSym_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenOutSym_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenOutSym_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenOutSym_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenOut_contains?: InputMaybe<Scalars['Bytes']['input']>;
  tokenOut_gt?: InputMaybe<Scalars['Bytes']['input']>;
  tokenOut_gte?: InputMaybe<Scalars['Bytes']['input']>;
  tokenOut_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  tokenOut_lt?: InputMaybe<Scalars['Bytes']['input']>;
  tokenOut_lte?: InputMaybe<Scalars['Bytes']['input']>;
  tokenOut_not?: InputMaybe<Scalars['Bytes']['input']>;
  tokenOut_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  tokenOut_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  tx?: InputMaybe<Scalars['Bytes']['input']>;
  tx_contains?: InputMaybe<Scalars['Bytes']['input']>;
  tx_gt?: InputMaybe<Scalars['Bytes']['input']>;
  tx_gte?: InputMaybe<Scalars['Bytes']['input']>;
  tx_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  tx_lt?: InputMaybe<Scalars['Bytes']['input']>;
  tx_lte?: InputMaybe<Scalars['Bytes']['input']>;
  tx_not?: InputMaybe<Scalars['Bytes']['input']>;
  tx_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  tx_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  userAddress?: InputMaybe<Scalars['String']['input']>;
  userAddress_?: InputMaybe<User_Filter>;
  userAddress_contains?: InputMaybe<Scalars['String']['input']>;
  userAddress_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  userAddress_ends_with?: InputMaybe<Scalars['String']['input']>;
  userAddress_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  userAddress_gt?: InputMaybe<Scalars['String']['input']>;
  userAddress_gte?: InputMaybe<Scalars['String']['input']>;
  userAddress_in?: InputMaybe<Array<Scalars['String']['input']>>;
  userAddress_lt?: InputMaybe<Scalars['String']['input']>;
  userAddress_lte?: InputMaybe<Scalars['String']['input']>;
  userAddress_not?: InputMaybe<Scalars['String']['input']>;
  userAddress_not_contains?: InputMaybe<Scalars['String']['input']>;
  userAddress_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  userAddress_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  userAddress_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  userAddress_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  userAddress_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  userAddress_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  userAddress_starts_with?: InputMaybe<Scalars['String']['input']>;
  userAddress_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  valueUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  valueUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  valueUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  valueUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  valueUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  valueUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  valueUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  valueUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
};

export type Swap_OrderBy =
  | 'block'
  | 'caller'
  | 'id'
  | 'poolId'
  | 'poolId__address'
  | 'poolId__alpha'
  | 'poolId__amp'
  | 'poolId__baseToken'
  | 'poolId__beta'
  | 'poolId__c'
  | 'poolId__createTime'
  | 'poolId__dSq'
  | 'poolId__delta'
  | 'poolId__epsilon'
  | 'poolId__expiryTime'
  | 'poolId__factory'
  | 'poolId__holdersCount'
  | 'poolId__id'
  | 'poolId__isInRecoveryMode'
  | 'poolId__isPaused'
  | 'poolId__joinExitEnabled'
  | 'poolId__lambda'
  | 'poolId__lastJoinExitAmp'
  | 'poolId__lastPostJoinExitInvariant'
  | 'poolId__lowerTarget'
  | 'poolId__mainIndex'
  | 'poolId__managementAumFee'
  | 'poolId__managementFee'
  | 'poolId__mustAllowlistLPs'
  | 'poolId__name'
  | 'poolId__oracleEnabled'
  | 'poolId__owner'
  | 'poolId__poolType'
  | 'poolId__poolTypeVersion'
  | 'poolId__principalToken'
  | 'poolId__protocolAumFeeCache'
  | 'poolId__protocolId'
  | 'poolId__protocolSwapFeeCache'
  | 'poolId__protocolYieldFeeCache'
  | 'poolId__root3Alpha'
  | 'poolId__s'
  | 'poolId__sqrtAlpha'
  | 'poolId__sqrtBeta'
  | 'poolId__strategyType'
  | 'poolId__swapEnabled'
  | 'poolId__swapEnabledCurationSignal'
  | 'poolId__swapEnabledInternal'
  | 'poolId__swapFee'
  | 'poolId__swapsCount'
  | 'poolId__symbol'
  | 'poolId__tauAlphaX'
  | 'poolId__tauAlphaY'
  | 'poolId__tauBetaX'
  | 'poolId__tauBetaY'
  | 'poolId__totalAumFeeCollectedInBPT'
  | 'poolId__totalLiquidity'
  | 'poolId__totalLiquiditySansBPT'
  | 'poolId__totalProtocolFee'
  | 'poolId__totalProtocolFeePaidInBPT'
  | 'poolId__totalShares'
  | 'poolId__totalSwapFee'
  | 'poolId__totalSwapVolume'
  | 'poolId__totalWeight'
  | 'poolId__tx'
  | 'poolId__u'
  | 'poolId__unitSeconds'
  | 'poolId__upperTarget'
  | 'poolId__v'
  | 'poolId__w'
  | 'poolId__wrappedIndex'
  | 'poolId__z'
  | 'timestamp'
  | 'tokenAmountIn'
  | 'tokenAmountOut'
  | 'tokenIn'
  | 'tokenInSym'
  | 'tokenOut'
  | 'tokenOutSym'
  | 'tx'
  | 'userAddress'
  | 'userAddress__id'
  | 'valueUSD'
  | '%future added value';

export type Token = {
  __typename?: 'Token';
  address: Scalars['String']['output'];
  decimals: Scalars['Int']['output'];
  fxOracleDecimals?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  latestFXPrice?: Maybe<Scalars['BigDecimal']['output']>;
  latestPrice?: Maybe<LatestPrice>;
  latestUSDPrice?: Maybe<Scalars['BigDecimal']['output']>;
  latestUSDPriceTimestamp?: Maybe<Scalars['BigInt']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  pool?: Maybe<Pool>;
  symbol?: Maybe<Scalars['String']['output']>;
  totalBalanceNotional: Scalars['BigDecimal']['output'];
  totalBalanceUSD: Scalars['BigDecimal']['output'];
  totalSwapCount: Scalars['BigInt']['output'];
  totalVolumeNotional: Scalars['BigDecimal']['output'];
  totalVolumeUSD: Scalars['BigDecimal']['output'];
};

export type TokenPrice = {
  __typename?: 'TokenPrice';
  amount: Scalars['BigDecimal']['output'];
  asset: Scalars['Bytes']['output'];
  block: Scalars['BigInt']['output'];
  id: Scalars['ID']['output'];
  poolId: Pool;
  price: Scalars['BigDecimal']['output'];
  pricingAsset: Scalars['Bytes']['output'];
  timestamp: Scalars['Int']['output'];
};

export type TokenPrice_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  amount?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  amount_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  and?: InputMaybe<Array<InputMaybe<TokenPrice_Filter>>>;
  asset?: InputMaybe<Scalars['Bytes']['input']>;
  asset_contains?: InputMaybe<Scalars['Bytes']['input']>;
  asset_gt?: InputMaybe<Scalars['Bytes']['input']>;
  asset_gte?: InputMaybe<Scalars['Bytes']['input']>;
  asset_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  asset_lt?: InputMaybe<Scalars['Bytes']['input']>;
  asset_lte?: InputMaybe<Scalars['Bytes']['input']>;
  asset_not?: InputMaybe<Scalars['Bytes']['input']>;
  asset_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  asset_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  block?: InputMaybe<Scalars['BigInt']['input']>;
  block_gt?: InputMaybe<Scalars['BigInt']['input']>;
  block_gte?: InputMaybe<Scalars['BigInt']['input']>;
  block_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  block_lt?: InputMaybe<Scalars['BigInt']['input']>;
  block_lte?: InputMaybe<Scalars['BigInt']['input']>;
  block_not?: InputMaybe<Scalars['BigInt']['input']>;
  block_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<TokenPrice_Filter>>>;
  poolId?: InputMaybe<Scalars['String']['input']>;
  poolId_?: InputMaybe<Pool_Filter>;
  poolId_contains?: InputMaybe<Scalars['String']['input']>;
  poolId_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  poolId_ends_with?: InputMaybe<Scalars['String']['input']>;
  poolId_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  poolId_gt?: InputMaybe<Scalars['String']['input']>;
  poolId_gte?: InputMaybe<Scalars['String']['input']>;
  poolId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  poolId_lt?: InputMaybe<Scalars['String']['input']>;
  poolId_lte?: InputMaybe<Scalars['String']['input']>;
  poolId_not?: InputMaybe<Scalars['String']['input']>;
  poolId_not_contains?: InputMaybe<Scalars['String']['input']>;
  poolId_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  poolId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  poolId_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  poolId_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  poolId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  poolId_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  poolId_starts_with?: InputMaybe<Scalars['String']['input']>;
  poolId_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  price_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  price_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  pricingAsset?: InputMaybe<Scalars['Bytes']['input']>;
  pricingAsset_contains?: InputMaybe<Scalars['Bytes']['input']>;
  pricingAsset_gt?: InputMaybe<Scalars['Bytes']['input']>;
  pricingAsset_gte?: InputMaybe<Scalars['Bytes']['input']>;
  pricingAsset_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  pricingAsset_lt?: InputMaybe<Scalars['Bytes']['input']>;
  pricingAsset_lte?: InputMaybe<Scalars['Bytes']['input']>;
  pricingAsset_not?: InputMaybe<Scalars['Bytes']['input']>;
  pricingAsset_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  pricingAsset_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  timestamp?: InputMaybe<Scalars['Int']['input']>;
  timestamp_gt?: InputMaybe<Scalars['Int']['input']>;
  timestamp_gte?: InputMaybe<Scalars['Int']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']['input']>;
  timestamp_lte?: InputMaybe<Scalars['Int']['input']>;
  timestamp_not?: InputMaybe<Scalars['Int']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type TokenPrice_OrderBy =
  | 'amount'
  | 'asset'
  | 'block'
  | 'id'
  | 'poolId'
  | 'poolId__address'
  | 'poolId__alpha'
  | 'poolId__amp'
  | 'poolId__baseToken'
  | 'poolId__beta'
  | 'poolId__c'
  | 'poolId__createTime'
  | 'poolId__dSq'
  | 'poolId__delta'
  | 'poolId__epsilon'
  | 'poolId__expiryTime'
  | 'poolId__factory'
  | 'poolId__holdersCount'
  | 'poolId__id'
  | 'poolId__isInRecoveryMode'
  | 'poolId__isPaused'
  | 'poolId__joinExitEnabled'
  | 'poolId__lambda'
  | 'poolId__lastJoinExitAmp'
  | 'poolId__lastPostJoinExitInvariant'
  | 'poolId__lowerTarget'
  | 'poolId__mainIndex'
  | 'poolId__managementAumFee'
  | 'poolId__managementFee'
  | 'poolId__mustAllowlistLPs'
  | 'poolId__name'
  | 'poolId__oracleEnabled'
  | 'poolId__owner'
  | 'poolId__poolType'
  | 'poolId__poolTypeVersion'
  | 'poolId__principalToken'
  | 'poolId__protocolAumFeeCache'
  | 'poolId__protocolId'
  | 'poolId__protocolSwapFeeCache'
  | 'poolId__protocolYieldFeeCache'
  | 'poolId__root3Alpha'
  | 'poolId__s'
  | 'poolId__sqrtAlpha'
  | 'poolId__sqrtBeta'
  | 'poolId__strategyType'
  | 'poolId__swapEnabled'
  | 'poolId__swapEnabledCurationSignal'
  | 'poolId__swapEnabledInternal'
  | 'poolId__swapFee'
  | 'poolId__swapsCount'
  | 'poolId__symbol'
  | 'poolId__tauAlphaX'
  | 'poolId__tauAlphaY'
  | 'poolId__tauBetaX'
  | 'poolId__tauBetaY'
  | 'poolId__totalAumFeeCollectedInBPT'
  | 'poolId__totalLiquidity'
  | 'poolId__totalLiquiditySansBPT'
  | 'poolId__totalProtocolFee'
  | 'poolId__totalProtocolFeePaidInBPT'
  | 'poolId__totalShares'
  | 'poolId__totalSwapFee'
  | 'poolId__totalSwapVolume'
  | 'poolId__totalWeight'
  | 'poolId__tx'
  | 'poolId__u'
  | 'poolId__unitSeconds'
  | 'poolId__upperTarget'
  | 'poolId__v'
  | 'poolId__w'
  | 'poolId__wrappedIndex'
  | 'poolId__z'
  | 'price'
  | 'pricingAsset'
  | 'timestamp'
  | '%future added value';

export type TokenSnapshot = {
  __typename?: 'TokenSnapshot';
  id: Scalars['ID']['output'];
  timestamp: Scalars['Int']['output'];
  token: Token;
  totalBalanceNotional: Scalars['BigDecimal']['output'];
  totalBalanceUSD: Scalars['BigDecimal']['output'];
  totalSwapCount: Scalars['BigInt']['output'];
  totalVolumeNotional: Scalars['BigDecimal']['output'];
  totalVolumeUSD: Scalars['BigDecimal']['output'];
};

export type TokenSnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<TokenSnapshot_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<TokenSnapshot_Filter>>>;
  timestamp?: InputMaybe<Scalars['Int']['input']>;
  timestamp_gt?: InputMaybe<Scalars['Int']['input']>;
  timestamp_gte?: InputMaybe<Scalars['Int']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']['input']>;
  timestamp_lte?: InputMaybe<Scalars['Int']['input']>;
  timestamp_not?: InputMaybe<Scalars['Int']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
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
  totalBalanceNotional?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalBalanceNotional_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalBalanceNotional_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalBalanceNotional_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalBalanceNotional_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalBalanceNotional_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalBalanceNotional_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalBalanceNotional_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalBalanceUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalBalanceUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalBalanceUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalBalanceUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalBalanceUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalBalanceUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalBalanceUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalBalanceUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalSwapCount?: InputMaybe<Scalars['BigInt']['input']>;
  totalSwapCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalSwapCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalSwapCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalSwapCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalSwapCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalSwapCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalSwapCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalVolumeNotional?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalVolumeNotional_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalVolumeNotional_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalVolumeNotional_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalVolumeNotional_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalVolumeNotional_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalVolumeNotional_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalVolumeNotional_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
};

export type TokenSnapshot_OrderBy =
  | 'id'
  | 'timestamp'
  | 'token'
  | 'token__address'
  | 'token__decimals'
  | 'token__fxOracleDecimals'
  | 'token__id'
  | 'token__latestFXPrice'
  | 'token__latestUSDPrice'
  | 'token__latestUSDPriceTimestamp'
  | 'token__name'
  | 'token__symbol'
  | 'token__totalBalanceNotional'
  | 'token__totalBalanceUSD'
  | 'token__totalSwapCount'
  | 'token__totalVolumeNotional'
  | 'token__totalVolumeUSD'
  | 'totalBalanceNotional'
  | 'totalBalanceUSD'
  | 'totalSwapCount'
  | 'totalVolumeNotional'
  | 'totalVolumeUSD'
  | '%future added value';

export type Token_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  address?: InputMaybe<Scalars['String']['input']>;
  address_contains?: InputMaybe<Scalars['String']['input']>;
  address_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  address_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  address_gt?: InputMaybe<Scalars['String']['input']>;
  address_gte?: InputMaybe<Scalars['String']['input']>;
  address_in?: InputMaybe<Array<Scalars['String']['input']>>;
  address_lt?: InputMaybe<Scalars['String']['input']>;
  address_lte?: InputMaybe<Scalars['String']['input']>;
  address_not?: InputMaybe<Scalars['String']['input']>;
  address_not_contains?: InputMaybe<Scalars['String']['input']>;
  address_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  address_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  address_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  address_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  address_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  address_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  address_starts_with?: InputMaybe<Scalars['String']['input']>;
  address_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  and?: InputMaybe<Array<InputMaybe<Token_Filter>>>;
  decimals?: InputMaybe<Scalars['Int']['input']>;
  decimals_gt?: InputMaybe<Scalars['Int']['input']>;
  decimals_gte?: InputMaybe<Scalars['Int']['input']>;
  decimals_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  decimals_lt?: InputMaybe<Scalars['Int']['input']>;
  decimals_lte?: InputMaybe<Scalars['Int']['input']>;
  decimals_not?: InputMaybe<Scalars['Int']['input']>;
  decimals_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  fxOracleDecimals?: InputMaybe<Scalars['Int']['input']>;
  fxOracleDecimals_gt?: InputMaybe<Scalars['Int']['input']>;
  fxOracleDecimals_gte?: InputMaybe<Scalars['Int']['input']>;
  fxOracleDecimals_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  fxOracleDecimals_lt?: InputMaybe<Scalars['Int']['input']>;
  fxOracleDecimals_lte?: InputMaybe<Scalars['Int']['input']>;
  fxOracleDecimals_not?: InputMaybe<Scalars['Int']['input']>;
  fxOracleDecimals_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  latestFXPrice?: InputMaybe<Scalars['BigDecimal']['input']>;
  latestFXPrice_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  latestFXPrice_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  latestFXPrice_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  latestFXPrice_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  latestFXPrice_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  latestFXPrice_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  latestFXPrice_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  latestPrice?: InputMaybe<Scalars['String']['input']>;
  latestPrice_?: InputMaybe<LatestPrice_Filter>;
  latestPrice_contains?: InputMaybe<Scalars['String']['input']>;
  latestPrice_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  latestPrice_ends_with?: InputMaybe<Scalars['String']['input']>;
  latestPrice_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  latestPrice_gt?: InputMaybe<Scalars['String']['input']>;
  latestPrice_gte?: InputMaybe<Scalars['String']['input']>;
  latestPrice_in?: InputMaybe<Array<Scalars['String']['input']>>;
  latestPrice_lt?: InputMaybe<Scalars['String']['input']>;
  latestPrice_lte?: InputMaybe<Scalars['String']['input']>;
  latestPrice_not?: InputMaybe<Scalars['String']['input']>;
  latestPrice_not_contains?: InputMaybe<Scalars['String']['input']>;
  latestPrice_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  latestPrice_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  latestPrice_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  latestPrice_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  latestPrice_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  latestPrice_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  latestPrice_starts_with?: InputMaybe<Scalars['String']['input']>;
  latestPrice_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  latestUSDPrice?: InputMaybe<Scalars['BigDecimal']['input']>;
  latestUSDPriceTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  latestUSDPriceTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  latestUSDPriceTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  latestUSDPriceTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  latestUSDPriceTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  latestUSDPriceTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  latestUSDPriceTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  latestUSDPriceTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  latestUSDPrice_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  latestUSDPrice_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  latestUSDPrice_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  latestUSDPrice_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  latestUSDPrice_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  latestUSDPrice_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  latestUSDPrice_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
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
  pool?: InputMaybe<Scalars['String']['input']>;
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
  totalBalanceNotional?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalBalanceNotional_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalBalanceNotional_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalBalanceNotional_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalBalanceNotional_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalBalanceNotional_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalBalanceNotional_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalBalanceNotional_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalBalanceUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalBalanceUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalBalanceUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalBalanceUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalBalanceUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalBalanceUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalBalanceUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalBalanceUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalSwapCount?: InputMaybe<Scalars['BigInt']['input']>;
  totalSwapCount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalSwapCount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalSwapCount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalSwapCount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalSwapCount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalSwapCount_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalSwapCount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalVolumeNotional?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalVolumeNotional_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalVolumeNotional_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalVolumeNotional_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalVolumeNotional_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalVolumeNotional_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalVolumeNotional_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalVolumeNotional_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalVolumeUSD?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalVolumeUSD_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalVolumeUSD_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalVolumeUSD_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalVolumeUSD_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalVolumeUSD_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalVolumeUSD_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalVolumeUSD_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
};

export type Token_OrderBy =
  | 'address'
  | 'decimals'
  | 'fxOracleDecimals'
  | 'id'
  | 'latestFXPrice'
  | 'latestPrice'
  | 'latestPrice__asset'
  | 'latestPrice__block'
  | 'latestPrice__id'
  | 'latestPrice__price'
  | 'latestPrice__pricingAsset'
  | 'latestUSDPrice'
  | 'latestUSDPriceTimestamp'
  | 'name'
  | 'pool'
  | 'pool__address'
  | 'pool__alpha'
  | 'pool__amp'
  | 'pool__baseToken'
  | 'pool__beta'
  | 'pool__c'
  | 'pool__createTime'
  | 'pool__dSq'
  | 'pool__delta'
  | 'pool__epsilon'
  | 'pool__expiryTime'
  | 'pool__factory'
  | 'pool__holdersCount'
  | 'pool__id'
  | 'pool__isInRecoveryMode'
  | 'pool__isPaused'
  | 'pool__joinExitEnabled'
  | 'pool__lambda'
  | 'pool__lastJoinExitAmp'
  | 'pool__lastPostJoinExitInvariant'
  | 'pool__lowerTarget'
  | 'pool__mainIndex'
  | 'pool__managementAumFee'
  | 'pool__managementFee'
  | 'pool__mustAllowlistLPs'
  | 'pool__name'
  | 'pool__oracleEnabled'
  | 'pool__owner'
  | 'pool__poolType'
  | 'pool__poolTypeVersion'
  | 'pool__principalToken'
  | 'pool__protocolAumFeeCache'
  | 'pool__protocolId'
  | 'pool__protocolSwapFeeCache'
  | 'pool__protocolYieldFeeCache'
  | 'pool__root3Alpha'
  | 'pool__s'
  | 'pool__sqrtAlpha'
  | 'pool__sqrtBeta'
  | 'pool__strategyType'
  | 'pool__swapEnabled'
  | 'pool__swapEnabledCurationSignal'
  | 'pool__swapEnabledInternal'
  | 'pool__swapFee'
  | 'pool__swapsCount'
  | 'pool__symbol'
  | 'pool__tauAlphaX'
  | 'pool__tauAlphaY'
  | 'pool__tauBetaX'
  | 'pool__tauBetaY'
  | 'pool__totalAumFeeCollectedInBPT'
  | 'pool__totalLiquidity'
  | 'pool__totalLiquiditySansBPT'
  | 'pool__totalProtocolFee'
  | 'pool__totalProtocolFeePaidInBPT'
  | 'pool__totalShares'
  | 'pool__totalSwapFee'
  | 'pool__totalSwapVolume'
  | 'pool__totalWeight'
  | 'pool__tx'
  | 'pool__u'
  | 'pool__unitSeconds'
  | 'pool__upperTarget'
  | 'pool__v'
  | 'pool__w'
  | 'pool__wrappedIndex'
  | 'pool__z'
  | 'symbol'
  | 'totalBalanceNotional'
  | 'totalBalanceUSD'
  | 'totalSwapCount'
  | 'totalVolumeNotional'
  | 'totalVolumeUSD'
  | '%future added value';

export type TradePair = {
  __typename?: 'TradePair';
  /** Token Address - Token Address */
  id: Scalars['ID']['output'];
  token0: Token;
  token1: Token;
  totalSwapFee: Scalars['BigDecimal']['output'];
  totalSwapVolume: Scalars['BigDecimal']['output'];
};

export type TradePairSnapshot = {
  __typename?: 'TradePairSnapshot';
  id: Scalars['ID']['output'];
  pair: TradePair;
  timestamp: Scalars['Int']['output'];
  totalSwapFee: Scalars['BigDecimal']['output'];
  totalSwapVolume: Scalars['BigDecimal']['output'];
};

export type TradePairSnapshot_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<TradePairSnapshot_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<TradePairSnapshot_Filter>>>;
  pair?: InputMaybe<Scalars['String']['input']>;
  pair_?: InputMaybe<TradePair_Filter>;
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
  timestamp?: InputMaybe<Scalars['Int']['input']>;
  timestamp_gt?: InputMaybe<Scalars['Int']['input']>;
  timestamp_gte?: InputMaybe<Scalars['Int']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['Int']['input']>;
  timestamp_lte?: InputMaybe<Scalars['Int']['input']>;
  timestamp_not?: InputMaybe<Scalars['Int']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['Int']['input']>>;
  totalSwapFee?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapFee_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapFee_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapFee_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalSwapFee_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapFee_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapFee_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapFee_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalSwapVolume?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapVolume_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapVolume_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapVolume_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalSwapVolume_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapVolume_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapVolume_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
};

export type TradePairSnapshot_OrderBy =
  | 'id'
  | 'pair'
  | 'pair__id'
  | 'pair__totalSwapFee'
  | 'pair__totalSwapVolume'
  | 'timestamp'
  | 'totalSwapFee'
  | 'totalSwapVolume'
  | '%future added value';

export type TradePair_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<TradePair_Filter>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<TradePair_Filter>>>;
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
  totalSwapFee?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapFee_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapFee_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapFee_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalSwapFee_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapFee_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapFee_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapFee_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalSwapVolume?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapVolume_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapVolume_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapVolume_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  totalSwapVolume_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapVolume_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapVolume_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  totalSwapVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
};

export type TradePair_OrderBy =
  | 'id'
  | 'token0'
  | 'token0__address'
  | 'token0__decimals'
  | 'token0__fxOracleDecimals'
  | 'token0__id'
  | 'token0__latestFXPrice'
  | 'token0__latestUSDPrice'
  | 'token0__latestUSDPriceTimestamp'
  | 'token0__name'
  | 'token0__symbol'
  | 'token0__totalBalanceNotional'
  | 'token0__totalBalanceUSD'
  | 'token0__totalSwapCount'
  | 'token0__totalVolumeNotional'
  | 'token0__totalVolumeUSD'
  | 'token1'
  | 'token1__address'
  | 'token1__decimals'
  | 'token1__fxOracleDecimals'
  | 'token1__id'
  | 'token1__latestFXPrice'
  | 'token1__latestUSDPrice'
  | 'token1__latestUSDPriceTimestamp'
  | 'token1__name'
  | 'token1__symbol'
  | 'token1__totalBalanceNotional'
  | 'token1__totalBalanceUSD'
  | 'token1__totalSwapCount'
  | 'token1__totalVolumeNotional'
  | 'token1__totalVolumeUSD'
  | 'totalSwapFee'
  | 'totalSwapVolume'
  | '%future added value';

export type User = {
  __typename?: 'User';
  id: Scalars['ID']['output'];
  sharesOwned?: Maybe<Array<PoolShare>>;
  swaps?: Maybe<Array<Swap>>;
  userInternalBalances?: Maybe<Array<UserInternalBalance>>;
};


export type UserSharesOwnedArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolShare_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PoolShare_Filter>;
};


export type UserSwapsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Swap_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<Swap_Filter>;
};


export type UserUserInternalBalancesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<UserInternalBalance_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<UserInternalBalance_Filter>;
};

export type UserInternalBalance = {
  __typename?: 'UserInternalBalance';
  balance: Scalars['BigDecimal']['output'];
  id: Scalars['ID']['output'];
  token: Scalars['Bytes']['output'];
  tokenInfo?: Maybe<Token>;
  userAddress?: Maybe<User>;
};

export type UserInternalBalance_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<UserInternalBalance_Filter>>>;
  balance?: InputMaybe<Scalars['BigDecimal']['input']>;
  balance_gt?: InputMaybe<Scalars['BigDecimal']['input']>;
  balance_gte?: InputMaybe<Scalars['BigDecimal']['input']>;
  balance_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  balance_lt?: InputMaybe<Scalars['BigDecimal']['input']>;
  balance_lte?: InputMaybe<Scalars['BigDecimal']['input']>;
  balance_not?: InputMaybe<Scalars['BigDecimal']['input']>;
  balance_not_in?: InputMaybe<Array<Scalars['BigDecimal']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  or?: InputMaybe<Array<InputMaybe<UserInternalBalance_Filter>>>;
  token?: InputMaybe<Scalars['Bytes']['input']>;
  tokenInfo?: InputMaybe<Scalars['String']['input']>;
  tokenInfo_?: InputMaybe<Token_Filter>;
  tokenInfo_contains?: InputMaybe<Scalars['String']['input']>;
  tokenInfo_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenInfo_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenInfo_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenInfo_gt?: InputMaybe<Scalars['String']['input']>;
  tokenInfo_gte?: InputMaybe<Scalars['String']['input']>;
  tokenInfo_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tokenInfo_lt?: InputMaybe<Scalars['String']['input']>;
  tokenInfo_lte?: InputMaybe<Scalars['String']['input']>;
  tokenInfo_not?: InputMaybe<Scalars['String']['input']>;
  tokenInfo_not_contains?: InputMaybe<Scalars['String']['input']>;
  tokenInfo_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenInfo_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  tokenInfo_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenInfo_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  tokenInfo_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenInfo_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  tokenInfo_starts_with?: InputMaybe<Scalars['String']['input']>;
  tokenInfo_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  token_contains?: InputMaybe<Scalars['Bytes']['input']>;
  token_gt?: InputMaybe<Scalars['Bytes']['input']>;
  token_gte?: InputMaybe<Scalars['Bytes']['input']>;
  token_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  token_lt?: InputMaybe<Scalars['Bytes']['input']>;
  token_lte?: InputMaybe<Scalars['Bytes']['input']>;
  token_not?: InputMaybe<Scalars['Bytes']['input']>;
  token_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  token_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  userAddress?: InputMaybe<Scalars['String']['input']>;
  userAddress_?: InputMaybe<User_Filter>;
  userAddress_contains?: InputMaybe<Scalars['String']['input']>;
  userAddress_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  userAddress_ends_with?: InputMaybe<Scalars['String']['input']>;
  userAddress_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  userAddress_gt?: InputMaybe<Scalars['String']['input']>;
  userAddress_gte?: InputMaybe<Scalars['String']['input']>;
  userAddress_in?: InputMaybe<Array<Scalars['String']['input']>>;
  userAddress_lt?: InputMaybe<Scalars['String']['input']>;
  userAddress_lte?: InputMaybe<Scalars['String']['input']>;
  userAddress_not?: InputMaybe<Scalars['String']['input']>;
  userAddress_not_contains?: InputMaybe<Scalars['String']['input']>;
  userAddress_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  userAddress_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  userAddress_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  userAddress_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  userAddress_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  userAddress_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  userAddress_starts_with?: InputMaybe<Scalars['String']['input']>;
  userAddress_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export type UserInternalBalance_OrderBy =
  | 'balance'
  | 'id'
  | 'token'
  | 'tokenInfo'
  | 'tokenInfo__address'
  | 'tokenInfo__decimals'
  | 'tokenInfo__fxOracleDecimals'
  | 'tokenInfo__id'
  | 'tokenInfo__latestFXPrice'
  | 'tokenInfo__latestUSDPrice'
  | 'tokenInfo__latestUSDPriceTimestamp'
  | 'tokenInfo__name'
  | 'tokenInfo__symbol'
  | 'tokenInfo__totalBalanceNotional'
  | 'tokenInfo__totalBalanceUSD'
  | 'tokenInfo__totalSwapCount'
  | 'tokenInfo__totalVolumeNotional'
  | 'tokenInfo__totalVolumeUSD'
  | 'userAddress'
  | 'userAddress__id'
  | '%future added value';

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
  or?: InputMaybe<Array<InputMaybe<User_Filter>>>;
  sharesOwned_?: InputMaybe<PoolShare_Filter>;
  swaps_?: InputMaybe<Swap_Filter>;
  userInternalBalances_?: InputMaybe<UserInternalBalance_Filter>;
};

export type User_OrderBy =
  | 'id'
  | 'sharesOwned'
  | 'swaps'
  | 'userInternalBalances'
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

export type InternalBalanceQueryVariables = Exact<{
  userAddress: Scalars['ID']['input'];
}>;


export type InternalBalanceQuery = { __typename?: 'Query', user?: { __typename?: 'User', id: string, userInternalBalances?: Array<{ __typename?: 'UserInternalBalance', balance: any, tokenInfo?: { __typename?: 'Token', name?: string | null, symbol?: string | null, address: string, decimals: number } | null }> | null } | null };

export type SingleInternalBalanceQueryVariables = Exact<{
  userAddress: Scalars['ID']['input'];
  tokenAddress: Scalars['Bytes']['input'];
}>;


export type SingleInternalBalanceQuery = { __typename?: 'Query', user?: { __typename?: 'User', id: string, userInternalBalances?: Array<{ __typename?: 'UserInternalBalance', balance: any, tokenInfo?: { __typename?: 'Token', name?: string | null, symbol?: string | null, address: string, decimals: number } | null }> | null } | null };

export type PoolsWhereOwnerQueryVariables = Exact<{
  owner: Scalars['Bytes']['input'];
}>;


export type PoolsWhereOwnerQuery = { __typename?: 'Query', pools: Array<{ __typename?: 'Pool', poolType?: string | null, name?: string | null, id: string, address: any, tokens?: Array<{ __typename?: 'PoolToken', symbol: string, weight?: any | null }> | null }> };

export type PoolsWherePoolTypeInAndIdQueryVariables = Exact<{
  poolId: Scalars['ID']['input'];
  poolTypes?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type PoolsWherePoolTypeInAndIdQuery = { __typename?: 'Query', pools: Array<{ __typename?: 'Pool', id: string, address: any, name?: string | null, poolType?: string | null, symbol?: string | null, totalLiquidity: any, tokens?: Array<{ __typename?: 'PoolToken', symbol: string }> | null }> };

export type PoolsWherePoolTypeQueryVariables = Exact<{
  poolTypes?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type PoolsWherePoolTypeQuery = { __typename?: 'Query', pools: Array<{ __typename?: 'Pool', id: string, address: any, name?: string | null, poolType?: string | null, symbol?: string | null, totalLiquidity: any, tokens?: Array<{ __typename?: 'PoolToken', symbol: string }> | null }> };

export type PoolSnapshotInRangeQueryVariables = Exact<{
  poolId: Scalars['String']['input'];
  timestamp?: InputMaybe<Array<Scalars['Int']['input']> | Scalars['Int']['input']>;
}>;


export type PoolSnapshotInRangeQuery = { __typename?: 'Query', poolSnapshots: Array<{ __typename?: 'PoolSnapshot', amounts: Array<any>, totalShares: any, swapVolume: any, protocolFee?: any | null, swapFees: any, liquidity: any, timestamp: number, pool: { __typename?: 'Pool', address: any, owner?: any | null, poolType?: string | null, symbol?: string | null, swapFee: any, totalLiquidity: any, totalSwapVolume: any, totalSwapFee: any, protocolYieldFeeCache?: any | null, protocolSwapFeeCache?: any | null, poolTypeVersion?: number | null, tokens?: Array<{ __typename?: 'PoolToken', address: string, symbol: string, balance: any, decimals: number, isExemptFromYieldProtocolFee?: boolean | null, priceRate: any, weight?: any | null }> | null } }> };

export type PoolQueryVariables = Exact<{
  poolId: Scalars['ID']['input'];
}>;


export type PoolQuery = { __typename?: 'Query', pool?: { __typename?: 'Pool', address: any, owner?: any | null, poolType?: string | null, symbol?: string | null, swapFee: any, totalLiquidity: any, totalSwapVolume: any, totalSwapFee: any, protocolYieldFeeCache?: any | null, protocolSwapFeeCache?: any | null, poolTypeVersion?: number | null, amp?: any | null, c?: any | null, s?: any | null, alpha?: any | null, beta?: any | null, sqrtAlpha?: any | null, sqrtBeta?: any | null, root3Alpha?: any | null, lambda?: any | null, tauAlphaX?: any | null, tauAlphaY?: any | null, tauBetaX?: any | null, tauBetaY?: any | null, delta?: any | null, epsilon?: any | null, u?: any | null, v?: any | null, w?: any | null, z?: any | null, dSq?: any | null, tokens?: Array<{ __typename?: 'PoolToken', address: string, symbol: string, balance: any, decimals: number, priceRate: any, weight?: any | null, isExemptFromYieldProtocolFee?: boolean | null, token: { __typename?: 'Token', fxOracleDecimals?: number | null, latestFXPrice?: any | null } }> | null } | null };

export type PoolRateProvidersQueryVariables = Exact<{
  poolId: Scalars['ID']['input'];
}>;


export type PoolRateProvidersQuery = { __typename?: 'Query', pool?: { __typename?: 'Pool', priceRateProviders?: Array<{ __typename?: 'PriceRateProvider', address: any, rate?: any | null, token: { __typename?: 'PoolToken', address: string, symbol: string } }> | null } | null };

export type AprPoolsQueryVariables = Exact<{
  skip: Scalars['Int']['input'];
  createdBefore?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  minTvl?: InputMaybe<Scalars['BigDecimal']['input']>;
  maxTvl?: InputMaybe<Scalars['BigDecimal']['input']>;
  block?: InputMaybe<Scalars['Int']['input']>;
}>;


export type AprPoolsQuery = { __typename?: 'Query', pools: Array<{ __typename?: 'Pool', id: string, address: any, symbol?: string | null, poolType?: string | null, createTime: number, tokens?: Array<{ __typename?: 'PoolToken', address: string, symbol: string, weight?: any | null }> | null }> };

export type WeightedPoolsAboveLiquidityWithTokensQueryVariables = Exact<{
  tokens?: InputMaybe<Array<Scalars['Bytes']['input']> | Scalars['Bytes']['input']>;
  liquidityThreshold: Scalars['BigDecimal']['input'];
}>;


export type WeightedPoolsAboveLiquidityWithTokensQuery = { __typename?: 'Query', pools: Array<{ __typename?: 'Pool', id: string }> };


export const InternalBalanceDocument = gql`
    query InternalBalance($userAddress: ID!) {
  user(id: $userAddress) {
    id
    userInternalBalances(where: {balance_gt: 0}) {
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
export const SingleInternalBalanceDocument = gql`
    query SingleInternalBalance($userAddress: ID!, $tokenAddress: Bytes!) {
  user(id: $userAddress) {
    id
    userInternalBalances(where: {token: $tokenAddress}) {
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
export const PoolsWhereOwnerDocument = gql`
    query PoolsWhereOwner($owner: Bytes!) {
  pools(where: {owner: $owner}) {
    poolType
    name
    id
    address
    tokens {
      symbol
      weight
    }
  }
}
    `;
export const PoolsWherePoolTypeInAndIdDocument = gql`
    query PoolsWherePoolTypeInAndId($poolId: ID!, $poolTypes: [String!] = ["Weighted", "ComposableStable", "Stable", "MetaStable", "Element", "LiquidityBootstrapping", "Linear", "GyroE"]) {
  pools(
    where: {poolType_in: $poolTypes, id: $poolId, totalLiquidity_gt: 0}
    orderBy: totalLiquidity
    orderDirection: desc
  ) {
    id
    address
    name
    poolType
    symbol
    totalLiquidity
    tokens {
      symbol
    }
  }
}
    `;
export const PoolsWherePoolTypeDocument = gql`
    query PoolsWherePoolType($poolTypes: [String!] = ["Weighted", "ComposableStable", "Stable", "MetaStable", "Element", "LiquidityBootstrapping", "Linear", "GyroE"]) {
  pools(
    where: {poolType_in: $poolTypes, totalLiquidity_gt: 0}
    orderBy: totalLiquidity
    orderDirection: desc
    first: 1000
  ) {
    id
    address
    name
    poolType
    symbol
    totalLiquidity
    tokens {
      symbol
    }
  }
}
    `;
export const PoolSnapshotInRangeDocument = gql`
    query poolSnapshotInRange($poolId: String!, $timestamp: [Int!]) {
  poolSnapshots(
    where: {pool_in: [$poolId], timestamp_in: $timestamp}
    orderBy: timestamp
    orderDirection: desc
  ) {
    pool {
      address
      owner
      poolType
      symbol
      swapFee
      totalLiquidity
      totalSwapVolume
      totalSwapFee
      protocolYieldFeeCache
      protocolSwapFeeCache
      poolTypeVersion
      tokens {
        address
        symbol
        balance
        decimals
        isExemptFromYieldProtocolFee
        priceRate
        weight
      }
    }
    amounts
    totalShares
    swapVolume
    protocolFee
    swapFees
    liquidity
    timestamp
  }
}
    `;
export const PoolDocument = gql`
    query Pool($poolId: ID!) {
  pool(id: $poolId) {
    address
    owner
    poolType
    symbol
    swapFee
    totalLiquidity
    totalSwapVolume
    totalSwapFee
    protocolYieldFeeCache
    protocolSwapFeeCache
    poolTypeVersion
    amp
    c
    s
    alpha
    beta
    sqrtAlpha
    sqrtBeta
    root3Alpha
    lambda
    tauAlphaX
    tauAlphaY
    tauBetaX
    tauBetaY
    delta
    epsilon
    u
    v
    w
    z
    dSq
    tokens {
      address
      symbol
      balance
      decimals
      priceRate
      weight
      isExemptFromYieldProtocolFee
      token {
        fxOracleDecimals
        latestFXPrice
      }
    }
  }
}
    `;
export const PoolRateProvidersDocument = gql`
    query PoolRateProviders($poolId: ID!) {
  pool(id: $poolId) {
    priceRateProviders {
      token {
        address
        symbol
      }
      address
      rate
    }
  }
}
    `;
export const AprPoolsDocument = gql`
    query APRPools($skip: Int!, $createdBefore: Int, $limit: Int, $minTvl: BigDecimal, $maxTvl: BigDecimal, $block: Int) {
  pools(
    where: {createTime_lte: $createdBefore, totalLiquidity_gte: $minTvl, totalLiquidity_lte: $maxTvl}
    first: $limit
    skip: $skip
    block: {number: $block}
  ) {
    id
    address
    symbol
    poolType
    createTime
    tokens {
      address
      symbol
      weight
    }
  }
}
    `;
export const WeightedPoolsAboveLiquidityWithTokensDocument = gql`
    query weightedPoolsAboveLiquidityWithTokens($tokens: [Bytes!], $liquidityThreshold: BigDecimal!) {
  pools(
    where: {poolType: "Weighted", tokensList_contains: $tokens, totalLiquidity_gt: $liquidityThreshold}
    orderBy: totalLiquidity
    orderDirection: desc
  ) {
    id
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    InternalBalance(variables: InternalBalanceQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<InternalBalanceQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<InternalBalanceQuery>(InternalBalanceDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'InternalBalance', 'query', variables);
    },
    SingleInternalBalance(variables: SingleInternalBalanceQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<SingleInternalBalanceQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<SingleInternalBalanceQuery>(SingleInternalBalanceDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'SingleInternalBalance', 'query', variables);
    },
    PoolsWhereOwner(variables: PoolsWhereOwnerQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<PoolsWhereOwnerQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<PoolsWhereOwnerQuery>(PoolsWhereOwnerDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'PoolsWhereOwner', 'query', variables);
    },
    PoolsWherePoolTypeInAndId(variables: PoolsWherePoolTypeInAndIdQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<PoolsWherePoolTypeInAndIdQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<PoolsWherePoolTypeInAndIdQuery>(PoolsWherePoolTypeInAndIdDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'PoolsWherePoolTypeInAndId', 'query', variables);
    },
    PoolsWherePoolType(variables?: PoolsWherePoolTypeQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<PoolsWherePoolTypeQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<PoolsWherePoolTypeQuery>(PoolsWherePoolTypeDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'PoolsWherePoolType', 'query', variables);
    },
    poolSnapshotInRange(variables: PoolSnapshotInRangeQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<PoolSnapshotInRangeQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<PoolSnapshotInRangeQuery>(PoolSnapshotInRangeDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'poolSnapshotInRange', 'query', variables);
    },
    Pool(variables: PoolQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<PoolQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<PoolQuery>(PoolDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Pool', 'query', variables);
    },
    PoolRateProviders(variables: PoolRateProvidersQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<PoolRateProvidersQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<PoolRateProvidersQuery>(PoolRateProvidersDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'PoolRateProviders', 'query', variables);
    },
    APRPools(variables: AprPoolsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<AprPoolsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AprPoolsQuery>(AprPoolsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'APRPools', 'query', variables);
    },
    weightedPoolsAboveLiquidityWithTokens(variables: WeightedPoolsAboveLiquidityWithTokensQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<WeightedPoolsAboveLiquidityWithTokensQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<WeightedPoolsAboveLiquidityWithTokensQuery>(WeightedPoolsAboveLiquidityWithTokensDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'weightedPoolsAboveLiquidityWithTokens', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;