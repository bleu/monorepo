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

export type GqlCowSwapApiResponse = {
  __typename?: 'GqlCowSwapApiResponse';
  returnAmount: Scalars['String']['output'];
  swapAmount: Scalars['String']['output'];
  swaps: Array<GqlSwap>;
  tokenAddresses: Array<Scalars['String']['output']>;
  tokenIn: Scalars['String']['output'];
  tokenOut: Scalars['String']['output'];
};

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
  prices: Array<GqlHistoricalTokenPriceEntry>;
};

export type GqlHistoricalTokenPriceEntry = {
  __typename?: 'GqlHistoricalTokenPriceEntry';
  price: Scalars['Float']['output'];
  timestamp: Scalars['String']['output'];
};

export type GqlLatestSyncedBlocks = {
  __typename?: 'GqlLatestSyncedBlocks';
  poolSyncBlock: Scalars['BigInt']['output'];
  userStakeSyncBlock: Scalars['BigInt']['output'];
  userWalletSyncBlock: Scalars['BigInt']['output'];
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

export type GqlPoolBase = {
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
  owner?: Maybe<Scalars['Bytes']['output']>;
  staking?: Maybe<GqlPoolStaking>;
  symbol: Scalars['String']['output'];
  type: GqlPoolType;
  userBalance?: Maybe<GqlPoolUserBalance>;
  version: Scalars['Int']['output'];
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
  staking?: Maybe<GqlPoolStaking>;
  symbol: Scalars['String']['output'];
  tokens: Array<GqlPoolTokenUnion>;
  type: GqlPoolType;
  userBalance?: Maybe<GqlPoolUserBalance>;
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
  principalToken: Scalars['Bytes']['output'];
  staking?: Maybe<GqlPoolStaking>;
  symbol: Scalars['String']['output'];
  tokens: Array<GqlPoolToken>;
  type: GqlPoolType;
  unitSeconds: Scalars['BigInt']['output'];
  userBalance?: Maybe<GqlPoolUserBalance>;
  version: Scalars['Int']['output'];
  withdrawConfig: GqlPoolWithdrawConfig;
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
  poolTypeIn?: InputMaybe<Array<GqlPoolType>>;
  poolTypeNotIn?: InputMaybe<Array<GqlPoolType>>;
  tokensIn?: InputMaybe<Array<Scalars['String']['input']>>;
  tokensNotIn?: InputMaybe<Array<Scalars['String']['input']>>;
  userAddress?: InputMaybe<Scalars['String']['input']>;
};

export type GqlPoolFilterCategory =
  | 'BLACK_LISTED'
  | 'INCENTIVIZED'
  | '%future added value';

export type GqlPoolFilterDefinition = {
  __typename?: 'GqlPoolFilterDefinition';
  id: Scalars['ID']['output'];
  title: Scalars['String']['output'];
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

export type GqlPoolLinear = GqlPoolBase & {
  __typename?: 'GqlPoolLinear';
  address: Scalars['Bytes']['output'];
  allTokens: Array<GqlPoolTokenExpanded>;
  bptPriceRate: Scalars['BigDecimal']['output'];
  chain: GqlChain;
  createTime: Scalars['Int']['output'];
  decimals: Scalars['Int']['output'];
  displayTokens: Array<GqlPoolTokenDisplay>;
  dynamicData: GqlPoolDynamicData;
  factory?: Maybe<Scalars['Bytes']['output']>;
  id: Scalars['ID']['output'];
  investConfig: GqlPoolInvestConfig;
  lowerTarget: Scalars['BigInt']['output'];
  mainIndex: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  owner: Scalars['Bytes']['output'];
  staking?: Maybe<GqlPoolStaking>;
  symbol: Scalars['String']['output'];
  tokens: Array<GqlPoolToken>;
  type: GqlPoolType;
  upperTarget: Scalars['BigInt']['output'];
  userBalance?: Maybe<GqlPoolUserBalance>;
  version: Scalars['Int']['output'];
  withdrawConfig: GqlPoolWithdrawConfig;
  wrappedIndex: Scalars['Int']['output'];
};

export type GqlPoolLinearNested = {
  __typename?: 'GqlPoolLinearNested';
  address: Scalars['Bytes']['output'];
  bptPriceRate: Scalars['BigDecimal']['output'];
  createTime: Scalars['Int']['output'];
  factory?: Maybe<Scalars['Bytes']['output']>;
  id: Scalars['ID']['output'];
  lowerTarget: Scalars['BigInt']['output'];
  mainIndex: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  owner: Scalars['Bytes']['output'];
  symbol: Scalars['String']['output'];
  tokens: Array<GqlPoolToken>;
  totalLiquidity: Scalars['BigDecimal']['output'];
  totalShares: Scalars['BigDecimal']['output'];
  type: GqlPoolType;
  upperTarget: Scalars['BigInt']['output'];
  version: Scalars['Int']['output'];
  wrappedIndex: Scalars['Int']['output'];
};

export type GqlPoolLinearPoolData = {
  __typename?: 'GqlPoolLinearPoolData';
  address: Scalars['String']['output'];
  balance: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  mainToken: GqlPoolLinearPoolMainToken;
  mainTokenTotalBalance: Scalars['String']['output'];
  poolToken: Scalars['String']['output'];
  priceRate: Scalars['String']['output'];
  symbol: Scalars['String']['output'];
  totalSupply: Scalars['String']['output'];
  unwrappedTokenAddress: Scalars['String']['output'];
  wrappedToken: GqlPoolLinearPoolWrappedToken;
};

export type GqlPoolLinearPoolMainToken = {
  __typename?: 'GqlPoolLinearPoolMainToken';
  address: Scalars['String']['output'];
  balance: Scalars['String']['output'];
  decimals: Scalars['Int']['output'];
  index: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  symbol: Scalars['String']['output'];
  totalSupply: Scalars['String']['output'];
};

export type GqlPoolLinearPoolWrappedToken = {
  __typename?: 'GqlPoolLinearPoolWrappedToken';
  address: Scalars['String']['output'];
  balance: Scalars['String']['output'];
  decimals: Scalars['Int']['output'];
  index: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  priceRate: Scalars['String']['output'];
  symbol: Scalars['String']['output'];
  totalSupply: Scalars['String']['output'];
};

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
  staking?: Maybe<GqlPoolStaking>;
  symbol: Scalars['String']['output'];
  tokens: Array<GqlPoolTokenUnion>;
  type: GqlPoolType;
  userBalance?: Maybe<GqlPoolUserBalance>;
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
  staking?: Maybe<GqlPoolStaking>;
  symbol: Scalars['String']['output'];
  tokens: Array<GqlPoolToken>;
  type: GqlPoolType;
  userBalance?: Maybe<GqlPoolUserBalance>;
  version: Scalars['Int']['output'];
  withdrawConfig: GqlPoolWithdrawConfig;
};

export type GqlPoolMinimal = {
  __typename?: 'GqlPoolMinimal';
  address: Scalars['Bytes']['output'];
  allTokens: Array<GqlPoolTokenExpanded>;
  chain: GqlChain;
  createTime: Scalars['Int']['output'];
  decimals: Scalars['Int']['output'];
  displayTokens: Array<GqlPoolTokenDisplay>;
  dynamicData: GqlPoolDynamicData;
  factory?: Maybe<Scalars['Bytes']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  owner?: Maybe<Scalars['Bytes']['output']>;
  staking?: Maybe<GqlPoolStaking>;
  symbol: Scalars['String']['output'];
  type: GqlPoolType;
  userBalance?: Maybe<GqlPoolUserBalance>;
  version: Scalars['Int']['output'];
};

export type GqlPoolNestedUnion = GqlPoolComposableStableNested | GqlPoolLinearNested;

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
  staking?: Maybe<GqlPoolStaking>;
  symbol: Scalars['String']['output'];
  tokens: Array<GqlPoolToken>;
  type: GqlPoolType;
  userBalance?: Maybe<GqlPoolUserBalance>;
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
  symbol: Scalars['String']['output'];
  totalBalance: Scalars['BigDecimal']['output'];
  weight?: Maybe<Scalars['BigDecimal']['output']>;
};

export type GqlPoolTokenComposableStableNestedUnion = GqlPoolToken | GqlPoolTokenLinear;

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

export type GqlPoolTokenLinear = GqlPoolTokenBase & {
  __typename?: 'GqlPoolTokenLinear';
  address: Scalars['String']['output'];
  balance: Scalars['BigDecimal']['output'];
  decimals: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  index: Scalars['Int']['output'];
  mainTokenBalance: Scalars['BigDecimal']['output'];
  name: Scalars['String']['output'];
  pool: GqlPoolLinearNested;
  priceRate: Scalars['BigDecimal']['output'];
  symbol: Scalars['String']['output'];
  totalBalance: Scalars['BigDecimal']['output'];
  totalMainTokenBalance: Scalars['BigDecimal']['output'];
  weight?: Maybe<Scalars['BigDecimal']['output']>;
  wrappedTokenBalance: Scalars['BigDecimal']['output'];
};

export type GqlPoolTokenUnion = GqlPoolToken | GqlPoolTokenComposableStable | GqlPoolTokenLinear;

export type GqlPoolType =
  | 'COMPOSABLE_STABLE'
  | 'ELEMENT'
  | 'FX'
  | 'GYRO'
  | 'GYRO3'
  | 'GYROE'
  | 'INVESTMENT'
  | 'LINEAR'
  | 'LIQUIDITY_BOOTSTRAPPING'
  | 'META_STABLE'
  | 'PHANTOM_STABLE'
  | 'STABLE'
  | 'UNKNOWN'
  | 'WEIGHTED'
  | '%future added value';

export type GqlPoolUnion = GqlPoolComposableStable | GqlPoolElement | GqlPoolGyro | GqlPoolLinear | GqlPoolLiquidityBootstrapping | GqlPoolMetaStable | GqlPoolStable | GqlPoolWeighted;

export type GqlPoolUserBalance = {
  __typename?: 'GqlPoolUserBalance';
  stakedBalance: Scalars['AmountHumanReadable']['output'];
  stakedBalanceUsd: Scalars['Float']['output'];
  totalBalance: Scalars['AmountHumanReadable']['output'];
  totalBalanceUsd: Scalars['Float']['output'];
  walletBalance: Scalars['AmountHumanReadable']['output'];
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
  staking?: Maybe<GqlPoolStaking>;
  symbol: Scalars['String']['output'];
  tokens: Array<GqlPoolTokenUnion>;
  type: GqlPoolType;
  userBalance?: Maybe<GqlPoolUserBalance>;
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

export type GqlSorGetBatchSwapForTokensInResponse = {
  __typename?: 'GqlSorGetBatchSwapForTokensInResponse';
  assets: Array<Scalars['String']['output']>;
  swaps: Array<GqlSorSwap>;
  tokenOutAmount: Scalars['AmountHumanReadable']['output'];
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

export type GqlSorSwap = {
  __typename?: 'GqlSorSwap';
  amount: Scalars['String']['output'];
  assetInIndex: Scalars['Int']['output'];
  assetOutIndex: Scalars['Int']['output'];
  poolId: Scalars['String']['output'];
  userData: Scalars['String']['output'];
};

export type GqlSorSwapOptionsInput = {
  forceRefresh?: InputMaybe<Scalars['Boolean']['input']>;
  maxPools?: InputMaybe<Scalars['Int']['input']>;
  timestamp?: InputMaybe<Scalars['Int']['input']>;
};

export type GqlSorSwapRoute = {
  __typename?: 'GqlSorSwapRoute';
  hops: Array<GqlSorSwapRouteHop>;
  share: Scalars['Float']['output'];
  tokenIn: Scalars['String']['output'];
  tokenInAmount: Scalars['BigDecimal']['output'];
  tokenOut: Scalars['String']['output'];
  tokenOutAmount: Scalars['BigDecimal']['output'];
};

export type GqlSorSwapRouteHop = {
  __typename?: 'GqlSorSwapRouteHop';
  pool: GqlPoolMinimal;
  poolId: Scalars['String']['output'];
  tokenIn: Scalars['String']['output'];
  tokenInAmount: Scalars['BigDecimal']['output'];
  tokenOut: Scalars['String']['output'];
  tokenOutAmount: Scalars['BigDecimal']['output'];
};

export type GqlSorSwapType =
  | 'EXACT_IN'
  | 'EXACT_OUT'
  | '%future added value';

export type GqlSwap = {
  __typename?: 'GqlSwap';
  amount: Scalars['String']['output'];
  assetInIndex: Scalars['Int']['output'];
  assetOutIndex: Scalars['Int']['output'];
  poolId: Scalars['String']['output'];
  userData: Scalars['String']['output'];
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
};

export type GqlTokenPriceChartDataItem = {
  __typename?: 'GqlTokenPriceChartDataItem';
  id: Scalars['ID']['output'];
  price: Scalars['AmountHumanReadable']['output'];
  timestamp: Scalars['Int']['output'];
};

export type GqlTokenType =
  | 'BPT'
  | 'LINEAR_WRAPPED_TOKEN'
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

export type GqlUserPoolSnapshot = {
  __typename?: 'GqlUserPoolSnapshot';
  farmBalance: Scalars['AmountHumanReadable']['output'];
  fees24h: Scalars['AmountHumanReadable']['output'];
  gaugeBalance: Scalars['AmountHumanReadable']['output'];
  percentShare: Scalars['Float']['output'];
  timestamp: Scalars['Int']['output'];
  totalBalance: Scalars['AmountHumanReadable']['output'];
  totalValueUSD: Scalars['AmountHumanReadable']['output'];
  walletBalance: Scalars['AmountHumanReadable']['output'];
};

export type GqlUserPortfolioSnapshot = {
  __typename?: 'GqlUserPortfolioSnapshot';
  farmBalance: Scalars['AmountHumanReadable']['output'];
  fees24h: Scalars['AmountHumanReadable']['output'];
  gaugeBalance: Scalars['AmountHumanReadable']['output'];
  pools: Array<GqlUserPoolSnapshot>;
  timestamp: Scalars['Int']['output'];
  totalBalance: Scalars['AmountHumanReadable']['output'];
  totalFees: Scalars['AmountHumanReadable']['output'];
  totalValueUSD: Scalars['AmountHumanReadable']['output'];
  walletBalance: Scalars['AmountHumanReadable']['output'];
};

export type GqlUserRelicSnapshot = {
  __typename?: 'GqlUserRelicSnapshot';
  relicCount: Scalars['Int']['output'];
  relicSnapshots: Array<GqlRelicSnapshot>;
  timestamp: Scalars['Int']['output'];
  totalBalance: Scalars['String']['output'];
};

export type GqlUserSnapshotDataRange =
  | 'ALL_TIME'
  | 'NINETY_DAYS'
  | 'ONE_HUNDRED_EIGHTY_DAYS'
  | 'ONE_YEAR'
  | 'THIRTY_DAYS'
  | '%future added value';

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
  poolReloadPoolNestedTokens: Scalars['String']['output'];
  poolReloadPoolTokenIndexes: Scalars['String']['output'];
  poolReloadStakingForAllPools: Scalars['String']['output'];
  poolSetPoolsWithPreferredGaugesAsIncentivized: Scalars['String']['output'];
  poolSyncAllPoolTypesVersions: Scalars['String']['output'];
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
  tokenDeletePrice: Scalars['Boolean']['output'];
  tokenDeleteTokenType: Scalars['String']['output'];
  tokenInitChartData: Scalars['String']['output'];
  tokenReloadAllTokenTypes: Scalars['String']['output'];
  tokenReloadTokenPrices?: Maybe<Scalars['Boolean']['output']>;
  tokenSyncLatestFxPrices: Scalars['String']['output'];
  tokenSyncTokenDefinitions: Scalars['String']['output'];
  tokenSyncTokenDynamicData: Scalars['String']['output'];
  userInitStakedBalances: Scalars['String']['output'];
  userInitWalletBalancesForAllPools: Scalars['String']['output'];
  userInitWalletBalancesForPool: Scalars['String']['output'];
  userLoadAllRelicSnapshots: Scalars['String']['output'];
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


export type MutationPoolReloadPoolNestedTokensArgs = {
  poolId: Scalars['String']['input'];
};


export type MutationPoolReloadPoolTokenIndexesArgs = {
  poolId: Scalars['String']['input'];
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


export type MutationTokenDeletePriceArgs = {
  timestamp: Scalars['Int']['input'];
  tokenAddress: Scalars['String']['input'];
};


export type MutationTokenDeleteTokenTypeArgs = {
  tokenAddress: Scalars['String']['input'];
  type: GqlTokenType;
};


export type MutationTokenInitChartDataArgs = {
  tokenAddress: Scalars['String']['input'];
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
  poolGetAllPoolsSnapshots: Array<GqlPoolSnapshot>;
  poolGetBatchSwaps: Array<GqlPoolBatchSwap>;
  poolGetFeaturedPoolGroups: Array<GqlPoolFeaturedPoolGroup>;
  poolGetGyroPools: Array<GqlPoolGyro>;
  poolGetJoinExits: Array<GqlPoolJoinExit>;
  poolGetLinearPools: Array<GqlPoolLinear>;
  poolGetPool: GqlPoolBase;
  poolGetPools: Array<GqlPoolMinimal>;
  poolGetPoolsCount: Scalars['Int']['output'];
  poolGetSnapshots: Array<GqlPoolSnapshot>;
  poolGetSwaps: Array<GqlPoolSwap>;
  protocolMetricsAggregated: GqlProtocolMetricsAggregated;
  protocolMetricsChain: GqlProtocolMetricsChain;
  sorGetBatchSwapForTokensIn: GqlSorGetBatchSwapForTokensInResponse;
  sorGetCowSwaps: GqlCowSwapApiResponse;
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
  userGetPoolJoinExits: Array<GqlPoolJoinExit>;
  userGetPoolSnapshots: Array<GqlUserPoolSnapshot>;
  userGetPortfolioSnapshots: Array<GqlUserPortfolioSnapshot>;
  userGetRelicSnapshots: Array<GqlUserRelicSnapshot>;
  userGetStaking: Array<GqlPoolStaking>;
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


export type QueryPoolGetAllPoolsSnapshotsArgs = {
  chains?: InputMaybe<Array<GqlChain>>;
  range: GqlPoolSnapshotDataRange;
};


export type QueryPoolGetBatchSwapsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<GqlPoolSwapFilter>;
};


export type QueryPoolGetGyroPoolsArgs = {
  chains?: InputMaybe<Array<GqlChain>>;
};


export type QueryPoolGetJoinExitsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<GqlPoolJoinExitFilter>;
};


export type QueryPoolGetLinearPoolsArgs = {
  chains?: InputMaybe<Array<GqlChain>>;
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


export type QuerySorGetBatchSwapForTokensInArgs = {
  swapOptions: GqlSorSwapOptionsInput;
  tokenOut: Scalars['String']['input'];
  tokensIn: Array<GqlTokenAmountHumanReadable>;
};


export type QuerySorGetCowSwapsArgs = {
  chain: GqlChain;
  swapAmount: Scalars['BigDecimal']['input'];
  swapType: GqlSorSwapType;
  tokenIn: Scalars['String']['input'];
  tokenOut: Scalars['String']['input'];
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
  range: GqlTokenChartDataRange;
};


export type QueryTokenGetCurrentPricesArgs = {
  chains?: InputMaybe<Array<GqlChain>>;
};


export type QueryTokenGetHistoricalPricesArgs = {
  addresses: Array<Scalars['String']['input']>;
};


export type QueryTokenGetPriceChartDataArgs = {
  address: Scalars['String']['input'];
  range: GqlTokenChartDataRange;
};


export type QueryTokenGetRelativePriceChartDataArgs = {
  range: GqlTokenChartDataRange;
  tokenIn: Scalars['String']['input'];
  tokenOut: Scalars['String']['input'];
};


export type QueryTokenGetTokenDataArgs = {
  address: Scalars['String']['input'];
};


export type QueryTokenGetTokenDynamicDataArgs = {
  address: Scalars['String']['input'];
};


export type QueryTokenGetTokensArgs = {
  chains?: InputMaybe<Array<GqlChain>>;
};


export type QueryTokenGetTokensDataArgs = {
  addresses: Array<Scalars['String']['input']>;
};


export type QueryTokenGetTokensDynamicDataArgs = {
  addresses: Array<Scalars['String']['input']>;
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


export type QueryUserGetPoolSnapshotsArgs = {
  chain: GqlChain;
  poolId: Scalars['String']['input'];
  range: GqlUserSnapshotDataRange;
};


export type QueryUserGetPortfolioSnapshotsArgs = {
  days: Scalars['Int']['input'];
};


export type QueryUserGetRelicSnapshotsArgs = {
  farmId: Scalars['String']['input'];
  range: GqlUserSnapshotDataRange;
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

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    veBalGetVotingList(variables?: VeBalGetVotingListQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<VeBalGetVotingListQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<VeBalGetVotingListQuery>(VeBalGetVotingListDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'veBalGetVotingList', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;