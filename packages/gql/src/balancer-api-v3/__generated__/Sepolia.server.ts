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
  AmountHumanReadable: { input: any; output: any; }
  BigDecimal: { input: any; output: any; }
  BigInt: { input: any; output: any; }
  Bytes: { input: any; output: any; }
  Date: { input: any; output: any; }
  GqlBigNumber: { input: any; output: any; }
  JSON: { input: any; output: any; }
};

export type GqlBalancePoolAprItem = {
  __typename?: 'GqlBalancePoolAprItem';
  apr: GqlPoolAprValue;
  id: Scalars['ID']['output'];
  subItems?: Maybe<Array<GqlBalancePoolAprSubItem>>;
  title: Scalars['String']['output'];
};

export type GqlBalancePoolAprSubItem = {
  __typename?: 'GqlBalancePoolAprSubItem';
  apr: GqlPoolAprValue;
  id: Scalars['ID']['output'];
  title: Scalars['String']['output'];
};

export type GqlChain =
  | 'ARBITRUM'
  | 'AVALANCHE'
  | 'BASE'
  | 'FANTOM'
  | 'GNOSIS'
  | 'MAINNET'
  | 'OPTIMISM'
  | 'POLYGON'
  | 'SEPOLIA'
  | 'ZKEVM'
  | '%future added value';

export type GqlContentNewsItem = {
  __typename?: 'GqlContentNewsItem';
  discussionUrl?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  source: GqlContentNewsItemSource;
  text: Scalars['String']['output'];
  timestamp: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type GqlContentNewsItemSource =
  | 'discord'
  | 'medium'
  | 'twitter'
  | '%future added value';

export type GqlFeaturePoolGroupItemExternalLink = {
  __typename?: 'GqlFeaturePoolGroupItemExternalLink';
  buttonText: Scalars['String']['output'];
  buttonUrl: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  image: Scalars['String']['output'];
};

/** Configuration options for SOR V2 */
export type GqlGraphTraversalConfigInput = {
  /**
   * Max number of paths to return (can be less)
   *
   * Default: 5
   */
  approxPathsToReturn?: InputMaybe<Scalars['Int']['input']>;
  /**
   * The max hops in a path.
   *
   * Default: 6
   */
  maxDepth?: InputMaybe<Scalars['Int']['input']>;
  /**
   * Limit non boosted hop tokens in a boosted path.
   *
   * Default: 2
   */
  maxNonBoostedHopTokensInBoostedPath?: InputMaybe<Scalars['Int']['input']>;
  /**
   * Limit of "non-boosted" pools for efficiency.
   *
   * Default: 6
   */
  maxNonBoostedPathDepth?: InputMaybe<Scalars['Int']['input']>;
  poolIdsToInclude?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type GqlHistoricalTokenPrice = {
  __typename?: 'GqlHistoricalTokenPrice';
  address: Scalars['String']['output'];
  chain: GqlChain;
  prices: Array<GqlHistoricalTokenPriceEntry>;
};

export type GqlHistoricalTokenPriceEntry = {
  __typename?: 'GqlHistoricalTokenPriceEntry';
  price: Scalars['Float']['output'];
  timestamp: Scalars['String']['output'];
  updatedAt: Scalars['Int']['output'];
  updatedBy?: Maybe<Scalars['String']['output']>;
};

export type GqlLatestSyncedBlocks = {
  __typename?: 'GqlLatestSyncedBlocks';
  poolSyncBlock: Scalars['BigInt']['output'];
  userStakeSyncBlock: Scalars['BigInt']['output'];
  userWalletSyncBlock: Scalars['BigInt']['output'];
};

export type GqlNestedPool = {
  __typename?: 'GqlNestedPool';
  address: Scalars['Bytes']['output'];
  bptPriceRate: Scalars['BigDecimal']['output'];
  createTime: Scalars['Int']['output'];
  factory?: Maybe<Scalars['Bytes']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  nestedLiquidity: Scalars['BigDecimal']['output'];
  nestedPercentage: Scalars['BigDecimal']['output'];
  nestedShares: Scalars['BigDecimal']['output'];
  owner: Scalars['Bytes']['output'];
  swapFee: Scalars['BigDecimal']['output'];
  symbol: Scalars['String']['output'];
  tokens: Array<GqlPoolTokenDetail>;
  totalLiquidity: Scalars['BigDecimal']['output'];
  totalShares: Scalars['BigDecimal']['output'];
  type: GqlPoolType;
  version: Scalars['Int']['output'];
};

export type GqlPoolAddRemoveEventV3 = GqlPoolEvent & {
  __typename?: 'GqlPoolAddRemoveEventV3';
  blockNumber: Scalars['Int']['output'];
  blockTimestamp: Scalars['Int']['output'];
  chain: GqlChain;
  id: Scalars['ID']['output'];
  logIndex: Scalars['Int']['output'];
  poolId: Scalars['String']['output'];
  sender: Scalars['String']['output'];
  timestamp: Scalars['Int']['output'];
  tokens: Array<GqlPoolEventAmount>;
  tx: Scalars['String']['output'];
  type: GqlPoolEventType;
  userAddress: Scalars['String']['output'];
  valueUSD: Scalars['Float']['output'];
};

export type GqlPoolApr = {
  __typename?: 'GqlPoolApr';
  apr: GqlPoolAprValue;
  hasRewardApr: Scalars['Boolean']['output'];
  items: Array<GqlBalancePoolAprItem>;
  nativeRewardApr: GqlPoolAprValue;
  swapApr: Scalars['BigDecimal']['output'];
  thirdPartyApr: GqlPoolAprValue;
};

export type GqlPoolAprRange = {
  __typename?: 'GqlPoolAprRange';
  max: Scalars['BigDecimal']['output'];
  min: Scalars['BigDecimal']['output'];
};

export type GqlPoolAprTotal = {
  __typename?: 'GqlPoolAprTotal';
  total: Scalars['BigDecimal']['output'];
};

export type GqlPoolAprValue = GqlPoolAprRange | GqlPoolAprTotal;

/** The base type as returned by poolGetPool (specific pool query) */
export type GqlPoolBase = {
  /** The contract address of the pool. */
  address: Scalars['Bytes']['output'];
  /** Returns all pool tokens, including any nested tokens and phantom BPTs on one level. */
  allTokens: Array<GqlPoolTokenExpanded>;
  /** The chain on which the pool is deployed */
  chain: GqlChain;
  /** The timestamp the pool was created. */
  createTime: Scalars['Int']['output'];
  /** The decimals of the BPT, usually 18 */
  decimals: Scalars['Int']['output'];
  /** Only returns main tokens, also known as leave tokens. Wont return any nested BPTs. Used for displaying the tokens that the pool consists of. */
  displayTokens: Array<GqlPoolTokenDisplay>;
  /** Dynamic data such as token balances, swap fees or volume */
  dynamicData: GqlPoolDynamicData;
  /** The factory contract address from which the pool was created. */
  factory?: Maybe<Scalars['Bytes']['output']>;
  /** The pool id. This is equal to the address for vaultVersion 3 pools */
  id: Scalars['ID']['output'];
  /** Deprecated */
  investConfig: GqlPoolInvestConfig;
  /** The name of the pool as per contract */
  name: Scalars['String']['output'];
  /** The wallet address of the owner of the pool. Pool owners can set certain properties like swapFees or AMP. */
  owner?: Maybe<Scalars['Bytes']['output']>;
  /** Returns all pool tokens, including BPTs and nested pools if there are any. Only one nested level deep. */
  poolTokens: Array<GqlPoolTokenDetail>;
  /** Staking options of this pool which emit additional rewards */
  staking?: Maybe<GqlPoolStaking>;
  /** The token symbol of the pool as per contract */
  symbol: Scalars['String']['output'];
  /** The pool type, such as weighted, stable, etc. */
  type: GqlPoolType;
  /** If a user address was provided in the query, the user balance is populated here */
  userBalance?: Maybe<GqlPoolUserBalance>;
  /** The vault version on which the pool is deployed, 2 or 3 */
  vaultVersion: Scalars['Int']['output'];
  /** The version of the pool type. */
  version: Scalars['Int']['output'];
  /** Deprecated */
  withdrawConfig: GqlPoolWithdrawConfig;
};

export type GqlPoolBatchSwap = {
  __typename?: 'GqlPoolBatchSwap';
  chain: GqlChain;
  id: Scalars['ID']['output'];
  swaps: Array<GqlPoolBatchSwapSwap>;
  timestamp: Scalars['Int']['output'];
  tokenAmountIn: Scalars['String']['output'];
  tokenAmountOut: Scalars['String']['output'];
  tokenIn: Scalars['String']['output'];
  tokenInPrice: Scalars['Float']['output'];
  tokenOut: Scalars['String']['output'];
  tokenOutPrice: Scalars['Float']['output'];
  tx: Scalars['String']['output'];
  userAddress: Scalars['String']['output'];
  valueUSD: Scalars['Float']['output'];
};

export type GqlPoolBatchSwapPool = {
  __typename?: 'GqlPoolBatchSwapPool';
  id: Scalars['ID']['output'];
  tokens: Array<Scalars['String']['output']>;
};

export type GqlPoolBatchSwapSwap = {
  __typename?: 'GqlPoolBatchSwapSwap';
  id: Scalars['ID']['output'];
  pool: GqlPoolMinimal;
  timestamp: Scalars['Int']['output'];
  tokenAmountIn: Scalars['String']['output'];
  tokenAmountOut: Scalars['String']['output'];
  tokenIn: Scalars['String']['output'];
  tokenOut: Scalars['String']['output'];
  tx: Scalars['String']['output'];
  userAddress: Scalars['String']['output'];
  valueUSD: Scalars['Float']['output'];
};

export type GqlPoolComposableStable = GqlPoolBase & {
  __typename?: 'GqlPoolComposableStable';
  address: Scalars['Bytes']['output'];
  allTokens: Array<GqlPoolTokenExpanded>;
  amp: Scalars['BigInt']['output'];
  bptPriceRate: Scalars['BigDecimal']['output'];
  chain: GqlChain;
  createTime: Scalars['Int']['output'];
  decimals: Scalars['Int']['output'];
  displayTokens: Array<GqlPoolTokenDisplay>;
  dynamicData: GqlPoolDynamicData;
  factory?: Maybe<Scalars['Bytes']['output']>;
  id: Scalars['ID']['output'];
  investConfig: GqlPoolInvestConfig;
  name: Scalars['String']['output'];
  nestingType: GqlPoolNestingType;
  owner: Scalars['Bytes']['output'];
  poolTokens: Array<GqlPoolTokenDetail>;
  staking?: Maybe<GqlPoolStaking>;
  symbol: Scalars['String']['output'];
  tokens: Array<GqlPoolTokenUnion>;
  type: GqlPoolType;
  userBalance?: Maybe<GqlPoolUserBalance>;
  vaultVersion: Scalars['Int']['output'];
  version: Scalars['Int']['output'];
  withdrawConfig: GqlPoolWithdrawConfig;
};

export type GqlPoolComposableStableNested = {
  __typename?: 'GqlPoolComposableStableNested';
  address: Scalars['Bytes']['output'];
  amp: Scalars['BigInt']['output'];
  bptPriceRate: Scalars['BigDecimal']['output'];
  createTime: Scalars['Int']['output'];
  factory?: Maybe<Scalars['Bytes']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  nestingType: GqlPoolNestingType;
  owner: Scalars['Bytes']['output'];
  swapFee: Scalars['BigDecimal']['output'];
  symbol: Scalars['String']['output'];
  tokens: Array<GqlPoolTokenComposableStableNestedUnion>;
  totalLiquidity: Scalars['BigDecimal']['output'];
  totalShares: Scalars['BigDecimal']['output'];
  type: GqlPoolType;
  version: Scalars['Int']['output'];
};

export type GqlPoolDynamicData = {
  __typename?: 'GqlPoolDynamicData';
  apr: GqlPoolApr;
  fees24h: Scalars['BigDecimal']['output'];
  fees24hAth: Scalars['BigDecimal']['output'];
  fees24hAthTimestamp: Scalars['Int']['output'];
  fees24hAtl: Scalars['BigDecimal']['output'];
  fees24hAtlTimestamp: Scalars['Int']['output'];
  fees48h: Scalars['BigDecimal']['output'];
  holdersCount: Scalars['BigInt']['output'];
  isInRecoveryMode: Scalars['Boolean']['output'];
  isPaused: Scalars['Boolean']['output'];
  lifetimeSwapFees: Scalars['BigDecimal']['output'];
  lifetimeVolume: Scalars['BigDecimal']['output'];
  poolId: Scalars['ID']['output'];
  sharePriceAth: Scalars['BigDecimal']['output'];
  sharePriceAthTimestamp: Scalars['Int']['output'];
  sharePriceAtl: Scalars['BigDecimal']['output'];
  sharePriceAtlTimestamp: Scalars['Int']['output'];
  swapEnabled: Scalars['Boolean']['output'];
  swapFee: Scalars['BigDecimal']['output'];
  swapsCount: Scalars['BigInt']['output'];
  totalLiquidity: Scalars['BigDecimal']['output'];
  totalLiquidity24hAgo: Scalars['BigDecimal']['output'];
  totalLiquidityAth: Scalars['BigDecimal']['output'];
  totalLiquidityAthTimestamp: Scalars['Int']['output'];
  totalLiquidityAtl: Scalars['BigDecimal']['output'];
  totalLiquidityAtlTimestamp: Scalars['Int']['output'];
  totalShares: Scalars['BigDecimal']['output'];
  totalShares24hAgo: Scalars['BigDecimal']['output'];
  volume24h: Scalars['BigDecimal']['output'];
  volume24hAth: Scalars['BigDecimal']['output'];
  volume24hAthTimestamp: Scalars['Int']['output'];
  volume24hAtl: Scalars['BigDecimal']['output'];
  volume24hAtlTimestamp: Scalars['Int']['output'];
  volume48h: Scalars['BigDecimal']['output'];
  yieldCapture24h: Scalars['BigDecimal']['output'];
  yieldCapture48h: Scalars['BigDecimal']['output'];
};

export type GqlPoolElement = GqlPoolBase & {
  __typename?: 'GqlPoolElement';
  address: Scalars['Bytes']['output'];
  allTokens: Array<GqlPoolTokenExpanded>;
  baseToken: Scalars['Bytes']['output'];
  chain: GqlChain;
  createTime: Scalars['Int']['output'];
  decimals: Scalars['Int']['output'];
  displayTokens: Array<GqlPoolTokenDisplay>;
  dynamicData: GqlPoolDynamicData;
  factory?: Maybe<Scalars['Bytes']['output']>;
  id: Scalars['ID']['output'];
  investConfig: GqlPoolInvestConfig;
  name: Scalars['String']['output'];
  owner: Scalars['Bytes']['output'];
  poolTokens: Array<GqlPoolTokenDetail>;
  principalToken: Scalars['Bytes']['output'];
  staking?: Maybe<GqlPoolStaking>;
  symbol: Scalars['String']['output'];
  tokens: Array<GqlPoolToken>;
  type: GqlPoolType;
  unitSeconds: Scalars['BigInt']['output'];
  userBalance?: Maybe<GqlPoolUserBalance>;
  vaultVersion: Scalars['Int']['output'];
  version: Scalars['Int']['output'];
  withdrawConfig: GqlPoolWithdrawConfig;
};

export type GqlPoolEvent = {
  blockNumber: Scalars['Int']['output'];
  blockTimestamp: Scalars['Int']['output'];
  chain: GqlChain;
  id: Scalars['ID']['output'];
  logIndex: Scalars['Int']['output'];
  poolId: Scalars['String']['output'];
  sender: Scalars['String']['output'];
  timestamp: Scalars['Int']['output'];
  tx: Scalars['String']['output'];
  type: GqlPoolEventType;
  userAddress: Scalars['String']['output'];
  valueUSD: Scalars['Float']['output'];
};

export type GqlPoolEventAmount = {
  __typename?: 'GqlPoolEventAmount';
  address: Scalars['String']['output'];
  amount: Scalars['String']['output'];
  valueUSD: Scalars['Float']['output'];
};

export type GqlPoolEventType =
  | 'ADD'
  | 'REMOVE'
  | 'SWAP'
  | '%future added value';

export type GqlPoolEventsDataRange =
  | 'NINETY_DAYS'
  | 'SEVEN_DAYS'
  | 'THIRTY_DAYS'
  | '%future added value';

export type GqlPoolEventsFilter = {
  chain: GqlChain;
  poolId: Scalars['String']['input'];
  range?: InputMaybe<GqlPoolEventsDataRange>;
  typeIn?: InputMaybe<Array<InputMaybe<GqlPoolEventType>>>;
  userAddress?: InputMaybe<Scalars['String']['input']>;
};

export type GqlPoolFeaturedPool = {
  __typename?: 'GqlPoolFeaturedPool';
  description: Scalars['String']['output'];
  pool: GqlPoolBase;
  poolId: Scalars['ID']['output'];
  primary: Scalars['Boolean']['output'];
};

export type GqlPoolFeaturedPoolGroup = {
  __typename?: 'GqlPoolFeaturedPoolGroup';
  icon: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  items: Array<GqlPoolFeaturedPoolGroupItem>;
  title: Scalars['String']['output'];
};

export type GqlPoolFeaturedPoolGroupItem = GqlFeaturePoolGroupItemExternalLink | GqlPoolMinimal;

export type GqlPoolFilter = {
  categoryIn?: InputMaybe<Array<GqlPoolFilterCategory>>;
  categoryNotIn?: InputMaybe<Array<GqlPoolFilterCategory>>;
  chainIn?: InputMaybe<Array<GqlChain>>;
  chainNotIn?: InputMaybe<Array<GqlChain>>;
  createTime?: InputMaybe<GqlPoolTimePeriod>;
  filterIn?: InputMaybe<Array<Scalars['String']['input']>>;
  filterNotIn?: InputMaybe<Array<Scalars['String']['input']>>;
  idIn?: InputMaybe<Array<Scalars['String']['input']>>;
  idNotIn?: InputMaybe<Array<Scalars['String']['input']>>;
  minTvl?: InputMaybe<Scalars['Float']['input']>;
  poolTypeIn?: InputMaybe<Array<GqlPoolType>>;
  poolTypeNotIn?: InputMaybe<Array<GqlPoolType>>;
  tokensIn?: InputMaybe<Array<Scalars['String']['input']>>;
  tokensNotIn?: InputMaybe<Array<Scalars['String']['input']>>;
  userAddress?: InputMaybe<Scalars['String']['input']>;
  vaultVersionIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type GqlPoolFilterCategory =
  | 'BLACK_LISTED'
  | 'INCENTIVIZED'
  | '%future added value';

export type GqlPoolFx = GqlPoolBase & {
  __typename?: 'GqlPoolFx';
  address: Scalars['Bytes']['output'];
  allTokens: Array<GqlPoolTokenExpanded>;
  alpha: Scalars['String']['output'];
  beta: Scalars['String']['output'];
  chain: GqlChain;
  createTime: Scalars['Int']['output'];
  decimals: Scalars['Int']['output'];
  delta: Scalars['String']['output'];
  displayTokens: Array<GqlPoolTokenDisplay>;
  dynamicData: GqlPoolDynamicData;
  epsilon: Scalars['String']['output'];
  factory?: Maybe<Scalars['Bytes']['output']>;
  id: Scalars['ID']['output'];
  investConfig: GqlPoolInvestConfig;
  lambda: Scalars['String']['output'];
  name: Scalars['String']['output'];
  owner?: Maybe<Scalars['Bytes']['output']>;
  poolTokens: Array<GqlPoolTokenDetail>;
  staking?: Maybe<GqlPoolStaking>;
  symbol: Scalars['String']['output'];
  tokens: Array<GqlPoolTokenUnion>;
  type: GqlPoolType;
  userBalance?: Maybe<GqlPoolUserBalance>;
  vaultVersion: Scalars['Int']['output'];
  version: Scalars['Int']['output'];
  withdrawConfig: GqlPoolWithdrawConfig;
};

export type GqlPoolGyro = GqlPoolBase & {
  __typename?: 'GqlPoolGyro';
  address: Scalars['Bytes']['output'];
  allTokens: Array<GqlPoolTokenExpanded>;
  alpha: Scalars['String']['output'];
  beta: Scalars['String']['output'];
  c: Scalars['String']['output'];
  chain: GqlChain;
  createTime: Scalars['Int']['output'];
  dSq: Scalars['String']['output'];
  decimals: Scalars['Int']['output'];
  displayTokens: Array<GqlPoolTokenDisplay>;
  dynamicData: GqlPoolDynamicData;
  factory?: Maybe<Scalars['Bytes']['output']>;
  id: Scalars['ID']['output'];
  investConfig: GqlPoolInvestConfig;
  lambda: Scalars['String']['output'];
  name: Scalars['String']['output'];
  nestingType: GqlPoolNestingType;
  owner: Scalars['Bytes']['output'];
  poolTokens: Array<GqlPoolTokenDetail>;
  root3Alpha: Scalars['String']['output'];
  s: Scalars['String']['output'];
  sqrtAlpha: Scalars['String']['output'];
  sqrtBeta: Scalars['String']['output'];
  staking?: Maybe<GqlPoolStaking>;
  symbol: Scalars['String']['output'];
  tauAlphaX: Scalars['String']['output'];
  tauAlphaY: Scalars['String']['output'];
  tauBetaX: Scalars['String']['output'];
  tauBetaY: Scalars['String']['output'];
  tokens: Array<GqlPoolTokenUnion>;
  type: GqlPoolType;
  u: Scalars['String']['output'];
  userBalance?: Maybe<GqlPoolUserBalance>;
  v: Scalars['String']['output'];
  vaultVersion: Scalars['Int']['output'];
  version: Scalars['Int']['output'];
  w: Scalars['String']['output'];
  withdrawConfig: GqlPoolWithdrawConfig;
  z: Scalars['String']['output'];
};

export type GqlPoolInvestConfig = {
  __typename?: 'GqlPoolInvestConfig';
  options: Array<GqlPoolInvestOption>;
  proportionalEnabled: Scalars['Boolean']['output'];
  singleAssetEnabled: Scalars['Boolean']['output'];
};

export type GqlPoolInvestOption = {
  __typename?: 'GqlPoolInvestOption';
  poolTokenAddress: Scalars['String']['output'];
  poolTokenIndex: Scalars['Int']['output'];
  tokenOptions: Array<GqlPoolToken>;
};

export type GqlPoolJoinExit = {
  __typename?: 'GqlPoolJoinExit';
  amounts: Array<GqlPoolJoinExitAmount>;
  chain: GqlChain;
  id: Scalars['ID']['output'];
  poolId: Scalars['String']['output'];
  sender: Scalars['String']['output'];
  timestamp: Scalars['Int']['output'];
  tx: Scalars['String']['output'];
  type: GqlPoolJoinExitType;
  valueUSD?: Maybe<Scalars['String']['output']>;
};

export type GqlPoolJoinExitAmount = {
  __typename?: 'GqlPoolJoinExitAmount';
  address: Scalars['String']['output'];
  amount: Scalars['String']['output'];
};

export type GqlPoolJoinExitFilter = {
  chainIn?: InputMaybe<Array<GqlChain>>;
  poolIdIn?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type GqlPoolJoinExitType =
  | 'Exit'
  | 'Join'
  | '%future added value';

export type GqlPoolLiquidityBootstrapping = GqlPoolBase & {
  __typename?: 'GqlPoolLiquidityBootstrapping';
  address: Scalars['Bytes']['output'];
  allTokens: Array<GqlPoolTokenExpanded>;
  chain: GqlChain;
  createTime: Scalars['Int']['output'];
  decimals: Scalars['Int']['output'];
  displayTokens: Array<GqlPoolTokenDisplay>;
  dynamicData: GqlPoolDynamicData;
  factory?: Maybe<Scalars['Bytes']['output']>;
  id: Scalars['ID']['output'];
  investConfig: GqlPoolInvestConfig;
  name: Scalars['String']['output'];
  nestingType: GqlPoolNestingType;
  owner: Scalars['Bytes']['output'];
  poolTokens: Array<GqlPoolTokenDetail>;
  staking?: Maybe<GqlPoolStaking>;
  symbol: Scalars['String']['output'];
  tokens: Array<GqlPoolTokenUnion>;
  type: GqlPoolType;
  userBalance?: Maybe<GqlPoolUserBalance>;
  vaultVersion: Scalars['Int']['output'];
  version: Scalars['Int']['output'];
  withdrawConfig: GqlPoolWithdrawConfig;
};

export type GqlPoolMetaStable = GqlPoolBase & {
  __typename?: 'GqlPoolMetaStable';
  address: Scalars['Bytes']['output'];
  allTokens: Array<GqlPoolTokenExpanded>;
  amp: Scalars['BigInt']['output'];
  chain: GqlChain;
  createTime: Scalars['Int']['output'];
  decimals: Scalars['Int']['output'];
  displayTokens: Array<GqlPoolTokenDisplay>;
  dynamicData: GqlPoolDynamicData;
  factory?: Maybe<Scalars['Bytes']['output']>;
  id: Scalars['ID']['output'];
  investConfig: GqlPoolInvestConfig;
  name: Scalars['String']['output'];
  owner: Scalars['Bytes']['output'];
  poolTokens: Array<GqlPoolTokenDetail>;
  staking?: Maybe<GqlPoolStaking>;
  symbol: Scalars['String']['output'];
  tokens: Array<GqlPoolToken>;
  type: GqlPoolType;
  userBalance?: Maybe<GqlPoolUserBalance>;
  vaultVersion: Scalars['Int']['output'];
  version: Scalars['Int']['output'];
  withdrawConfig: GqlPoolWithdrawConfig;
};

/** The pool schema returned for poolGetPools (pool list query) */
export type GqlPoolMinimal = {
  __typename?: 'GqlPoolMinimal';
  /** The contract address of the pool. */
  address: Scalars['Bytes']['output'];
  /** Returns all pool tokens, including any nested tokens and phantom BPTs */
  allTokens: Array<GqlPoolTokenExpanded>;
  /** The chain on which the pool is deployed */
  chain: GqlChain;
  /** The timestamp the pool was created. */
  createTime: Scalars['Int']['output'];
  /** The decimals of the BPT, usually 18 */
  decimals: Scalars['Int']['output'];
  /** Only returns main tokens, also known as leave tokens. Wont return any nested BPTs. Used for displaying the tokens that the pool consists of. */
  displayTokens: Array<GqlPoolTokenDisplay>;
  /** Dynamic data such as token balances, swap fees or volume */
  dynamicData: GqlPoolDynamicData;
  /** The factory contract address from which the pool was created. */
  factory?: Maybe<Scalars['Bytes']['output']>;
  /** The pool id. This is equal to the address for vaultVersion 3 pools */
  id: Scalars['ID']['output'];
  /** The name of the pool as per contract */
  name: Scalars['String']['output'];
  /** The wallet address of the owner of the pool. Pool owners can set certain properties like swapFees or AMP. */
  owner?: Maybe<Scalars['Bytes']['output']>;
  /** Staking options of this pool which emit additional rewards */
  staking?: Maybe<GqlPoolStaking>;
  /** The token symbol of the pool as per contract */
  symbol: Scalars['String']['output'];
  /** The pool type, such as weighted, stable, etc. */
  type: GqlPoolType;
  /** If a user address was provided in the query, the user balance is populated here */
  userBalance?: Maybe<GqlPoolUserBalance>;
  /** The vault version on which the pool is deployed, 2 or 3 */
  vaultVersion: Scalars['Int']['output'];
  /** The version of the pool type. */
  version: Scalars['Int']['output'];
};

export type GqlPoolNestedUnion = GqlPoolComposableStableNested;

export type GqlPoolNestingType =
  | 'HAS_ONLY_PHANTOM_BPT'
  | 'HAS_SOME_PHANTOM_BPT'
  | 'NO_NESTING'
  | '%future added value';

export type GqlPoolOrderBy =
  | 'apr'
  | 'fees24h'
  | 'totalLiquidity'
  | 'totalShares'
  | 'userbalanceUsd'
  | 'volume24h'
  | '%future added value';

export type GqlPoolOrderDirection =
  | 'asc'
  | 'desc'
  | '%future added value';

export type GqlPoolSnapshot = {
  __typename?: 'GqlPoolSnapshot';
  amounts: Array<Scalars['String']['output']>;
  chain: GqlChain;
  fees24h: Scalars['String']['output'];
  holdersCount: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  poolId: Scalars['String']['output'];
  sharePrice: Scalars['String']['output'];
  swapsCount: Scalars['String']['output'];
  timestamp: Scalars['Int']['output'];
  totalLiquidity: Scalars['String']['output'];
  totalShares: Scalars['String']['output'];
  totalSwapFee: Scalars['String']['output'];
  totalSwapVolume: Scalars['String']['output'];
  volume24h: Scalars['String']['output'];
};

export type GqlPoolSnapshotDataRange =
  | 'ALL_TIME'
  | 'NINETY_DAYS'
  | 'ONE_HUNDRED_EIGHTY_DAYS'
  | 'ONE_YEAR'
  | 'THIRTY_DAYS'
  | '%future added value';

export type GqlPoolStable = GqlPoolBase & {
  __typename?: 'GqlPoolStable';
  address: Scalars['Bytes']['output'];
  allTokens: Array<GqlPoolTokenExpanded>;
  amp: Scalars['BigInt']['output'];
  chain: GqlChain;
  createTime: Scalars['Int']['output'];
  decimals: Scalars['Int']['output'];
  displayTokens: Array<GqlPoolTokenDisplay>;
  dynamicData: GqlPoolDynamicData;
  factory?: Maybe<Scalars['Bytes']['output']>;
  id: Scalars['ID']['output'];
  investConfig: GqlPoolInvestConfig;
  name: Scalars['String']['output'];
  owner: Scalars['Bytes']['output'];
  poolTokens: Array<GqlPoolTokenDetail>;
  staking?: Maybe<GqlPoolStaking>;
  symbol: Scalars['String']['output'];
  tokens: Array<GqlPoolToken>;
  type: GqlPoolType;
  userBalance?: Maybe<GqlPoolUserBalance>;
  vaultVersion: Scalars['Int']['output'];
  version: Scalars['Int']['output'];
  withdrawConfig: GqlPoolWithdrawConfig;
};

export type GqlPoolStableComposablePoolData = {
  __typename?: 'GqlPoolStableComposablePoolData';
  address: Scalars['String']['output'];
  balance: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  symbol: Scalars['String']['output'];
  tokens: Array<GqlPoolToken>;
  totalSupply: Scalars['String']['output'];
};

export type GqlPoolStaking = {
  __typename?: 'GqlPoolStaking';
  address: Scalars['String']['output'];
  chain: GqlChain;
  farm?: Maybe<GqlPoolStakingMasterChefFarm>;
  gauge?: Maybe<GqlPoolStakingGauge>;
  id: Scalars['ID']['output'];
  reliquary?: Maybe<GqlPoolStakingReliquaryFarm>;
  type: GqlPoolStakingType;
};

export type GqlPoolStakingFarmRewarder = {
  __typename?: 'GqlPoolStakingFarmRewarder';
  address: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  rewardPerSecond: Scalars['String']['output'];
  tokenAddress: Scalars['String']['output'];
};

export type GqlPoolStakingGauge = {
  __typename?: 'GqlPoolStakingGauge';
  gaugeAddress: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  otherGauges?: Maybe<Array<GqlPoolStakingOtherGauge>>;
  rewards: Array<GqlPoolStakingGaugeReward>;
  status: GqlPoolStakingGaugeStatus;
  version: Scalars['Int']['output'];
  workingSupply: Scalars['String']['output'];
};

export type GqlPoolStakingGaugeReward = {
  __typename?: 'GqlPoolStakingGaugeReward';
  id: Scalars['ID']['output'];
  rewardPerSecond: Scalars['String']['output'];
  tokenAddress: Scalars['String']['output'];
};

export type GqlPoolStakingGaugeStatus =
  | 'ACTIVE'
  | 'KILLED'
  | 'PREFERRED'
  | '%future added value';

export type GqlPoolStakingMasterChefFarm = {
  __typename?: 'GqlPoolStakingMasterChefFarm';
  beetsPerBlock: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  rewarders?: Maybe<Array<GqlPoolStakingFarmRewarder>>;
};

export type GqlPoolStakingOtherGauge = {
  __typename?: 'GqlPoolStakingOtherGauge';
  gaugeAddress: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  rewards: Array<GqlPoolStakingGaugeReward>;
  status: GqlPoolStakingGaugeStatus;
  version: Scalars['Int']['output'];
};

export type GqlPoolStakingReliquaryFarm = {
  __typename?: 'GqlPoolStakingReliquaryFarm';
  beetsPerSecond: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  levels?: Maybe<Array<GqlPoolStakingReliquaryFarmLevel>>;
  totalBalance: Scalars['String']['output'];
  totalWeightedBalance: Scalars['String']['output'];
};

export type GqlPoolStakingReliquaryFarmLevel = {
  __typename?: 'GqlPoolStakingReliquaryFarmLevel';
  allocationPoints: Scalars['Int']['output'];
  apr: Scalars['BigDecimal']['output'];
  balance: Scalars['BigDecimal']['output'];
  id: Scalars['ID']['output'];
  level: Scalars['Int']['output'];
  requiredMaturity: Scalars['Int']['output'];
};

export type GqlPoolStakingType =
  | 'FRESH_BEETS'
  | 'GAUGE'
  | 'MASTER_CHEF'
  | 'RELIQUARY'
  | '%future added value';

export type GqlPoolSwap = {
  __typename?: 'GqlPoolSwap';
  chain: GqlChain;
  id: Scalars['ID']['output'];
  poolId: Scalars['String']['output'];
  timestamp: Scalars['Int']['output'];
  tokenAmountIn: Scalars['String']['output'];
  tokenAmountOut: Scalars['String']['output'];
  tokenIn: Scalars['String']['output'];
  tokenOut: Scalars['String']['output'];
  tx: Scalars['String']['output'];
  userAddress: Scalars['String']['output'];
  valueUSD: Scalars['Float']['output'];
};

export type GqlPoolSwapEventV3 = GqlPoolEvent & {
  __typename?: 'GqlPoolSwapEventV3';
  blockNumber: Scalars['Int']['output'];
  blockTimestamp: Scalars['Int']['output'];
  chain: GqlChain;
  id: Scalars['ID']['output'];
  logIndex: Scalars['Int']['output'];
  poolId: Scalars['String']['output'];
  sender: Scalars['String']['output'];
  timestamp: Scalars['Int']['output'];
  tokenIn: GqlPoolEventAmount;
  tokenOut: GqlPoolEventAmount;
  tx: Scalars['String']['output'];
  type: GqlPoolEventType;
  userAddress: Scalars['String']['output'];
  valueUSD: Scalars['Float']['output'];
};

export type GqlPoolSwapFilter = {
  chainIn?: InputMaybe<Array<GqlChain>>;
  poolIdIn?: InputMaybe<Array<Scalars['String']['input']>>;
  tokenInIn?: InputMaybe<Array<Scalars['String']['input']>>;
  tokenOutIn?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type GqlPoolTimePeriod = {
  gt?: InputMaybe<Scalars['Int']['input']>;
  lt?: InputMaybe<Scalars['Int']['input']>;
};

export type GqlPoolToken = GqlPoolTokenBase & {
  __typename?: 'GqlPoolToken';
  address: Scalars['String']['output'];
  balance: Scalars['BigDecimal']['output'];
  decimals: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  index: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  priceRate: Scalars['BigDecimal']['output'];
  priceRateProvider?: Maybe<Scalars['String']['output']>;
  symbol: Scalars['String']['output'];
  totalBalance: Scalars['BigDecimal']['output'];
  weight?: Maybe<Scalars['BigDecimal']['output']>;
};

export type GqlPoolTokenBase = {
  address: Scalars['String']['output'];
  balance: Scalars['BigDecimal']['output'];
  decimals: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  index: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  priceRate: Scalars['BigDecimal']['output'];
  priceRateProvider?: Maybe<Scalars['String']['output']>;
  symbol: Scalars['String']['output'];
  totalBalance: Scalars['BigDecimal']['output'];
  weight?: Maybe<Scalars['BigDecimal']['output']>;
};

export type GqlPoolTokenComposableStable = GqlPoolTokenBase & {
  __typename?: 'GqlPoolTokenComposableStable';
  address: Scalars['String']['output'];
  balance: Scalars['BigDecimal']['output'];
  decimals: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  index: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  pool: GqlPoolComposableStableNested;
  priceRate: Scalars['BigDecimal']['output'];
  priceRateProvider?: Maybe<Scalars['String']['output']>;
  symbol: Scalars['String']['output'];
  totalBalance: Scalars['BigDecimal']['output'];
  weight?: Maybe<Scalars['BigDecimal']['output']>;
};

export type GqlPoolTokenComposableStableNestedUnion = GqlPoolToken;

export type GqlPoolTokenDetail = {
  __typename?: 'GqlPoolTokenDetail';
  address: Scalars['String']['output'];
  balance: Scalars['BigDecimal']['output'];
  decimals: Scalars['Int']['output'];
  hasNestedPool: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  index: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  nestedPool?: Maybe<GqlNestedPool>;
  priceRate: Scalars['BigDecimal']['output'];
  priceRateProvider?: Maybe<Scalars['String']['output']>;
  symbol: Scalars['String']['output'];
  weight?: Maybe<Scalars['BigDecimal']['output']>;
};

export type GqlPoolTokenDisplay = {
  __typename?: 'GqlPoolTokenDisplay';
  address: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  nestedTokens?: Maybe<Array<GqlPoolTokenDisplay>>;
  symbol: Scalars['String']['output'];
  weight?: Maybe<Scalars['BigDecimal']['output']>;
};

export type GqlPoolTokenExpanded = {
  __typename?: 'GqlPoolTokenExpanded';
  address: Scalars['String']['output'];
  decimals: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  isMainToken: Scalars['Boolean']['output'];
  isNested: Scalars['Boolean']['output'];
  isPhantomBpt: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  symbol: Scalars['String']['output'];
  weight?: Maybe<Scalars['String']['output']>;
};

export type GqlPoolTokenUnion = GqlPoolToken | GqlPoolTokenComposableStable;

/** Supported pool types */
export type GqlPoolType =
  | 'COMPOSABLE_STABLE'
  | 'ELEMENT'
  | 'FX'
  | 'GYRO'
  | 'GYRO3'
  | 'GYROE'
  | 'INVESTMENT'
  | 'LIQUIDITY_BOOTSTRAPPING'
  | 'META_STABLE'
  | 'PHANTOM_STABLE'
  | 'STABLE'
  | 'UNKNOWN'
  | 'WEIGHTED'
  | '%future added value';

export type GqlPoolUnion = GqlPoolComposableStable | GqlPoolElement | GqlPoolFx | GqlPoolGyro | GqlPoolLiquidityBootstrapping | GqlPoolMetaStable | GqlPoolStable | GqlPoolWeighted;

/** If a user address was provided in the query, the user balance is populated here */
export type GqlPoolUserBalance = {
  __typename?: 'GqlPoolUserBalance';
  /** The staked balance in either a gauge or farm as float. */
  stakedBalance: Scalars['AmountHumanReadable']['output'];
  /** The staked balance in either a gauge or farm in USD as float. */
  stakedBalanceUsd: Scalars['Float']['output'];
  /** Total balance (wallet + staked) as float */
  totalBalance: Scalars['AmountHumanReadable']['output'];
  /** Total balance (wallet + staked) in USD as float */
  totalBalanceUsd: Scalars['Float']['output'];
  /** The wallet balance (BPT in wallet) as float. */
  walletBalance: Scalars['AmountHumanReadable']['output'];
  /** The wallet balance (BPT in wallet) in USD as float. */
  walletBalanceUsd: Scalars['Float']['output'];
};

export type GqlPoolUserSwapVolume = {
  __typename?: 'GqlPoolUserSwapVolume';
  swapVolumeUSD: Scalars['BigDecimal']['output'];
  userAddress: Scalars['String']['output'];
};

export type GqlPoolWeighted = GqlPoolBase & {
  __typename?: 'GqlPoolWeighted';
  address: Scalars['Bytes']['output'];
  allTokens: Array<GqlPoolTokenExpanded>;
  chain: GqlChain;
  createTime: Scalars['Int']['output'];
  decimals: Scalars['Int']['output'];
  displayTokens: Array<GqlPoolTokenDisplay>;
  dynamicData: GqlPoolDynamicData;
  factory?: Maybe<Scalars['Bytes']['output']>;
  id: Scalars['ID']['output'];
  investConfig: GqlPoolInvestConfig;
  name: Scalars['String']['output'];
  nestingType: GqlPoolNestingType;
  owner: Scalars['Bytes']['output'];
  poolTokens: Array<GqlPoolTokenDetail>;
  staking?: Maybe<GqlPoolStaking>;
  symbol: Scalars['String']['output'];
  /** All tokens of the pool. If it is a nested pool, the nested pool is expanded with its own tokens again. */
  tokens: Array<GqlPoolTokenUnion>;
  type: GqlPoolType;
  userBalance?: Maybe<GqlPoolUserBalance>;
  vaultVersion: Scalars['Int']['output'];
  version: Scalars['Int']['output'];
  withdrawConfig: GqlPoolWithdrawConfig;
};

export type GqlPoolWithdrawConfig = {
  __typename?: 'GqlPoolWithdrawConfig';
  options: Array<GqlPoolWithdrawOption>;
  proportionalEnabled: Scalars['Boolean']['output'];
  singleAssetEnabled: Scalars['Boolean']['output'];
};

export type GqlPoolWithdrawOption = {
  __typename?: 'GqlPoolWithdrawOption';
  poolTokenAddress: Scalars['String']['output'];
  poolTokenIndex: Scalars['Int']['output'];
  tokenOptions: Array<GqlPoolToken>;
};

/** Returns the price impact of the path. If there is an error in the price impact calculation, priceImpact will be undefined but the error string is populated. */
export type GqlPriceImpact = {
  __typename?: 'GqlPriceImpact';
  /** If priceImpact cant be calculated and is returned as undefined, the error string will be populated. */
  error?: Maybe<Scalars['String']['output']>;
  /** Price impact in percent 0.01 -> 0.01%; undefined if an error happened. */
  priceImpact?: Maybe<Scalars['AmountHumanReadable']['output']>;
};

export type GqlProtocolMetricsAggregated = {
  __typename?: 'GqlProtocolMetricsAggregated';
  chains: Array<GqlProtocolMetricsChain>;
  numLiquidityProviders: Scalars['BigInt']['output'];
  poolCount: Scalars['BigInt']['output'];
  swapFee24h: Scalars['BigDecimal']['output'];
  swapVolume24h: Scalars['BigDecimal']['output'];
  totalLiquidity: Scalars['BigDecimal']['output'];
  totalSwapFee: Scalars['BigDecimal']['output'];
  totalSwapVolume: Scalars['BigDecimal']['output'];
  yieldCapture24h: Scalars['BigDecimal']['output'];
};

export type GqlProtocolMetricsChain = {
  __typename?: 'GqlProtocolMetricsChain';
  chainId: Scalars['String']['output'];
  numLiquidityProviders: Scalars['BigInt']['output'];
  poolCount: Scalars['BigInt']['output'];
  swapFee24h: Scalars['BigDecimal']['output'];
  swapVolume24h: Scalars['BigDecimal']['output'];
  totalLiquidity: Scalars['BigDecimal']['output'];
  totalSwapFee: Scalars['BigDecimal']['output'];
  totalSwapVolume: Scalars['BigDecimal']['output'];
  yieldCapture24h: Scalars['BigDecimal']['output'];
};

export type GqlRelicSnapshot = {
  __typename?: 'GqlRelicSnapshot';
  balance: Scalars['String']['output'];
  entryTimestamp: Scalars['Int']['output'];
  farmId: Scalars['String']['output'];
  level: Scalars['Int']['output'];
  relicId: Scalars['Int']['output'];
};

export type GqlReliquaryFarmLevelSnapshot = {
  __typename?: 'GqlReliquaryFarmLevelSnapshot';
  balance: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  level: Scalars['String']['output'];
};

export type GqlReliquaryFarmSnapshot = {
  __typename?: 'GqlReliquaryFarmSnapshot';
  dailyDeposited: Scalars['String']['output'];
  dailyWithdrawn: Scalars['String']['output'];
  farmId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  levelBalances: Array<GqlReliquaryFarmLevelSnapshot>;
  relicCount: Scalars['String']['output'];
  timestamp: Scalars['Int']['output'];
  tokenBalances: Array<GqlReliquaryTokenBalanceSnapshot>;
  totalBalance: Scalars['String']['output'];
  totalLiquidity: Scalars['String']['output'];
  userCount: Scalars['String']['output'];
};

export type GqlReliquaryTokenBalanceSnapshot = {
  __typename?: 'GqlReliquaryTokenBalanceSnapshot';
  address: Scalars['String']['output'];
  balance: Scalars['String']['output'];
  decimals: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  symbol: Scalars['String']['output'];
};

export type GqlSftmxStakingData = {
  __typename?: 'GqlSftmxStakingData';
  /** Current exchange rate for sFTMx -> FTM */
  exchangeRate: Scalars['String']['output'];
  /** Whether maintenance is paused. This pauses reward claiming or harvesting and withdrawing from matured vaults. */
  maintenancePaused: Scalars['Boolean']['output'];
  /** The maximum FTM amount to depost. */
  maxDepositLimit: Scalars['AmountHumanReadable']['output'];
  /** The minimum FTM amount to deposit. */
  minDepositLimit: Scalars['AmountHumanReadable']['output'];
  /** Number of vaults that delegated to validators. */
  numberOfVaults: Scalars['Int']['output'];
  /** The current rebasing APR for sFTMx. */
  stakingApr: Scalars['String']['output'];
  /** Total amount of FTM in custody of sFTMx. Staked FTM plus free pool FTM. */
  totalFtmAmount: Scalars['AmountHumanReadable']['output'];
  /** Total amount of FTM in the free pool. */
  totalFtmAmountInPool: Scalars['AmountHumanReadable']['output'];
  /** Total amount of FTM staked/delegated to validators. */
  totalFtmAmountStaked: Scalars['AmountHumanReadable']['output'];
  /** Whether undelegation is paused. Undelegate is the first step to redeem sFTMx. */
  undelegatePaused: Scalars['Boolean']['output'];
  /** A list of all the vaults that delegated to validators. */
  vaults: Array<GqlSftmxStakingVault>;
  /** Whether withdrawals are paused. Withdraw is the second and final step to redeem sFTMx. */
  withdrawPaused: Scalars['Boolean']['output'];
  /** Delay to wait between undelegate (1st step) and withdraw (2nd step). */
  withdrawalDelay: Scalars['Int']['output'];
};

export type GqlSftmxStakingSnapshot = {
  __typename?: 'GqlSftmxStakingSnapshot';
  /** Current exchange rate for sFTMx -> FTM */
  exchangeRate: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** The timestamp of the snapshot. Timestamp is end of day midnight. */
  timestamp: Scalars['Int']['output'];
  /** Total amount of FTM in custody of sFTMx. Staked FTM plus free pool FTM. */
  totalFtmAmount: Scalars['AmountHumanReadable']['output'];
  /** Total amount of FTM in the free pool. */
  totalFtmAmountInPool: Scalars['AmountHumanReadable']['output'];
  /** Total amount of FTM staked/delegated to validators. */
  totalFtmAmountStaked: Scalars['AmountHumanReadable']['output'];
};

export type GqlSftmxStakingSnapshotDataRange =
  | 'ALL_TIME'
  | 'NINETY_DAYS'
  | 'ONE_HUNDRED_EIGHTY_DAYS'
  | 'ONE_YEAR'
  | 'THIRTY_DAYS'
  | '%future added value';

export type GqlSftmxStakingVault = {
  __typename?: 'GqlSftmxStakingVault';
  /** The amount of FTM that has been delegated via this vault. */
  ftmAmountStaked: Scalars['AmountHumanReadable']['output'];
  /** Whether the vault is matured, meaning whether unlock time has passed. */
  isMatured: Scalars['Boolean']['output'];
  /** Timestamp when the delegated FTM unlocks, matures. */
  unlockTimestamp: Scalars['Int']['output'];
  /** The address of the validator that the vault has delegated to. */
  validatorAddress: Scalars['String']['output'];
  /** The ID of the validator that the vault has delegated to. */
  validatorId: Scalars['String']['output'];
  /** The contract address of the vault. */
  vaultAddress: Scalars['String']['output'];
  /** The internal index of the vault. */
  vaultIndex: Scalars['Int']['output'];
};

export type GqlSftmxWithdrawalRequests = {
  __typename?: 'GqlSftmxWithdrawalRequests';
  /** Amount of sFTMx that is being redeemed. */
  amountSftmx: Scalars['AmountHumanReadable']['output'];
  /** The Withdrawal ID, used for interactions. */
  id: Scalars['String']['output'];
  /** Whether the requests is finished and the user has withdrawn. */
  isWithdrawn: Scalars['Boolean']['output'];
  /** The timestamp when the request was placed. There is a delay until the user can withdraw. See withdrawalDelay. */
  requestTimestamp: Scalars['Int']['output'];
  /** The user address that this request belongs to. */
  user: Scalars['String']['output'];
};

export type GqlSorCallData = {
  __typename?: 'GqlSorCallData';
  /** The call data that needs to be sent to the RPC */
  callData: Scalars['String']['output'];
  /** Maximum amount to be sent for exact out orders */
  maxAmountInRaw?: Maybe<Scalars['String']['output']>;
  /** Minimum amount received for exact in orders */
  minAmountOutRaw?: Maybe<Scalars['String']['output']>;
  /** The target contract to send the call data to */
  to: Scalars['String']['output'];
  /** Value in ETH that needs to be sent for native swaps */
  value: Scalars['BigDecimal']['output'];
};

/** The swap paths for a swap */
export type GqlSorGetSwapPaths = {
  __typename?: 'GqlSorGetSwapPaths';
  /** Transaction data that can be posted to an RPC to execute the swap. */
  callData?: Maybe<GqlSorCallData>;
  /** The price of tokenOut in tokenIn. */
  effectivePrice: Scalars['AmountHumanReadable']['output'];
  /** The price of tokenIn in tokenOut. */
  effectivePriceReversed: Scalars['AmountHumanReadable']['output'];
  /** The found paths as needed as input for the b-sdk to execute the swap */
  paths: Array<GqlSorPath>;
  /** Price impact of the path */
  priceImpact: GqlPriceImpact;
  /** The return amount in human form. Return amount is either tokenOutAmount (if swapType is exactIn) or tokenInAmount (if swapType is exactOut) */
  returnAmount: Scalars['AmountHumanReadable']['output'];
  /** The return amount in a raw form */
  returnAmountRaw: Scalars['BigDecimal']['output'];
  /** The swap routes including pool information. Used to display by the UI */
  routes: Array<GqlSorSwapRoute>;
  /** The swap amount in human form. Swap amount is either tokenInAmount (if swapType is exactIn) or tokenOutAmount (if swapType is exactOut) */
  swapAmount: Scalars['AmountHumanReadable']['output'];
  /** The swap amount in a raw form */
  swapAmountRaw: Scalars['BigDecimal']['output'];
  /** The swapType that was provided, exact_in vs exact_out (givenIn vs givenOut) */
  swapType: GqlSorSwapType;
  /** Swaps as needed for the vault swap input to execute the swap */
  swaps: Array<GqlSorSwap>;
  /** All token addresses (or assets) as needed for the vault swap input to execute the swap */
  tokenAddresses: Array<Scalars['String']['output']>;
  /** The token address of the tokenIn provided */
  tokenIn: Scalars['String']['output'];
  /** The amount of tokenIn in human form */
  tokenInAmount: Scalars['AmountHumanReadable']['output'];
  /** The token address of the tokenOut provided */
  tokenOut: Scalars['String']['output'];
  /** The amount of tokenOut in human form */
  tokenOutAmount: Scalars['AmountHumanReadable']['output'];
  /** The version of the vault these paths are from */
  vaultVersion: Scalars['Int']['output'];
};

export type GqlSorGetSwapsResponse = {
  __typename?: 'GqlSorGetSwapsResponse';
  effectivePrice: Scalars['AmountHumanReadable']['output'];
  effectivePriceReversed: Scalars['AmountHumanReadable']['output'];
  marketSp: Scalars['String']['output'];
  priceImpact: Scalars['AmountHumanReadable']['output'];
  returnAmount: Scalars['AmountHumanReadable']['output'];
  returnAmountConsideringFees: Scalars['BigDecimal']['output'];
  returnAmountFromSwaps?: Maybe<Scalars['BigDecimal']['output']>;
  returnAmountScaled: Scalars['BigDecimal']['output'];
  routes: Array<GqlSorSwapRoute>;
  swapAmount: Scalars['AmountHumanReadable']['output'];
  swapAmountForSwaps?: Maybe<Scalars['BigDecimal']['output']>;
  swapAmountScaled: Scalars['BigDecimal']['output'];
  swapType: GqlSorSwapType;
  swaps: Array<GqlSorSwap>;
  tokenAddresses: Array<Scalars['String']['output']>;
  tokenIn: Scalars['String']['output'];
  tokenInAmount: Scalars['AmountHumanReadable']['output'];
  tokenOut: Scalars['String']['output'];
  tokenOutAmount: Scalars['AmountHumanReadable']['output'];
};

/** A path of a swap. A swap can have multiple paths. Used as input to execute the swap via b-sdk */
export type GqlSorPath = {
  __typename?: 'GqlSorPath';
  /** Input amount of this path in scaled form */
  inputAmountRaw: Scalars['String']['output'];
  /** Output amount of this path in scaled form */
  outputAmountRaw: Scalars['String']['output'];
  /** A sorted list of pool ids that are used in this path */
  pools: Array<Maybe<Scalars['String']['output']>>;
  /** A sorted list of tokens that are ussed in this path */
  tokens: Array<Maybe<Token>>;
  /** Vault version of this path. */
  vaultVersion: Scalars['Int']['output'];
};

/** A single swap step as used for input to the vault to execute a swap */
export type GqlSorSwap = {
  __typename?: 'GqlSorSwap';
  /** Amount to be swapped in this step. 0 for chained swap. */
  amount: Scalars['String']['output'];
  /** Index of the asset used in the tokenAddress array. */
  assetInIndex: Scalars['Int']['output'];
  /** Index of the asset used in the tokenAddress array. */
  assetOutIndex: Scalars['Int']['output'];
  /** Pool id used in this swap step */
  poolId: Scalars['String']['output'];
  /** UserData used in this swap, generally uses defaults. */
  userData: Scalars['String']['output'];
};

export type GqlSorSwapOptionsInput = {
  forceRefresh?: InputMaybe<Scalars['Boolean']['input']>;
  maxPools?: InputMaybe<Scalars['Int']['input']>;
  queryBatchSwap?: InputMaybe<Scalars['Boolean']['input']>;
  timestamp?: InputMaybe<Scalars['Int']['input']>;
};

/** The swap routes including pool information. Used to display by the UI */
export type GqlSorSwapRoute = {
  __typename?: 'GqlSorSwapRoute';
  /** The hops this route takes */
  hops: Array<GqlSorSwapRouteHop>;
  /** Share of this route of the total swap */
  share: Scalars['Float']['output'];
  /** Address of the tokenIn */
  tokenIn: Scalars['String']['output'];
  /** Amount of the tokenIn in human form */
  tokenInAmount: Scalars['AmountHumanReadable']['output'];
  /** Address of the tokenOut */
  tokenOut: Scalars['String']['output'];
  /** Amount of the tokenOut in human form */
  tokenOutAmount: Scalars['AmountHumanReadable']['output'];
};

/** A hop of a route. A route can have many hops meaning it traverses more than one pool. */
export type GqlSorSwapRouteHop = {
  __typename?: 'GqlSorSwapRouteHop';
  /** The pool entity of this hop. */
  pool: GqlPoolMinimal;
  /** The pool id of this hop. */
  poolId: Scalars['String']['output'];
  /** Address of the tokenIn */
  tokenIn: Scalars['String']['output'];
  /** Amount of the tokenIn in human form */
  tokenInAmount: Scalars['AmountHumanReadable']['output'];
  /** Address of the tokenOut */
  tokenOut: Scalars['String']['output'];
  /** Amount of the tokenOut in human form */
  tokenOutAmount: Scalars['AmountHumanReadable']['output'];
};

export type GqlSorSwapType =
  | 'EXACT_IN'
  | 'EXACT_OUT'
  | '%future added value';

/** Inputs for the call data to create the swap transaction. If this input is given, call data is added to the response. */
export type GqlSwapCallDataInput = {
  /** How long the swap should be valid, provide a timestamp. "999999999999999999" for infinite. Default: infinite */
  deadline?: InputMaybe<Scalars['Int']['input']>;
  /** Who receives the output amount. */
  receiver: Scalars['String']['input'];
  /** Who sends the input amount. */
  sender: Scalars['String']['input'];
  /** The max slippage in percent 0.01 -> 0.01% */
  slippagePercentage: Scalars['String']['input'];
};

export type GqlToken = {
  __typename?: 'GqlToken';
  address: Scalars['String']['output'];
  chain: GqlChain;
  chainId: Scalars['Int']['output'];
  decimals: Scalars['Int']['output'];
  description?: Maybe<Scalars['String']['output']>;
  discordUrl?: Maybe<Scalars['String']['output']>;
  logoURI?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  priority: Scalars['Int']['output'];
  symbol: Scalars['String']['output'];
  telegramUrl?: Maybe<Scalars['String']['output']>;
  tradable: Scalars['Boolean']['output'];
  twitterUsername?: Maybe<Scalars['String']['output']>;
  websiteUrl?: Maybe<Scalars['String']['output']>;
};

export type GqlTokenAmountHumanReadable = {
  address: Scalars['String']['input'];
  amount: Scalars['AmountHumanReadable']['input'];
};

export type GqlTokenCandlestickChartDataItem = {
  __typename?: 'GqlTokenCandlestickChartDataItem';
  close: Scalars['AmountHumanReadable']['output'];
  high: Scalars['AmountHumanReadable']['output'];
  id: Scalars['ID']['output'];
  low: Scalars['AmountHumanReadable']['output'];
  open: Scalars['AmountHumanReadable']['output'];
  timestamp: Scalars['Int']['output'];
};

export type GqlTokenChartDataRange =
  | 'NINETY_DAY'
  | 'ONE_HUNDRED_EIGHTY_DAY'
  | 'ONE_YEAR'
  | 'SEVEN_DAY'
  | 'THIRTY_DAY'
  | '%future added value';

export type GqlTokenData = {
  __typename?: 'GqlTokenData';
  description?: Maybe<Scalars['String']['output']>;
  discordUrl?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  telegramUrl?: Maybe<Scalars['String']['output']>;
  tokenAddress: Scalars['String']['output'];
  twitterUsername?: Maybe<Scalars['String']['output']>;
  websiteUrl?: Maybe<Scalars['String']['output']>;
};

export type GqlTokenDynamicData = {
  __typename?: 'GqlTokenDynamicData';
  ath: Scalars['Float']['output'];
  atl: Scalars['Float']['output'];
  fdv?: Maybe<Scalars['String']['output']>;
  high24h: Scalars['Float']['output'];
  id: Scalars['String']['output'];
  low24h: Scalars['Float']['output'];
  marketCap?: Maybe<Scalars['String']['output']>;
  price: Scalars['Float']['output'];
  priceChange24h: Scalars['Float']['output'];
  priceChangePercent7d?: Maybe<Scalars['Float']['output']>;
  priceChangePercent14d?: Maybe<Scalars['Float']['output']>;
  priceChangePercent24h: Scalars['Float']['output'];
  priceChangePercent30d?: Maybe<Scalars['Float']['output']>;
  tokenAddress: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type GqlTokenPrice = {
  __typename?: 'GqlTokenPrice';
  address: Scalars['String']['output'];
  chain: GqlChain;
  price: Scalars['Float']['output'];
  updatedAt: Scalars['Int']['output'];
  updatedBy?: Maybe<Scalars['String']['output']>;
};

export type GqlTokenPriceChartDataItem = {
  __typename?: 'GqlTokenPriceChartDataItem';
  id: Scalars['ID']['output'];
  price: Scalars['AmountHumanReadable']['output'];
  timestamp: Scalars['Int']['output'];
};

export type GqlTokenType =
  | 'BPT'
  | 'PHANTOM_BPT'
  | 'WHITE_LISTED'
  | '%future added value';

export type GqlUserFbeetsBalance = {
  __typename?: 'GqlUserFbeetsBalance';
  id: Scalars['String']['output'];
  stakedBalance: Scalars['AmountHumanReadable']['output'];
  totalBalance: Scalars['AmountHumanReadable']['output'];
  walletBalance: Scalars['AmountHumanReadable']['output'];
};

export type GqlUserPoolBalance = {
  __typename?: 'GqlUserPoolBalance';
  chain: GqlChain;
  poolId: Scalars['String']['output'];
  stakedBalance: Scalars['AmountHumanReadable']['output'];
  tokenAddress: Scalars['String']['output'];
  tokenPrice: Scalars['Float']['output'];
  totalBalance: Scalars['AmountHumanReadable']['output'];
  walletBalance: Scalars['AmountHumanReadable']['output'];
};

export type GqlUserSwapVolumeFilter = {
  poolIdIn?: InputMaybe<Array<Scalars['String']['input']>>;
  tokenInIn?: InputMaybe<Array<Scalars['String']['input']>>;
  tokenOutIn?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type GqlVeBalUserData = {
  __typename?: 'GqlVeBalUserData';
  balance: Scalars['AmountHumanReadable']['output'];
  rank?: Maybe<Scalars['Int']['output']>;
};

export type GqlVotingGauge = {
  __typename?: 'GqlVotingGauge';
  addedTimestamp?: Maybe<Scalars['Int']['output']>;
  address: Scalars['Bytes']['output'];
  childGaugeAddress?: Maybe<Scalars['Bytes']['output']>;
  isKilled: Scalars['Boolean']['output'];
  relativeWeightCap?: Maybe<Scalars['String']['output']>;
};

export type GqlVotingGaugeToken = {
  __typename?: 'GqlVotingGaugeToken';
  address: Scalars['String']['output'];
  logoURI: Scalars['String']['output'];
  symbol: Scalars['String']['output'];
  weight?: Maybe<Scalars['String']['output']>;
};

export type GqlVotingPool = {
  __typename?: 'GqlVotingPool';
  address: Scalars['Bytes']['output'];
  chain: GqlChain;
  gauge: GqlVotingGauge;
  id: Scalars['ID']['output'];
  symbol: Scalars['String']['output'];
  tokens: Array<GqlVotingGaugeToken>;
  type: GqlPoolType;
};

export type Mutation = {
  __typename?: 'Mutation';
  beetsPoolLoadReliquarySnapshotsForAllFarms: Scalars['String']['output'];
  beetsSyncFbeetsRatio: Scalars['String']['output'];
  cacheAverageBlockTime: Scalars['String']['output'];
  poolBlackListAddPool: Scalars['String']['output'];
  poolBlackListRemovePool: Scalars['String']['output'];
  poolDeletePool: Scalars['String']['output'];
  poolInitOnChainDataForAllPools: Scalars['String']['output'];
  poolInitializeSnapshotsForPool: Scalars['String']['output'];
  poolLoadOnChainDataForAllPools: Scalars['String']['output'];
  poolLoadOnChainDataForPoolsWithActiveUpdates: Scalars['String']['output'];
  poolLoadSnapshotsForAllPools: Scalars['String']['output'];
  poolLoadSnapshotsForPools: Scalars['String']['output'];
  poolReloadAllPoolAprs: Scalars['String']['output'];
  poolReloadAllTokenNestedPoolIds: Scalars['String']['output'];
  poolReloadStakingForAllPools: Scalars['String']['output'];
  poolSyncAllPoolsFromSubgraph: Array<Scalars['String']['output']>;
  poolSyncLatestSnapshotsForAllPools: Scalars['String']['output'];
  poolSyncNewPoolsFromSubgraph: Array<Scalars['String']['output']>;
  poolSyncPool: Scalars['String']['output'];
  poolSyncPoolAllTokensRelationship: Scalars['String']['output'];
  poolSyncSanityPoolData: Scalars['String']['output'];
  poolSyncStakingForPools: Scalars['String']['output'];
  poolSyncSwapsForLast48Hours: Scalars['String']['output'];
  poolSyncTotalShares: Scalars['String']['output'];
  poolUpdateAprs: Scalars['String']['output'];
  poolUpdateLifetimeValuesForAllPools: Scalars['String']['output'];
  poolUpdateLiquidity24hAgoForAllPools: Scalars['String']['output'];
  poolUpdateLiquidityValuesForAllPools: Scalars['String']['output'];
  poolUpdateVolumeAndFeeValuesForAllPools: Scalars['String']['output'];
  protocolCacheMetrics: Scalars['String']['output'];
  sftmxSyncStakingData: Scalars['String']['output'];
  sftmxSyncWithdrawalRequests: Scalars['String']['output'];
  tokenDeleteTokenType: Scalars['String']['output'];
  tokenReloadAllTokenTypes: Scalars['String']['output'];
  tokenReloadTokenPrices?: Maybe<Scalars['Boolean']['output']>;
  tokenSyncLatestFxPrices: Scalars['String']['output'];
  tokenSyncTokenDefinitions: Scalars['String']['output'];
  userInitStakedBalances: Scalars['String']['output'];
  userInitWalletBalancesForAllPools: Scalars['String']['output'];
  userInitWalletBalancesForPool: Scalars['String']['output'];
  userSyncBalance: Scalars['String']['output'];
  userSyncBalanceAllPools: Scalars['String']['output'];
  userSyncChangedStakedBalances: Scalars['String']['output'];
  userSyncChangedWalletBalancesForAllPools: Scalars['String']['output'];
  veBalSyncAllUserBalances: Scalars['String']['output'];
  veBalSyncTotalSupply: Scalars['String']['output'];
};


export type MutationPoolBlackListAddPoolArgs = {
  poolId: Scalars['String']['input'];
};


export type MutationPoolBlackListRemovePoolArgs = {
  poolId: Scalars['String']['input'];
};


export type MutationPoolDeletePoolArgs = {
  poolId: Scalars['String']['input'];
};


export type MutationPoolInitializeSnapshotsForPoolArgs = {
  poolId: Scalars['String']['input'];
};


export type MutationPoolLoadSnapshotsForPoolsArgs = {
  poolIds: Array<Scalars['String']['input']>;
  reload?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationPoolReloadAllPoolAprsArgs = {
  chain: GqlChain;
};


export type MutationPoolReloadStakingForAllPoolsArgs = {
  stakingTypes: Array<GqlPoolStakingType>;
};


export type MutationPoolSyncLatestSnapshotsForAllPoolsArgs = {
  daysToSync?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationPoolSyncPoolArgs = {
  poolId: Scalars['String']['input'];
};


export type MutationPoolUpdateAprsArgs = {
  chain: GqlChain;
};


export type MutationTokenDeleteTokenTypeArgs = {
  tokenAddress: Scalars['String']['input'];
  type: GqlTokenType;
};


export type MutationTokenReloadTokenPricesArgs = {
  chains: Array<GqlChain>;
};


export type MutationTokenSyncLatestFxPricesArgs = {
  chain: GqlChain;
};


export type MutationUserInitStakedBalancesArgs = {
  stakingTypes: Array<GqlPoolStakingType>;
};


export type MutationUserInitWalletBalancesForPoolArgs = {
  poolId: Scalars['String']['input'];
};


export type MutationUserSyncBalanceArgs = {
  poolId: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  beetsGetFbeetsRatio: Scalars['String']['output'];
  beetsPoolGetReliquaryFarmSnapshots: Array<GqlReliquaryFarmSnapshot>;
  blocksGetAverageBlockTime: Scalars['Float']['output'];
  blocksGetBlocksPerDay: Scalars['Float']['output'];
  blocksGetBlocksPerSecond: Scalars['Float']['output'];
  blocksGetBlocksPerYear: Scalars['Float']['output'];
  contentGetNewsItems: Array<GqlContentNewsItem>;
  latestSyncedBlocks: GqlLatestSyncedBlocks;
  /** Getting swap, add and remove events with paging */
  poolEvents: Array<GqlPoolEvent>;
  /** Will de deprecated in favor of poolEvents */
  poolGetBatchSwaps: Array<GqlPoolBatchSwap>;
  /** Getting swap, add and remove events with range */
  poolGetEvents: Array<GqlPoolEvent>;
  /** Will de deprecated in favor of poolGetFeaturedPools */
  poolGetFeaturedPoolGroups: Array<GqlPoolFeaturedPoolGroup>;
  /** Returns the list of featured pools for chains */
  poolGetFeaturedPools: Array<GqlPoolFeaturedPool>;
  /** Will de deprecated in favor of poolEvents */
  poolGetJoinExits: Array<GqlPoolJoinExit>;
  /** Returns one pool. If a user address is provided, the user balances for the given pool will also be returned. */
  poolGetPool: GqlPoolBase;
  /** Returns all pools for a given filter */
  poolGetPools: Array<GqlPoolMinimal>;
  /** Returns the number of pools for a given filter. */
  poolGetPoolsCount: Scalars['Int']['output'];
  /** Gets all the snapshots for a given pool on a chain for a certain range */
  poolGetSnapshots: Array<GqlPoolSnapshot>;
  /** Will de deprecated in favor of poolEvents */
  poolGetSwaps: Array<GqlPoolSwap>;
  protocolMetricsAggregated: GqlProtocolMetricsAggregated;
  protocolMetricsChain: GqlProtocolMetricsChain;
  /** Get the staking data and status for sFTMx */
  sftmxGetStakingData: GqlSftmxStakingData;
  /** Get snapshots for sftmx staking for a specific range */
  sftmxGetStakingSnapshots: Array<GqlSftmxStakingSnapshot>;
  /** Retrieve the withdrawalrequests from a user */
  sftmxGetWithdrawalRequests: Array<GqlSftmxWithdrawalRequests>;
  /** Get swap quote from the SOR v2 for the V2 vault */
  sorGetSwapPaths: GqlSorGetSwapPaths;
  /** Get swap quote from the SOR, queries both the old and new SOR */
  sorGetSwaps: GqlSorGetSwapsResponse;
  tokenGetCandlestickChartData: Array<GqlTokenCandlestickChartDataItem>;
  tokenGetCurrentPrices: Array<GqlTokenPrice>;
  tokenGetHistoricalPrices: Array<GqlHistoricalTokenPrice>;
  tokenGetPriceChartData: Array<GqlTokenPriceChartDataItem>;
  tokenGetProtocolTokenPrice: Scalars['AmountHumanReadable']['output'];
  tokenGetRelativePriceChartData: Array<GqlTokenPriceChartDataItem>;
  tokenGetTokenData?: Maybe<GqlTokenData>;
  tokenGetTokenDynamicData?: Maybe<GqlTokenDynamicData>;
  tokenGetTokens: Array<GqlToken>;
  tokenGetTokensData: Array<GqlTokenData>;
  tokenGetTokensDynamicData: Array<GqlTokenDynamicData>;
  userGetFbeetsBalance: GqlUserFbeetsBalance;
  userGetPoolBalances: Array<GqlUserPoolBalance>;
  /** Will de deprecated in favor of poolGetEvents */
  userGetPoolJoinExits: Array<GqlPoolJoinExit>;
  userGetStaking: Array<GqlPoolStaking>;
  /** Will de deprecated in favor of poolGetEvents */
  userGetSwaps: Array<GqlPoolSwap>;
  veBalGetTotalSupply: Scalars['AmountHumanReadable']['output'];
  veBalGetUser: GqlVeBalUserData;
  veBalGetUserBalance: Scalars['AmountHumanReadable']['output'];
  veBalGetVotingList: Array<GqlVotingPool>;
};


export type QueryBeetsPoolGetReliquaryFarmSnapshotsArgs = {
  id: Scalars['String']['input'];
  range: GqlPoolSnapshotDataRange;
};


export type QueryContentGetNewsItemsArgs = {
  chain?: InputMaybe<GqlChain>;
};


export type QueryPoolEventsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where: GqlPoolEventsFilter;
};


export type QueryPoolGetBatchSwapsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<GqlPoolSwapFilter>;
};


export type QueryPoolGetEventsArgs = {
  chain: GqlChain;
  poolId: Scalars['String']['input'];
  range: GqlPoolEventsDataRange;
  typeIn: Array<GqlPoolEventType>;
  userAddress?: InputMaybe<Scalars['String']['input']>;
};


export type QueryPoolGetFeaturedPoolGroupsArgs = {
  chains?: InputMaybe<Array<GqlChain>>;
};


export type QueryPoolGetFeaturedPoolsArgs = {
  chains: Array<GqlChain>;
};


export type QueryPoolGetJoinExitsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<GqlPoolJoinExitFilter>;
};


export type QueryPoolGetPoolArgs = {
  chain?: InputMaybe<GqlChain>;
  id: Scalars['String']['input'];
  userAddress?: InputMaybe<Scalars['String']['input']>;
};


export type QueryPoolGetPoolsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GqlPoolOrderBy>;
  orderDirection?: InputMaybe<GqlPoolOrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  textSearch?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<GqlPoolFilter>;
};


export type QueryPoolGetPoolsCountArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<GqlPoolOrderBy>;
  orderDirection?: InputMaybe<GqlPoolOrderDirection>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  textSearch?: InputMaybe<Scalars['String']['input']>;
  where?: InputMaybe<GqlPoolFilter>;
};


export type QueryPoolGetSnapshotsArgs = {
  chain?: InputMaybe<GqlChain>;
  id: Scalars['String']['input'];
  range: GqlPoolSnapshotDataRange;
};


export type QueryPoolGetSwapsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<GqlPoolSwapFilter>;
};


export type QueryProtocolMetricsAggregatedArgs = {
  chains?: InputMaybe<Array<GqlChain>>;
};


export type QueryProtocolMetricsChainArgs = {
  chain?: InputMaybe<GqlChain>;
};


export type QuerySftmxGetStakingSnapshotsArgs = {
  range: GqlSftmxStakingSnapshotDataRange;
};


export type QuerySftmxGetWithdrawalRequestsArgs = {
  user: Scalars['String']['input'];
};


export type QuerySorGetSwapPathsArgs = {
  callDataInput?: InputMaybe<GqlSwapCallDataInput>;
  chain: GqlChain;
  queryBatchSwap?: InputMaybe<Scalars['Boolean']['input']>;
  swapAmount: Scalars['AmountHumanReadable']['input'];
  swapType: GqlSorSwapType;
  tokenIn: Scalars['String']['input'];
  tokenOut: Scalars['String']['input'];
  useVaultVersion?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerySorGetSwapsArgs = {
  chain?: InputMaybe<GqlChain>;
  swapAmount: Scalars['BigDecimal']['input'];
  swapOptions: GqlSorSwapOptionsInput;
  swapType: GqlSorSwapType;
  tokenIn: Scalars['String']['input'];
  tokenOut: Scalars['String']['input'];
};


export type QueryTokenGetCandlestickChartDataArgs = {
  address: Scalars['String']['input'];
  chain?: InputMaybe<GqlChain>;
  range: GqlTokenChartDataRange;
};


export type QueryTokenGetCurrentPricesArgs = {
  chains?: InputMaybe<Array<GqlChain>>;
};


export type QueryTokenGetHistoricalPricesArgs = {
  addresses: Array<Scalars['String']['input']>;
  chain: GqlChain;
  range: GqlTokenChartDataRange;
};


export type QueryTokenGetPriceChartDataArgs = {
  address: Scalars['String']['input'];
  chain?: InputMaybe<GqlChain>;
  range: GqlTokenChartDataRange;
};


export type QueryTokenGetProtocolTokenPriceArgs = {
  chain?: InputMaybe<GqlChain>;
};


export type QueryTokenGetRelativePriceChartDataArgs = {
  chain?: InputMaybe<GqlChain>;
  range: GqlTokenChartDataRange;
  tokenIn: Scalars['String']['input'];
  tokenOut: Scalars['String']['input'];
};


export type QueryTokenGetTokenDataArgs = {
  address: Scalars['String']['input'];
  chain?: InputMaybe<GqlChain>;
};


export type QueryTokenGetTokenDynamicDataArgs = {
  address: Scalars['String']['input'];
  chain?: InputMaybe<GqlChain>;
};


export type QueryTokenGetTokensArgs = {
  chains?: InputMaybe<Array<GqlChain>>;
};


export type QueryTokenGetTokensDataArgs = {
  addresses: Array<Scalars['String']['input']>;
};


export type QueryTokenGetTokensDynamicDataArgs = {
  addresses: Array<Scalars['String']['input']>;
  chain?: InputMaybe<GqlChain>;
};


export type QueryUserGetPoolBalancesArgs = {
  address?: InputMaybe<Scalars['String']['input']>;
  chains?: InputMaybe<Array<GqlChain>>;
};


export type QueryUserGetPoolJoinExitsArgs = {
  address?: InputMaybe<Scalars['String']['input']>;
  chain?: InputMaybe<GqlChain>;
  first?: InputMaybe<Scalars['Int']['input']>;
  poolId: Scalars['String']['input'];
  skip?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryUserGetStakingArgs = {
  address?: InputMaybe<Scalars['String']['input']>;
  chains?: InputMaybe<Array<GqlChain>>;
};


export type QueryUserGetSwapsArgs = {
  address?: InputMaybe<Scalars['String']['input']>;
  chain?: InputMaybe<GqlChain>;
  first?: InputMaybe<Scalars['Int']['input']>;
  poolId: Scalars['String']['input'];
  skip?: InputMaybe<Scalars['Int']['input']>;
};

export type Token = {
  __typename?: 'Token';
  address: Scalars['String']['output'];
  decimals: Scalars['Int']['output'];
};

export type VeBalGetVotingListQueryVariables = Exact<{ [key: string]: never; }>;


export type VeBalGetVotingListQuery = { __typename?: 'Query', veBalGetVotingList: Array<{ __typename?: 'GqlVotingPool', id: string, address: any, chain: GqlChain, symbol: string, type: GqlPoolType, gauge: { __typename?: 'GqlVotingGauge', address: any, isKilled: boolean, addedTimestamp?: number | null } }> };


export const VeBalGetVotingListDocument = gql`
    query veBalGetVotingList {
  veBalGetVotingList {
    id
    address
    chain
    symbol
    type
    gauge {
      address
      isKilled
      addedTimestamp
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    veBalGetVotingList(variables?: VeBalGetVotingListQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<VeBalGetVotingListQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<VeBalGetVotingListQuery>(VeBalGetVotingListDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'veBalGetVotingList', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;