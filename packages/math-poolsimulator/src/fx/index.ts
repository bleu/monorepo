import {
  bnum,
  FxMaths,
  FxPool,
  OldBigNumber,
  safeParseFixed,
  SubgraphPoolBase,
  SubgraphToken,
} from "@balancer-labs/sor";
import { parseFixed } from "@ethersproject/bignumber";

import { bigNumberToOldBigNumber } from "../conversions";
import { IAMMFunctionality } from "../types";

type FxPoolToken = Pick<
  SubgraphToken,
  "address" | "balance" | "decimals" | "token"
>;

export type FxPoolPairData = ReturnType<
  typeof FxPool.prototype.parsePoolPairData
>;

export interface IFxMaths {
  swapFee: string;
  totalShares: string;
  tokens: FxPoolToken[];
  tokensList: string[];
  alpha: string;
  beta: string;
  lambda: string;
  delta: string;
  epsilon: string;
}

export class ExtendedFx
  extends FxPool
  implements IAMMFunctionality<FxPoolPairData>
{
  constructor(poolParams: IFxMaths) {
    super(
      "0x",
      "0x",
      poolParams.swapFee,
      poolParams.totalShares,
      poolParams.tokens,
      poolParams.tokensList,
      poolParams.alpha,
      poolParams.beta,
      poolParams.lambda,
      poolParams.delta,
      poolParams.epsilon
    );
  }

  static fromPool(pool: SubgraphPoolBase): ExtendedFx {
    if (
      !pool.alpha ||
      !pool.beta ||
      !pool.lambda ||
      !pool.delta ||
      !pool.epsilon
    )
      throw new Error("FX Pool Missing Subgraph Field");
    return new ExtendedFx({
      swapFee: pool.swapFee,
      totalShares: pool.totalShares,
      tokens: pool.tokens,
      tokensList: pool.tokensList,
      alpha: pool.alpha,
      beta: pool.beta,
      lambda: pool.lambda,
      delta: pool.delta,
      epsilon: pool.epsilon,
    });
  }

  parsePoolPairData(tokenIn: string, tokenOut: string): FxPoolPairData {
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

    if (!tO.token?.latestFXPrice || !tI.token?.latestFXPrice)
      throw "FX Pool Missing LatestFxPrice";

    if (tO.token?.fxOracleDecimals == null) {
      tO.token.fxOracleDecimals = 8;
    }
    if (tI.token?.fxOracleDecimals == null) {
      tI.token.fxOracleDecimals = 8;
    }

    const poolPairData: FxPoolPairData = {
      id: this.id,
      address: this.address,
      poolType: this.poolType,
      tokenIn: tokenIn,
      tokenOut: tokenOut,
      decimalsIn: Number(decimalsIn),
      decimalsOut: Number(decimalsOut),
      balanceIn: parseFixed(balanceIn, decimalsIn),
      balanceOut: parseFixed(balanceOut, decimalsOut),
      swapFee: this.swapFee,
      alpha: this.alpha,
      beta: this.beta,
      lambda: this.lambda,
      delta: this.delta,
      epsilon: this.epsilon,
      tokenInLatestFXPrice: parseFixed(
        tI.token.latestFXPrice,
        tI.token.fxOracleDecimals
      ), // decimals is formatted from subgraph in rate we get from the chainlink oracle
      tokenOutLatestFXPrice: parseFixed(
        tO.token.latestFXPrice,
        tO.token.fxOracleDecimals
      ), // decimals is formatted from subgraph in rate we get from the chainlink oracle
      tokenInfxOracleDecimals: tI.token.fxOracleDecimals,
      tokenOutfxOracleDecimals: tO.token.fxOracleDecimals,
    };

    return poolPairData;
  }

  _spotPrice(poolPairData: FxPoolPairData): OldBigNumber {
    return this._inHigherPrecision(
      FxMaths.spotPriceBeforeSwap,
      safeParseFixed(bnum(0).toString(), 36),
      poolPairData
    );
  }

  _firstGuessOfTokenInForExactSpotPriceAfterSwap(
    poolPairData: FxPoolPairData
  ): OldBigNumber {
    return bigNumberToOldBigNumber(
      poolPairData.balanceIn,
      poolPairData.decimalsIn
    ).times(bnum(0.01));
  }

  _checkIfInIsOnLimit(
    poolPairData: FxPoolPairData,
    amountIn: OldBigNumber
  ): boolean {
    const amountOut = this._exactTokenInForTokenOut(poolPairData, amountIn);
    return amountOut.toNumber() > 0 && amountIn.toNumber() > 0;
  }
}
