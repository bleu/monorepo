import {
  bnum,
  // FxMaths,
  FxPool,
  OldBigNumber,
  // safeParseFixed,
  SubgraphPoolBase,
  SubgraphToken,
} from "@balancer-labs/sor";
import { BigNumber, formatFixed, parseFixed } from "@ethersproject/bignumber";

import {
  bigNumberToOldBigNumber,
  // bigNumberToString,
  numberToBigNumber,
  // oldBigNumberToString,
} from "../conversions";
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

  // Updates the balance of a given token for the pool
  updateTokenBalanceForPool(token: string, newBalance: BigNumber): void {
    // Function copied from sor and changed to accept any string as address
    // token is BPT
    if (this.address == token) {
      this.totalShares = newBalance;
    } else {
      // token is underlying in the pool
      const T = this.tokens.find((t) => t.address === token);
      if (!T) throw Error("Pool does not contain this token");
      T.balance = formatFixed(newBalance, T.decimals);
    }
  }

  // _copyPool(): ExtendedFx {
  //   return new ExtendedFx({
  //     swapFee: bigNumberToString(this.swapFee, 18),
  //     totalShares: bigNumberToString(this.totalShares, 18),
  //     tokens: [...this.tokens],
  //     tokensList: this.tokensList,
  //     alpha: oldBigNumberToString(this.alpha),
  //     beta: oldBigNumberToString(this.beta),
  //     lambda: oldBigNumberToString(this.lambda),
  //     delta: oldBigNumberToString(this.delta),
  //     epsilon: oldBigNumberToString(this.epsilon),
  //   });
  // }

  _spotPrice(poolPairData: FxPoolPairData): OldBigNumber {
    return this._spotPriceAfterSwapExactTokenInForTokenOut(
      poolPairData,
      bnum("0")
    );
  }

  parsePoolPairDataAfterSwap(
    tokenIn: string,
    tokenOut: string,
    amountIn: OldBigNumber,
    amountOut: OldBigNumber
  ): FxPoolPairData {
    const balanceInString = this.tokens.find((t) => t.address === tokenIn)
      ?.balance as string;
    const decimalsIn = this.tokens.find((t) => t.address === tokenIn)
      ?.decimals as number;
    const balanceOut = this.tokens.find((t) => t.address === tokenOut)
      ?.balance as string;
    const decimalsOut = this.tokens.find((t) => t.address === tokenOut)
      ?.decimals as number;

    const balanceInBigNumber = numberToBigNumber({
      number: Number(balanceInString),
      decimals: decimalsIn,
    });
    const balanceOutBigNumber = numberToBigNumber({
      number: Number(balanceOut),
      decimals: decimalsOut,
    });

    this.updateTokenBalanceForPool(
      tokenIn,
      balanceInBigNumber.add(
        numberToBigNumber({
          number: amountIn.toNumber(),
          decimals: decimalsIn,
        })
      )
    );

    this.updateTokenBalanceForPool(
      tokenOut,
      balanceOutBigNumber.sub(
        numberToBigNumber({
          number: amountOut.toNumber(),
          decimals: decimalsOut,
        })
      )
    );

    const poolPairDataAfterSwap = this.parsePoolPairData(tokenIn, tokenOut);

    this.updateTokenBalanceForPool(tokenIn, balanceInBigNumber);
    this.updateTokenBalanceForPool(tokenOut, balanceOutBigNumber);

    return poolPairDataAfterSwap;
  }

  // _spotPriceAfterSwapExactTokenInForTokenOut(
  //   poolPairData: FxPoolPairData,
  //   amount: OldBigNumber
  // ): OldBigNumber {
  //   const amountOut = this._exactTokenInForTokenOut(poolPairData, amount);

  //   const poolPairDataAfterSwap = this.parsePoolPairDataAfterSwap(
  //     poolPairData.tokenIn,
  //     poolPairData.tokenOut,
  //     amount,
  //     amountOut
  //   );

  //   return this._inHigherPrecision(
  //     FxMaths._spotPriceAfterSwapExactTokenInForTokenOut,
  //     safeParseFixed("1", 36),
  //     poolPairDataAfterSwap
  //   );
  // }

  // _spotPriceAfterSwapTokenInForExactTokenOut(
  //   poolPairData: FxPoolPairData,
  //   amount: OldBigNumber
  // ): OldBigNumber {
  //   const amountIn = this._tokenInForExactTokenOut(poolPairData, amount);

  //   const poolPairDataAfterSwap = this.parsePoolPairDataAfterSwap(
  //     poolPairData.tokenIn,
  //     poolPairData.tokenOut,
  //     amountIn,
  //     amount
  //   );

  //   return this._inHigherPrecision(
  //     FxMaths.spotPriceBeforeSwap,
  //     safeParseFixed("0", 36),
  //     poolPairDataAfterSwap
  //   );
  // }

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
