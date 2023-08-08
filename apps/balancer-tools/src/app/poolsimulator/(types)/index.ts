import { IGyro2Maths } from "@bleu-balancer-tools/math-poolsimulator/src/gyro2";
import { GyroEParamsFromSubgraph } from "@bleu-balancer-tools/math-poolsimulator/src/gyroE";

type ConvertToNumber<T> = {
  [K in keyof T]?: number;
};

export interface TokensData {
  symbol: string;
  balance: number;
  decimal: number;
  rate?: number;
  weight?: number;
}

export type MetaStableParams = {
  ampFactor?: number;
  swapFee?: number;
};

export type Gyro2Params = Partial<
  ConvertToNumber<Pick<IGyro2Maths, "swapFee" | "sqrtAlpha" | "sqrtBeta">>
>;

//TODO substitute with Gyro3ParamsFromSubgraph issue BAL-501
export interface Gyro3Params {
  swapFee?: number;
  root3Alpha?: number;
}

export type GyroEParams = ConvertToNumber<GyroEParamsFromSubgraph>;

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
