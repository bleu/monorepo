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

/** Defines the order direction, either ascending or descending */
export type OrderDirection =
  | 'asc'
  | 'desc'
  | '%future added value';

export type Pool = {
  __typename?: 'Pool';
  /**  Address of the Pool  */
  address: Scalars['Bytes']['output'];
  /**  Pool's poolId  */
  id: Scalars['ID']['output'];
  /**  The sender of the latest PoolMetadataUpdate event  */
  latestUpdatedBy: Scalars['Bytes']['output'];
  /**  IPFS CID of the latest PoolMetadataUpdate  */
  metadataCID: Scalars['String']['output'];
  /**  List of the Pool's metadata updates  */
  metadataUpdates?: Maybe<Array<PoolMetadataUpdate>>;
};


export type PoolMetadataUpdatesArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolMetadataUpdate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<PoolMetadataUpdate_Filter>;
};

export type PoolMetadataUpdate = {
  __typename?: 'PoolMetadataUpdate';
  /**  Blocknumber of this PoolMetadataUpdate  */
  blockNumber: Scalars['BigInt']['output'];
  /**  Timestamp of this block  */
  blockTimestamp: Scalars['BigInt']['output'];
  /**  PoolMetadataUpdated contract address  */
  id: Scalars['ID']['output'];
  /**  IPFS CID of the PoolMetadataUpdate  */
  metadataCID: Scalars['String']['output'];
  /**  Reference to Pool entity  */
  pool: Pool;
  /**  The address of who sent the update transaction  */
  sender: Scalars['Bytes']['output'];
  /**  Address of the PoolMetadataUpdate transaction  */
  transactionHash: Scalars['Bytes']['output'];
};

export type PoolMetadataUpdate_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<PoolMetadataUpdate_Filter>>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  metadataCID?: InputMaybe<Scalars['String']['input']>;
  metadataCID_contains?: InputMaybe<Scalars['String']['input']>;
  metadataCID_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  metadataCID_ends_with?: InputMaybe<Scalars['String']['input']>;
  metadataCID_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadataCID_gt?: InputMaybe<Scalars['String']['input']>;
  metadataCID_gte?: InputMaybe<Scalars['String']['input']>;
  metadataCID_in?: InputMaybe<Array<Scalars['String']['input']>>;
  metadataCID_lt?: InputMaybe<Scalars['String']['input']>;
  metadataCID_lte?: InputMaybe<Scalars['String']['input']>;
  metadataCID_not?: InputMaybe<Scalars['String']['input']>;
  metadataCID_not_contains?: InputMaybe<Scalars['String']['input']>;
  metadataCID_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  metadataCID_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  metadataCID_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadataCID_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  metadataCID_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  metadataCID_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadataCID_starts_with?: InputMaybe<Scalars['String']['input']>;
  metadataCID_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<InputMaybe<PoolMetadataUpdate_Filter>>>;
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
  transactionHash?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
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
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  latestUpdatedBy?: InputMaybe<Scalars['Bytes']['input']>;
  latestUpdatedBy_contains?: InputMaybe<Scalars['Bytes']['input']>;
  latestUpdatedBy_gt?: InputMaybe<Scalars['Bytes']['input']>;
  latestUpdatedBy_gte?: InputMaybe<Scalars['Bytes']['input']>;
  latestUpdatedBy_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  latestUpdatedBy_lt?: InputMaybe<Scalars['Bytes']['input']>;
  latestUpdatedBy_lte?: InputMaybe<Scalars['Bytes']['input']>;
  latestUpdatedBy_not?: InputMaybe<Scalars['Bytes']['input']>;
  latestUpdatedBy_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  latestUpdatedBy_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  metadataCID?: InputMaybe<Scalars['String']['input']>;
  metadataCID_contains?: InputMaybe<Scalars['String']['input']>;
  metadataCID_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  metadataCID_ends_with?: InputMaybe<Scalars['String']['input']>;
  metadataCID_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadataCID_gt?: InputMaybe<Scalars['String']['input']>;
  metadataCID_gte?: InputMaybe<Scalars['String']['input']>;
  metadataCID_in?: InputMaybe<Array<Scalars['String']['input']>>;
  metadataCID_lt?: InputMaybe<Scalars['String']['input']>;
  metadataCID_lte?: InputMaybe<Scalars['String']['input']>;
  metadataCID_not?: InputMaybe<Scalars['String']['input']>;
  metadataCID_not_contains?: InputMaybe<Scalars['String']['input']>;
  metadataCID_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  metadataCID_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  metadataCID_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadataCID_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  metadataCID_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  metadataCID_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  metadataCID_starts_with?: InputMaybe<Scalars['String']['input']>;
  metadataCID_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
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
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPoolMetadataUpdateArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPoolMetadataUpdatesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolMetadataUpdate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PoolMetadataUpdate_Filter>;
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
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPoolMetadataUpdateArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPoolMetadataUpdatesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PoolMetadataUpdate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PoolMetadataUpdate_Filter>;
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

export type MetadataPoolQueryVariables = Exact<{
  poolId?: InputMaybe<Scalars['ID']['input']>;
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

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    MetadataPool(variables?: MetadataPoolQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<MetadataPoolQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<MetadataPoolQuery>(MetadataPoolDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'MetadataPool', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;
export function getSdkWithHooks(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  const sdk = getSdk(client, withWrapper);
  const genKey = <V extends Record<string, unknown> = Record<string, unknown>>(name: string, object: V = {} as V): SWRKeyInterface => [name, ...Object.keys(object).sort().map(key => object[key])];
  return {
    ...sdk,
    useMetadataPool(variables?: MetadataPoolQueryVariables, config?: SWRConfigInterface<MetadataPoolQuery, ClientError>) {
      return useSWR<MetadataPoolQuery, ClientError>(genKey<MetadataPoolQueryVariables>('MetadataPool', variables), () => sdk.MetadataPool(variables), config);
    }
  };
}
export type SdkWithHooks = ReturnType<typeof getSdkWithHooks>;