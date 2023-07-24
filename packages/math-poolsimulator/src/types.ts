/* eslint-disable @typescript-eslint/no-explicit-any */
import { GyroEPoolPairData, IGyroEMaths } from "gyroE";
import { IMetaStableMath, MetaStablePoolPairData } from "metastable";

export type PoolPairData = MetaStablePoolPairData | GyroEPoolPairData;
export type PoolParams = IMetaStableMath | IGyroEMaths;

export interface IAMMFunctionality<TPoolPairData extends PoolPairData> {
  parsePoolPairData(tokenIn: string, tokenOut: string): TPoolPairData;
  _exactTokenInForTokenOut(poolPairData: TPoolPairData, amountIn: any): any;
  _tokenInForExactTokenOut(poolPairData: TPoolPairData, amountOut: any): any;
  _spotPrice(poolPairData: TPoolPairData): any;
}
