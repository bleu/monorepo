import {
  DerivedGyroEParamsFromSubgraph,
  GyroEParamsFromSubgraph,
} from "@bleu-balancer-tools/math-poolsimulator/src/gyroE";

type NumberGyroEParams<T> = {
  [K in keyof T]?: number;
};

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

//TODO substitute with Gyro2ParamsFromSubgraph issue BAL-501
export interface Gyro2Params {
  swapFee?: number;
  sqrtAlpha?: number;
  sqrtBeta?: number;
}

//TODO substitute with Gyro3ParamsFromSubgraph issue BAL-501
export interface Gyro3Params {
  swapFee?: number;
  root3Alpha?: number;
}

export type GyroEParams = NumberGyroEParams<
  GyroEParamsFromSubgraph & DerivedGyroEParamsFromSubgraph
>;

export type CombinedParams = MetaStableParams &
  GyroEParams &
  Gyro2Params &
  Gyro3Params;

export enum PoolTypeEnum {
  MetaStable = "MetaStable",
  GyroE = "GyroE",
  Gyro2 = "Gyro2",
  Gyro3 = "Gyro3",
}
