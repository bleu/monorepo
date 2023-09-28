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

export type Block = {
  __typename?: 'Block';
  author?: Maybe<Scalars['String']['output']>;
  difficulty?: Maybe<Scalars['BigInt']['output']>;
  gasLimit?: Maybe<Scalars['BigInt']['output']>;
  gasUsed?: Maybe<Scalars['BigInt']['output']>;
  id: Scalars['ID']['output'];
  number: Scalars['BigInt']['output'];
  parentHash?: Maybe<Scalars['String']['output']>;
  receiptsRoot?: Maybe<Scalars['String']['output']>;
  size?: Maybe<Scalars['BigInt']['output']>;
  stateRoot?: Maybe<Scalars['String']['output']>;
  timestamp: Scalars['BigInt']['output'];
  totalDifficulty?: Maybe<Scalars['BigInt']['output']>;
  transactionsRoot?: Maybe<Scalars['String']['output']>;
  unclesHash?: Maybe<Scalars['String']['output']>;
};

export type BlockChangedFilter = {
  number_gte: Scalars['Int']['input'];
};

export type Block_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Block_Filter>>>;
  author?: InputMaybe<Scalars['String']['input']>;
  author_contains?: InputMaybe<Scalars['String']['input']>;
  author_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  author_ends_with?: InputMaybe<Scalars['String']['input']>;
  author_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  author_gt?: InputMaybe<Scalars['String']['input']>;
  author_gte?: InputMaybe<Scalars['String']['input']>;
  author_in?: InputMaybe<Array<Scalars['String']['input']>>;
  author_lt?: InputMaybe<Scalars['String']['input']>;
  author_lte?: InputMaybe<Scalars['String']['input']>;
  author_not?: InputMaybe<Scalars['String']['input']>;
  author_not_contains?: InputMaybe<Scalars['String']['input']>;
  author_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  author_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  author_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  author_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  author_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  author_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  author_starts_with?: InputMaybe<Scalars['String']['input']>;
  author_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  difficulty?: InputMaybe<Scalars['BigInt']['input']>;
  difficulty_gt?: InputMaybe<Scalars['BigInt']['input']>;
  difficulty_gte?: InputMaybe<Scalars['BigInt']['input']>;
  difficulty_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  difficulty_lt?: InputMaybe<Scalars['BigInt']['input']>;
  difficulty_lte?: InputMaybe<Scalars['BigInt']['input']>;
  difficulty_not?: InputMaybe<Scalars['BigInt']['input']>;
  difficulty_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  gasLimit?: InputMaybe<Scalars['BigInt']['input']>;
  gasLimit_gt?: InputMaybe<Scalars['BigInt']['input']>;
  gasLimit_gte?: InputMaybe<Scalars['BigInt']['input']>;
  gasLimit_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  gasLimit_lt?: InputMaybe<Scalars['BigInt']['input']>;
  gasLimit_lte?: InputMaybe<Scalars['BigInt']['input']>;
  gasLimit_not?: InputMaybe<Scalars['BigInt']['input']>;
  gasLimit_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  gasUsed?: InputMaybe<Scalars['BigInt']['input']>;
  gasUsed_gt?: InputMaybe<Scalars['BigInt']['input']>;
  gasUsed_gte?: InputMaybe<Scalars['BigInt']['input']>;
  gasUsed_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  gasUsed_lt?: InputMaybe<Scalars['BigInt']['input']>;
  gasUsed_lte?: InputMaybe<Scalars['BigInt']['input']>;
  gasUsed_not?: InputMaybe<Scalars['BigInt']['input']>;
  gasUsed_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  number?: InputMaybe<Scalars['BigInt']['input']>;
  number_gt?: InputMaybe<Scalars['BigInt']['input']>;
  number_gte?: InputMaybe<Scalars['BigInt']['input']>;
  number_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  number_lt?: InputMaybe<Scalars['BigInt']['input']>;
  number_lte?: InputMaybe<Scalars['BigInt']['input']>;
  number_not?: InputMaybe<Scalars['BigInt']['input']>;
  number_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  or?: InputMaybe<Array<InputMaybe<Block_Filter>>>;
  parentHash?: InputMaybe<Scalars['String']['input']>;
  parentHash_contains?: InputMaybe<Scalars['String']['input']>;
  parentHash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  parentHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  parentHash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  parentHash_gt?: InputMaybe<Scalars['String']['input']>;
  parentHash_gte?: InputMaybe<Scalars['String']['input']>;
  parentHash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  parentHash_lt?: InputMaybe<Scalars['String']['input']>;
  parentHash_lte?: InputMaybe<Scalars['String']['input']>;
  parentHash_not?: InputMaybe<Scalars['String']['input']>;
  parentHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  parentHash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  parentHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  parentHash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  parentHash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  parentHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  parentHash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  parentHash_starts_with?: InputMaybe<Scalars['String']['input']>;
  parentHash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  receiptsRoot?: InputMaybe<Scalars['String']['input']>;
  receiptsRoot_contains?: InputMaybe<Scalars['String']['input']>;
  receiptsRoot_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  receiptsRoot_ends_with?: InputMaybe<Scalars['String']['input']>;
  receiptsRoot_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  receiptsRoot_gt?: InputMaybe<Scalars['String']['input']>;
  receiptsRoot_gte?: InputMaybe<Scalars['String']['input']>;
  receiptsRoot_in?: InputMaybe<Array<Scalars['String']['input']>>;
  receiptsRoot_lt?: InputMaybe<Scalars['String']['input']>;
  receiptsRoot_lte?: InputMaybe<Scalars['String']['input']>;
  receiptsRoot_not?: InputMaybe<Scalars['String']['input']>;
  receiptsRoot_not_contains?: InputMaybe<Scalars['String']['input']>;
  receiptsRoot_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  receiptsRoot_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  receiptsRoot_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  receiptsRoot_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  receiptsRoot_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  receiptsRoot_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  receiptsRoot_starts_with?: InputMaybe<Scalars['String']['input']>;
  receiptsRoot_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['BigInt']['input']>;
  size_gt?: InputMaybe<Scalars['BigInt']['input']>;
  size_gte?: InputMaybe<Scalars['BigInt']['input']>;
  size_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  size_lt?: InputMaybe<Scalars['BigInt']['input']>;
  size_lte?: InputMaybe<Scalars['BigInt']['input']>;
  size_not?: InputMaybe<Scalars['BigInt']['input']>;
  size_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  stateRoot?: InputMaybe<Scalars['String']['input']>;
  stateRoot_contains?: InputMaybe<Scalars['String']['input']>;
  stateRoot_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  stateRoot_ends_with?: InputMaybe<Scalars['String']['input']>;
  stateRoot_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  stateRoot_gt?: InputMaybe<Scalars['String']['input']>;
  stateRoot_gte?: InputMaybe<Scalars['String']['input']>;
  stateRoot_in?: InputMaybe<Array<Scalars['String']['input']>>;
  stateRoot_lt?: InputMaybe<Scalars['String']['input']>;
  stateRoot_lte?: InputMaybe<Scalars['String']['input']>;
  stateRoot_not?: InputMaybe<Scalars['String']['input']>;
  stateRoot_not_contains?: InputMaybe<Scalars['String']['input']>;
  stateRoot_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  stateRoot_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  stateRoot_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  stateRoot_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  stateRoot_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  stateRoot_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  stateRoot_starts_with?: InputMaybe<Scalars['String']['input']>;
  stateRoot_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalDifficulty?: InputMaybe<Scalars['BigInt']['input']>;
  totalDifficulty_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalDifficulty_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalDifficulty_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalDifficulty_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalDifficulty_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalDifficulty_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalDifficulty_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transactionsRoot?: InputMaybe<Scalars['String']['input']>;
  transactionsRoot_contains?: InputMaybe<Scalars['String']['input']>;
  transactionsRoot_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionsRoot_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionsRoot_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionsRoot_gt?: InputMaybe<Scalars['String']['input']>;
  transactionsRoot_gte?: InputMaybe<Scalars['String']['input']>;
  transactionsRoot_in?: InputMaybe<Array<Scalars['String']['input']>>;
  transactionsRoot_lt?: InputMaybe<Scalars['String']['input']>;
  transactionsRoot_lte?: InputMaybe<Scalars['String']['input']>;
  transactionsRoot_not?: InputMaybe<Scalars['String']['input']>;
  transactionsRoot_not_contains?: InputMaybe<Scalars['String']['input']>;
  transactionsRoot_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionsRoot_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  transactionsRoot_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionsRoot_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  transactionsRoot_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionsRoot_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  transactionsRoot_starts_with?: InputMaybe<Scalars['String']['input']>;
  transactionsRoot_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  unclesHash?: InputMaybe<Scalars['String']['input']>;
  unclesHash_contains?: InputMaybe<Scalars['String']['input']>;
  unclesHash_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  unclesHash_ends_with?: InputMaybe<Scalars['String']['input']>;
  unclesHash_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  unclesHash_gt?: InputMaybe<Scalars['String']['input']>;
  unclesHash_gte?: InputMaybe<Scalars['String']['input']>;
  unclesHash_in?: InputMaybe<Array<Scalars['String']['input']>>;
  unclesHash_lt?: InputMaybe<Scalars['String']['input']>;
  unclesHash_lte?: InputMaybe<Scalars['String']['input']>;
  unclesHash_not?: InputMaybe<Scalars['String']['input']>;
  unclesHash_not_contains?: InputMaybe<Scalars['String']['input']>;
  unclesHash_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  unclesHash_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  unclesHash_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  unclesHash_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  unclesHash_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  unclesHash_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  unclesHash_starts_with?: InputMaybe<Scalars['String']['input']>;
  unclesHash_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  number?: InputMaybe<Scalars['Int']['input']>;
  number_gte?: InputMaybe<Scalars['Int']['input']>;
};

export type Block_OrderBy =
  | 'author'
  | 'difficulty'
  | 'gasLimit'
  | 'gasUsed'
  | 'id'
  | 'number'
  | 'parentHash'
  | 'receiptsRoot'
  | 'size'
  | 'stateRoot'
  | 'timestamp'
  | 'totalDifficulty'
  | 'transactionsRoot'
  | 'unclesHash'
  | '%future added value';

/** Defines the order direction, either ascending or descending */
export type OrderDirection =
  | 'asc'
  | 'desc'
  | '%future added value';

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  block?: Maybe<Block>;
  blocks: Array<Block>;
};


export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type QueryBlockArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryBlocksArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Block_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Block_Filter>;
};

export type Subscription = {
  __typename?: 'Subscription';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  block?: Maybe<Block>;
  blocks: Array<Block>;
};


export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};


export type SubscriptionBlockArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID']['input'];
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionBlocksArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Block_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Block_Filter>;
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

export type BlocksQueryVariables = Exact<{
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
}>;


export type BlocksQuery = { __typename?: 'Query', blocks: Array<{ __typename?: 'Block', number: any }> };


export const BlocksDocument = gql`
    query Blocks($timestamp_gte: BigInt, $timestamp_lt: BigInt) {
  blocks(
    first: 1
    orderBy: number
    orderDirection: asc
    where: {timestamp_gte: $timestamp_gte, timestamp_lt: $timestamp_lt}
  ) {
    number
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    Blocks(variables?: BlocksQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<BlocksQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<BlocksQuery>(BlocksDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Blocks', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;
export function getSdkWithHooks(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  const sdk = getSdk(client, withWrapper);
  const genKey = <V extends Record<string, unknown> = Record<string, unknown>>(name: string, object: V = {} as V): SWRKeyInterface => [name, ...Object.keys(object).sort().map(key => object[key])];
  return {
    ...sdk,
    useBlocks(variables?: BlocksQueryVariables, config?: SWRConfigInterface<BlocksQuery, ClientError>) {
      return useSWR<BlocksQuery, ClientError>(genKey<BlocksQueryVariables>('Blocks', variables), () => sdk.Blocks(variables), config);
    }
  };
}
export type SdkWithHooks = ReturnType<typeof getSdkWithHooks>;