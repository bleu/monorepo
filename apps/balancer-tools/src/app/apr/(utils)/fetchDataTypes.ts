import { PoolTypeEnum } from "./types";

export interface TokenAPR {
  address: string;
  symbol: string;
  yield: number;
}

export interface RewardAPR {
  address: string;
  symbol: string;
  value: number;
}

export interface PoolTokens {
  address: string | null;
  symbol: string | null;
  weight: number | null;
  logoSrc?: string;
}
interface APRBreakdown {
  veBAL: number;
  swapFee: number;
  tokens: {
    total: number;
    breakdown: TokenAPR[];
  };
  rewards: {
    total: number;
    breakdown: RewardAPR[];
  };
}

interface APRSimpleBreakdown {
  veBAL: number;
  swapFee: number;
  tokens: number;
  rewards: number;
}

export interface APRwithBreakdown {
  total: number;
  breakdown: APRBreakdown;
}

export interface APRwithoutBreakdown {
  total: number;
  breakdown: APRSimpleBreakdown;
}

export interface PoolStats {
  apr: APRwithoutBreakdown;
  volume: number;
  tvl: number;
  symbol: string;
  network: string;
  poolId: string | null;
  type: PoolTypeEnum;
  tokens: PoolTokens[];
}

export interface PoolStatsData {
  collectedFeesUSD: number;
  apr: APRwithBreakdown;
  volume: number;
  tvl: number;
  votingShare: number;
  symbol: string;
  network: string;
  poolId: string | null;
  type: PoolTypeEnum;
  tokens: PoolTokens[];
}

export interface PoolStatsResultsPerDay {
  [date: string]: PoolStatsData;
}

export interface PoolStatsResults {
  perDay: PoolStatsResultsPerDay[];
}
