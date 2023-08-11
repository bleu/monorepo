import {
  bnum,
  GyroEV2Pool,
  OldBigNumber,
  safeParseFixed,
  SubgraphPoolBase,
  SubgraphToken,
} from "@balancer-labs/sor";

import { bigNumberToOldBigNumber } from "../conversions";
import { IAMMFunctionality } from "../types";

type GyroEPoolToken = Pick<SubgraphToken, "address" | "balance" | "decimals">;
export type GyroEPoolPairData = ReturnType<
  typeof GyroEV2Pool.prototype.parsePoolPairData
>;
export type GyroEParamsFromSubgraph = {
  alpha: string;
  beta: string;
  c: string;
  s: string;
  lambda: string;
};
export type DerivedGyroEParamsFromSubgraph = {
  tauAlphaX: string;
  tauAlphaY: string;
  tauBetaX: string;
  tauBetaY: string;
  u: string;
  v: string;
  w: string;
  z: string;
  dSq: string;
};
export interface IGyroEMaths {
  swapFee: string;
  totalShares: string;
  tokens: GyroEPoolToken[];
  tokensList: string[];
  gyroEParams: GyroEParamsFromSubgraph;
  derivedGyroEParams: DerivedGyroEParamsFromSubgraph;
  tokenRates: string[];
}
export class ExtendedGyroEV2
  extends GyroEV2Pool
  implements IAMMFunctionality<GyroEPoolPairData>
{
  constructor(poolParams: IGyroEMaths) {
    super(
      "0x",
      "0x",
      poolParams.swapFee,
      poolParams.totalShares,
      poolParams.tokens,
      poolParams.tokensList,
      poolParams.gyroEParams,
      poolParams.derivedGyroEParams,
      poolParams.tokenRates,
    );
  }

  static fromPool(pool: SubgraphPoolBase): ExtendedGyroEV2 {
    const {
      alpha,
      beta,
      c,
      s,
      lambda,
      tauAlphaX,
      tauAlphaY,
      tauBetaX,
      tauBetaY,
      u,
      v,
      w,
      z,
      dSq,
      tokenRates,
    } = pool;

    const gyroEParams = {
      alpha,
      beta,
      c,
      s,
      lambda,
    };

    const derivedGyroEParams = {
      tauAlphaX,
      tauAlphaY,
      tauBetaX,
      tauBetaY,
      u,
      v,
      w,
      z,
      dSq,
    };

    if (
      !Object.values(gyroEParams).every((el) => el) ||
      !Object.values(derivedGyroEParams).every((el) => el)
    )
      throw new Error("Pool missing GyroE params and/or GyroE derived params");

    if (!tokenRates) throw new Error("GyroEV2 Pool missing tokenRates");

    return new ExtendedGyroEV2({
      swapFee: pool.swapFee,
      totalShares: pool.totalShares,
      tokens: pool.tokens as GyroEPoolToken[],
      tokensList: pool.tokensList,
      gyroEParams: gyroEParams as GyroEParamsFromSubgraph,
      derivedGyroEParams: derivedGyroEParams as DerivedGyroEParamsFromSubgraph,
      tokenRates: pool.tokenRates as string[],
    });
  }

  parsePoolPairData(tokenIn: string, tokenOut: string): GyroEPoolPairData {
    // This function was developed based on @balancer/sor package, but for work as a symbol instead of address
    const tokenIndexIn = this.tokens.findIndex((t) => t.address === tokenIn);
    if (tokenIndexIn < 0) throw "Pool does not contain tokenIn";
    const tI = this.tokens[tokenIndexIn];
    const balanceIn = tI.balance;
    const decimalsIn = tI.decimals;

    const tokenIndexOut = this.tokens.findIndex((t) => t.address === tokenOut);
    if (tokenIndexOut < 0) throw "Pool does not contain tokenOut";
    const tO = this.tokens[tokenIndexOut];
    const balanceOut = tO.balance;
    const decimalsOut = tO.decimals;

    const tokenInIsToken0 = tokenIndexIn === 0;

    const poolPairData: GyroEPoolPairData = {
      id: this.id,
      address: this.address,
      poolType: this.poolType,
      tokenIn: tokenIn,
      tokenOut: tokenOut,
      decimalsIn: Number(decimalsIn),
      decimalsOut: Number(decimalsOut),
      balanceIn: safeParseFixed(balanceIn, decimalsIn),
      balanceOut: safeParseFixed(balanceOut, decimalsOut),
      swapFee: this.swapFee,
      tokenInIsToken0,
    };

    return poolPairData;
  }
  _spotPrice(poolPairData: GyroEPoolPairData): OldBigNumber {
    return this._spotPriceAfterSwapExactTokenInForTokenOut(
      poolPairData,
      bnum(0),
    );
  }

  _firstGuessOfTokenInForExactSpotPriceAfterSwap(
    poolPairData: GyroEPoolPairData,
  ): OldBigNumber {
    return bigNumberToOldBigNumber(
      poolPairData.balanceIn,
      poolPairData.decimalsIn,
    ).times(bnum(0.01));
  }

  _checkIfInIsOnLimit(
    poolPairData: GyroEPoolPairData,
    amountIn: OldBigNumber,
  ): boolean {
    const amountOut = this._exactTokenInForTokenOut(poolPairData, amountIn);
    return amountOut.toNumber() > 0 && amountIn.toNumber() > 0;
  }
}
