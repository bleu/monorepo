/* eslint-disable @typescript-eslint/no-explicit-any */
import { OldBigNumber } from "@balancer-labs/sor";

import { Gyro2PoolPairData, IGyro2Maths } from "./gyro2";
import { GyroEPoolPairData, IGyroEMaths } from "./gyroE";
import { IMetaStableMath, MetaStablePoolPairData } from "./metastable";

export type PoolPairData =
  | MetaStablePoolPairData
  | GyroEPoolPairData
  | Gyro2PoolPairData;
export type PoolParams = IMetaStableMath | IGyroEMaths | IGyro2Maths;

export interface IAMMFunctionality<TPoolPairData extends PoolPairData> {
  parsePoolPairData(tokenIn: string, tokenOut: string): TPoolPairData;
  _exactTokenInForTokenOut(
    poolPairData: TPoolPairData,
    amountIn: OldBigNumber,
  ): OldBigNumber;
  _tokenInForExactTokenOut(
    poolPairData: TPoolPairData,
    amountOut: OldBigNumber,
  ): OldBigNumber;
  _spotPrice(poolPairData: TPoolPairData): OldBigNumber;
  _spotPriceAfterSwapExactTokenInForTokenOut(
    poolPairData: TPoolPairData,
    amountIn: OldBigNumber,
  ): OldBigNumber;
  _derivativeSpotPriceAfterSwapExactTokenInForTokenOut(
    poolPairData: TPoolPairData,
    amountIn: OldBigNumber,
  ): OldBigNumber;
  _firstGuessOfTokenInForExactSpotPriceAfterSwap(
    poolPairData: TPoolPairData,
  ): OldBigNumber;
}
