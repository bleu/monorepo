export interface TokensData {
  symbol: string;
  balance: number;
  decimal: number;
  rate?: number;
  weight?: number;
}

export interface MetaStableParams {
  ampFactor?: number;
  swapFee?: number;
}

export interface GyroEParams {
  alpha?: number;
  beta?: number;
  lambda?: number;
  c?: number;
  s?: number;
  swapFee?: number;
  tauAlphaX?: number;
  tauAlphaY?: number;
  tauBetaX?: number;
  tauBetaY?: number;
  u?: number;
  v?: number;
  w?: number;
  z?: number;
  dSq?: number;
}

export type CombinedParams = MetaStableParams & GyroEParams;

export enum PoolTypeEnum {
  MetaStable = "MetaStable",
  GyroE = "GyroE",
}
