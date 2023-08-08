import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: any;
  BigInt: any;
  Bytes: any;
  Int8: any;
};

export type BlockChangedFilter = {
  number_gte: Scalars['Int'];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']>;
  number?: InputMaybe<Scalars['Int']>;
  number_gte?: InputMaybe<Scalars['Int']>;
};

/** Defines the order direction, either ascending or descending */
export type OrderDirection =
  | 'asc'
  | 'desc'
  | '%future added value';

export type Pool = {
  __typename?: 'Pool';
  /**  Address of the Pool  */
  address: Scalars['Bytes'];
  /**  Pool's poolId  */
  id: Scalars['ID'];
  /**  The sender of the latest PoolMetadataUpdate event  */
  latestUpdatedBy: Scalars['Bytes'];
  /**  IPFS CID of the latest PoolMetadataUpdate  */
  metadataCID: Scalars['String'];
  /**  List of the Pool's metadata updates  */
  metadataUpdates?: Maybe<Array<PoolMetadataUpdate>>;
};


export type PoolMetadataUpdatesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PoolMetadataUpdate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<PoolMetadataUpdate_Filter>;
};

export type PoolMetadataUpdate = {
  __typename?: 'PoolMetadataUpdate';
  /**  Blocknumber of this PoolMetadataUpdate  */
  blockNumber: Scalars['BigInt'];
  /**  Timestamp of this block  */
  blockTimestamp: Scalars['BigInt'];
  /**  PoolMetadataUpdated contract address  */
  id: Scalars['ID'];
  /**  IPFS CID of the PoolMetadataUpdate  */
  metadataCID: Scalars['String'];
  /**  Reference to Pool entity  */
  pool: Pool;
  /**  The address of who sent the update transaction  */
  sender: Scalars['Bytes'];
  /**  Address of the PoolMetadataUpdate transaction  */
  transactionHash: Scalars['Bytes'];
};

export type PoolMetadataUpdate_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<PoolMetadataUpdate_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  metadataCID?: InputMaybe<Scalars['String']>;
  metadataCID_contains?: InputMaybe<Scalars['String']>;
  metadataCID_contains_nocase?: InputMaybe<Scalars['String']>;
  metadataCID_ends_with?: InputMaybe<Scalars['String']>;
  metadataCID_ends_with_nocase?: InputMaybe<Scalars['String']>;
  metadataCID_gt?: InputMaybe<Scalars['String']>;
  metadataCID_gte?: InputMaybe<Scalars['String']>;
  metadataCID_in?: InputMaybe<Array<Scalars['String']>>;
  metadataCID_lt?: InputMaybe<Scalars['String']>;
  metadataCID_lte?: InputMaybe<Scalars['String']>;
  metadataCID_not?: InputMaybe<Scalars['String']>;
  metadataCID_not_contains?: InputMaybe<Scalars['String']>;
  metadataCID_not_contains_nocase?: InputMaybe<Scalars['String']>;
  metadataCID_not_ends_with?: InputMaybe<Scalars['String']>;
  metadataCID_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  metadataCID_not_in?: InputMaybe<Array<Scalars['String']>>;
  metadataCID_not_starts_with?: InputMaybe<Scalars['String']>;
  metadataCID_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  metadataCID_starts_with?: InputMaybe<Scalars['String']>;
  metadataCID_starts_with_nocase?: InputMaybe<Scalars['String']>;
  or?: InputMaybe<Array<InputMaybe<PoolMetadataUpdate_Filter>>>;
  pool?: InputMaybe<Scalars['String']>;
  pool_?: InputMaybe<Pool_Filter>;
  pool_contains?: InputMaybe<Scalars['String']>;
  pool_contains_nocase?: InputMaybe<Scalars['String']>;
  pool_ends_with?: InputMaybe<Scalars['String']>;
  pool_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pool_gt?: InputMaybe<Scalars['String']>;
  pool_gte?: InputMaybe<Scalars['String']>;
  pool_in?: InputMaybe<Array<Scalars['String']>>;
  pool_lt?: InputMaybe<Scalars['String']>;
  pool_lte?: InputMaybe<Scalars['String']>;
  pool_not?: InputMaybe<Scalars['String']>;
  pool_not_contains?: InputMaybe<Scalars['String']>;
  pool_not_contains_nocase?: InputMaybe<Scalars['String']>;
  pool_not_ends_with?: InputMaybe<Scalars['String']>;
  pool_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  pool_not_in?: InputMaybe<Array<Scalars['String']>>;
  pool_not_starts_with?: InputMaybe<Scalars['String']>;
  pool_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  pool_starts_with?: InputMaybe<Scalars['String']>;
  pool_starts_with_nocase?: InputMaybe<Scalars['String']>;
  sender?: InputMaybe<Scalars['Bytes']>;
  sender_contains?: InputMaybe<Scalars['Bytes']>;
  sender_gt?: InputMaybe<Scalars['Bytes']>;
  sender_gte?: InputMaybe<Scalars['Bytes']>;
  sender_in?: InputMaybe<Array<Scalars['Bytes']>>;
  sender_lt?: InputMaybe<Scalars['Bytes']>;
  sender_lte?: InputMaybe<Scalars['Bytes']>;
  sender_not?: InputMaybe<Scalars['Bytes']>;
  sender_not_contains?: InputMaybe<Scalars['Bytes']>;
  sender_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export type PoolMetadataUpdate_OrderBy =
  | 'blockNumber'
  | 'blockTimestamp'
  | 'id'
  | 'metadataCID'
  | 'pool'
  | 'pool__address'
  | 'pool__id'
  | 'pool__latestUpdatedBy'
  | 'pool__metadataCID'
  | 'sender'
  | 'transactionHash'
  | '%future added value';

export type Pool_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  address?: InputMaybe<Scalars['Bytes']>;
  address_contains?: InputMaybe<Scalars['Bytes']>;
  address_gt?: InputMaybe<Scalars['Bytes']>;
  address_gte?: InputMaybe<Scalars['Bytes']>;
  address_in?: InputMaybe<Array<Scalars['Bytes']>>;
  address_lt?: InputMaybe<Scalars['Bytes']>;
  address_lte?: InputMaybe<Scalars['Bytes']>;
  address_not?: InputMaybe<Scalars['Bytes']>;
  address_not_contains?: InputMaybe<Scalars['Bytes']>;
  address_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  and?: InputMaybe<Array<InputMaybe<Pool_Filter>>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  latestUpdatedBy?: InputMaybe<Scalars['Bytes']>;
  latestUpdatedBy_contains?: InputMaybe<Scalars['Bytes']>;
  latestUpdatedBy_gt?: InputMaybe<Scalars['Bytes']>;
  latestUpdatedBy_gte?: InputMaybe<Scalars['Bytes']>;
  latestUpdatedBy_in?: InputMaybe<Array<Scalars['Bytes']>>;
  latestUpdatedBy_lt?: InputMaybe<Scalars['Bytes']>;
  latestUpdatedBy_lte?: InputMaybe<Scalars['Bytes']>;
  latestUpdatedBy_not?: InputMaybe<Scalars['Bytes']>;
  latestUpdatedBy_not_contains?: InputMaybe<Scalars['Bytes']>;
  latestUpdatedBy_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  metadataCID?: InputMaybe<Scalars['String']>;
  metadataCID_contains?: InputMaybe<Scalars['String']>;
  metadataCID_contains_nocase?: InputMaybe<Scalars['String']>;
  metadataCID_ends_with?: InputMaybe<Scalars['String']>;
  metadataCID_ends_with_nocase?: InputMaybe<Scalars['String']>;
  metadataCID_gt?: InputMaybe<Scalars['String']>;
  metadataCID_gte?: InputMaybe<Scalars['String']>;
  metadataCID_in?: InputMaybe<Array<Scalars['String']>>;
  metadataCID_lt?: InputMaybe<Scalars['String']>;
  metadataCID_lte?: InputMaybe<Scalars['String']>;
  metadataCID_not?: InputMaybe<Scalars['String']>;
  metadataCID_not_contains?: InputMaybe<Scalars['String']>;
  metadataCID_not_contains_nocase?: InputMaybe<Scalars['String']>;
  metadataCID_not_ends_with?: InputMaybe<Scalars['String']>;
  metadataCID_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  metadataCID_not_in?: InputMaybe<Array<Scalars['String']>>;
  metadataCID_not_starts_with?: InputMaybe<Scalars['String']>;
  metadataCID_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  metadataCID_starts_with?: InputMaybe<Scalars['String']>;
  metadataCID_starts_with_nocase?: InputMaybe<Scalars['String']>;
  metadataUpdates_?: InputMaybe<PoolMetadataUpdate_Filter>;
  or?: InputMaybe<Array<InputMaybe<Pool_Filter>>>;
};

export type Pool_OrderBy =
  | 'address'
  | 'id'
  | 'latestUpdatedBy'
  | 'metadataCID'
  | 'metadataUpdates'
  | '%future added value';

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  pool?: Maybe<Pool>;
  poolMetadataUpdate?: Maybe<PoolMetadataUpdate>;
  poolMetadataUpdates: Array<PoolMetadataUpdate>;
  pools: Array<Pool>;
};


export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type QueryPoolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPoolMetadataUpdateArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPoolMetadataUpdatesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PoolMetadataUpdate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PoolMetadataUpdate_Filter>;
};


export type QueryPoolsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Pool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Pool_Filter>;
};

export type Subscription = {
  __typename?: 'Subscription';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  pool?: Maybe<Pool>;
  poolMetadataUpdate?: Maybe<PoolMetadataUpdate>;
  poolMetadataUpdates: Array<PoolMetadataUpdate>;
  pools: Array<Pool>;
};


export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type SubscriptionPoolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPoolMetadataUpdateArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPoolMetadataUpdatesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PoolMetadataUpdate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PoolMetadataUpdate_Filter>;
};


export type SubscriptionPoolsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Pool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Pool_Filter>;
};

export type _Block_ = {
  __typename?: '_Block_';
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']>;
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
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
};

export type _SubgraphErrorPolicy_ =
  /** Data will be returned even if the subgraph has indexing errors */
  | 'allow'
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  | 'deny'
  | '%future added value';

export type MetadataPoolQueryVariables = Exact<{
  poolId?: InputMaybe<Scalars['ID']>;
}>;


export type MetadataPoolQuery = { __typename?: 'Query', pools: Array<{ __typename?: 'Pool', id: string, address: any, metadataCID: string }> };


export const MetadataPoolDocument = gql`
    query MetadataPool($poolId: ID) {
  pools(where: {id: $poolId}) {
    id
    address
    metadataCID
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    MetadataPool(variables?: MetadataPoolQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<MetadataPoolQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<MetadataPoolQuery>(MetadataPoolDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'MetadataPool', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;