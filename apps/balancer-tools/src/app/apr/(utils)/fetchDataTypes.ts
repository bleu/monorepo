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

export interface APR {
  total: number;
  breakdown: APRBreakdown;
}

export interface PoolStats {
  apr: APR;
  volume: number;
  tvl: number;
  votingShare: number;
  symbol: string;
  network: string;
  poolId: string | null;
  type: PoolTypeEnum;
  tokens: PoolTokens[];
}

export interface PoolStatsData extends PoolStats {
  collectedFeesUSD: number;
}

export interface PoolStatsResultsPerDay {
  [date: string]: PoolStatsData;
}

export interface PoolStatsResults {
  perDay: PoolStatsResultsPerDay[];
}
