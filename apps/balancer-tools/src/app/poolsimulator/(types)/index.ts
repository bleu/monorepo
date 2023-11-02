import { IGyro2Maths } from "@bleu/math-poolsimulator/src/gyro2";
import { IGyro3Maths } from "@bleu/math-poolsimulator/src/gyro3";
import { GyroEParamsFromSubgraph } from "@bleu/math-poolsimulator/src/gyroE";

type ConvertToNumber<T> = {
  [K in keyof T]?: number;
};

export interface TokensData {
  symbol: string;
  balance: number;
  decimal: number;
  rate?: number;
  fxOracleDecimals?: number;
}

export interface MetaStableParams {
  ampFactor?: number;
  swapFee?: number;
}

export type Gyro2Params = Partial<
  ConvertToNumber<Pick<IGyro2Maths, "swapFee" | "sqrtAlpha" | "sqrtBeta">>
>;

export type Gyro3Params = Partial<
  ConvertToNumber<Pick<IGyro3Maths, "swapFee" | "root3Alpha">>
>;

export interface FxParams {
  alpha?: number;
  beta?: number;
  lambda?: number;
  delta?: number;
  epsilon?: number;
}

export type GyroEParams = ConvertToNumber<GyroEParamsFromSubgraph>;

export type CombinedParams = MetaStableParams &
  GyroEParams &
  Gyro2Params &
  Gyro3Params &
  FxParams;

export enum PoolTypeEnum {
  MetaStable = "MetaStable",
  GyroE = "GyroE",
  Gyro2 = "Gyro2",
  Gyro3 = "Gyro3",
  Fx = "FX",
}
