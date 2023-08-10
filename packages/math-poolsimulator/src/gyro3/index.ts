import {
  bnum,
  Gyro3Pool,
  OldBigNumber,
  safeParseFixed,
  SubgraphPoolBase,
  SubgraphToken,
} from "@balancer-labs/sor";

import { bigNumberToOldBigNumber } from "../conversions";
import { IAMMFunctionality } from "../types";

type Gyro3PoolToken = Pick<SubgraphToken, "address" | "balance" | "decimals">;

export type Gyro3PoolPairData = ReturnType<
  typeof Gyro3Pool.prototype.parsePoolPairData
>;

export interface IGyro3Maths {
  swapFee: string;
  totalShares: string;
  tokens: Gyro3PoolToken[];
  tokensList: string[];
  root3Alpha: string;
}

export class ExtendedGyro3
  extends Gyro3Pool
  implements IAMMFunctionality<Gyro3PoolPairData>
{
  constructor(poolParams: IGyro3Maths) {
    super(
      "0x",
      "0x",
      poolParams.swapFee,
      poolParams.totalShares,
      poolParams.tokens,
      poolParams.tokensList,
      poolParams.root3Alpha,
    );
  }
  static fromPool(pool: SubgraphPoolBase): ExtendedGyro3 {
    if (!pool.root3Alpha) throw new Error("Gyro3Pool missing root3Alpha");
    return new ExtendedGyro3({
      swapFee: pool.swapFee,
      totalShares: pool.totalShares,
      tokens: pool.tokens,
      tokensList: pool.tokensList,
      root3Alpha: pool.root3Alpha,
    });
  }

  parsePoolPairData(tokenIn: string, tokenOut: string): Gyro3PoolPairData {
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

    const tokenTertiary = this.tokens.find(
      (t) => t.address !== tokenOut && t.address !== tokenIn,
    );

    if (!tokenTertiary)
      throw new Error("Pool does not contain a valid third token");

    const balanceTertiary = tokenTertiary.balance;
    const decimalsTertiary = tokenTertiary.decimals;

    const poolPairData: Gyro3PoolPairData = {
      id: this.id,
      address: this.address,
      poolType: this.poolType,
      tokenIn: tokenIn,
      tokenOut: tokenOut,
      decimalsIn: Number(decimalsIn),
      decimalsOut: Number(decimalsOut),
      decimalsTertiary: Number(decimalsTertiary),
      balanceIn: safeParseFixed(balanceIn, decimalsIn),
      balanceOut: safeParseFixed(balanceOut, decimalsOut),
      swapFee: this.swapFee,
      balanceTertiary: safeParseFixed(balanceTertiary, decimalsTertiary),
    };

    return poolPairData;
  }

  _spotPrice(poolPairData: Gyro3PoolPairData): OldBigNumber {
    return this._spotPriceAfterSwapExactTokenInForTokenOut(
      poolPairData,
      bnum(0),
    );
  }
  _firstGuessOfTokenInForExactSpotPriceAfterSwap(
    poolPairData: Gyro3PoolPairData,
  ): OldBigNumber {
    return bigNumberToOldBigNumber(
      poolPairData.balanceIn,
      poolPairData.decimalsIn,
    ).times(bnum(0.01));
  }
  _checkIfInIsOnLimit(
    poolPairData: Gyro3PoolPairData,
    amountIn: OldBigNumber,
  ): boolean {
    const amountOut = this._exactTokenInForTokenOut(poolPairData, amountIn);
    return amountOut.toNumber() > 0 && amountIn.toNumber() > 0;
  }
}
