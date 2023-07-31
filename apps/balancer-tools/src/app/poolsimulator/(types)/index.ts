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

export type GyroEParams = NumberGyroEParams<
  GyroEParamsFromSubgraph & DerivedGyroEParamsFromSubgraph
>;

export type CombinedParams = MetaStableParams & GyroEParams;

export enum PoolTypeEnum {
  MetaStable = "MetaStable",
  GyroE = "GyroE",
}
