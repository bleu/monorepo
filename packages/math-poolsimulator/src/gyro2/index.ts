/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  bnum,
  Gyro2Maths,
  Gyro2Pool,
  GyroHelpers,
  GyroHelpersSignedFixedPoint,
  OldBigNumber,
  safeParseFixed,
  SubgraphPoolBase,
  SubgraphToken,
} from "@balancer-labs/sor";
import { BigNumber, formatFixed } from "@ethersproject/bignumber";
import { WeiPerEther as ONE } from "@ethersproject/constants";
import { IAMMFunctionality } from "types";

import { bigNumberToOldBigNumber } from "../conversions";

type Gyro2PoolToken = Pick<SubgraphToken, "address" | "balance" | "decimals">;

export type Gyro2PoolPairData = ReturnType<
  typeof Gyro2Pool.prototype.parsePoolPairData
>;

export interface IGyro2Maths {
  swapFee: string;
  totalShares: string;
  tokens: Gyro2PoolToken[];
  tokensList: string[];
  sqrtAlpha: string;
  sqrtBeta: string;
}

export class ExtendedGyro2
  extends Gyro2Pool
  implements IAMMFunctionality<Gyro2PoolPairData>
{
  constructor(poolParams: IGyro2Maths) {
    super(
      "0x",
      "0x",
      poolParams.swapFee,
      poolParams.totalShares,
      poolParams.tokens,
      poolParams.tokensList,
      poolParams.sqrtAlpha,
      poolParams.sqrtBeta
    );
  }

  static fromPool(pool: SubgraphPoolBase): ExtendedGyro2 {
    if (!pool.sqrtAlpha || !pool.sqrtBeta)
      throw new Error("Gyro2Pool missing sqrtAlpha or sqrtBeta");
    return new ExtendedGyro2({
      swapFee: pool.swapFee,
      totalShares: pool.totalShares,
      tokens: pool.tokens,
      tokensList: pool.tokensList,
      sqrtAlpha: pool.sqrtAlpha,
      sqrtBeta: pool.sqrtBeta,
    });
  }

  parsePoolPairData(tokenIn: string, tokenOut: string): Gyro2PoolPairData {
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

    const poolPairData: Gyro2PoolPairData = {
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
      sqrtAlpha: tokenInIsToken0
        ? this.sqrtAlpha
        : GyroHelpersSignedFixedPoint.divDown(ONE, this.sqrtBeta),
      sqrtBeta: tokenInIsToken0
        ? this.sqrtBeta
        : GyroHelpersSignedFixedPoint.divDown(ONE, this.sqrtAlpha),
    };

    return poolPairData;
  }

  _calculateSpotPriceWithoutSwap(
    balances: BigNumber[],
    virtualParamIn: BigNumber,
    virtualParamOut: BigNumber,
    swapFee: BigNumber
  ): BigNumber {
    const afterFeeMultiplier = ONE.sub(swapFee); // 1 - s
    const virtIn = balances[0].add(virtualParamIn); // x + virtualParamX = x'
    const virtOut = balances[1].add(virtualParamOut); // y + virtualParamY = y'

    const numerator = virtIn;
    const denominator = GyroHelpersSignedFixedPoint.mulDown(
      afterFeeMultiplier,
      virtOut
    );
    const newSpotPrice = GyroHelpersSignedFixedPoint.divDown(
      numerator,
      denominator
    );

    return newSpotPrice;
  }

  _spotPrice(poolPairData: Gyro2PoolPairData): OldBigNumber {
    try {
      const balances = [poolPairData.balanceIn, poolPairData.balanceOut];
      const normalizedBalances = GyroHelpers._normalizeBalances(balances, [
        poolPairData.decimalsIn,
        poolPairData.decimalsOut,
      ]);
      const invariant = Gyro2Maths._calculateInvariant(
        normalizedBalances,
        poolPairData.sqrtAlpha,
        poolPairData.sqrtBeta
      );

      const [virtualParamIn, virtualParamOut] = Gyro2Maths._findVirtualParams(
        invariant,
        poolPairData.sqrtAlpha,
        poolPairData.sqrtBeta
      );

      // Here you can calculate the spot price based on the current state of the pool
      // without performing any swaps.
      const spotPrice = this._calculateSpotPriceWithoutSwap(
        normalizedBalances,
        virtualParamIn,
        virtualParamOut,
        poolPairData.swapFee
      );

      return bnum(formatFixed(spotPrice, 18));
    } catch (error) {
      return bnum(0);
    }
  }
  _firstGuessOfTokenInForExactSpotPriceAfterSwap(
    poolPairData: Gyro2PoolPairData
  ): OldBigNumber {
    return bigNumberToOldBigNumber(
      poolPairData.balanceIn,
      poolPairData.decimalsIn
    ).times(bnum(0.01));
  }
}
