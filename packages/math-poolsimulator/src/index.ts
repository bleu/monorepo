import { bnum, OldBigNumber } from "@balancer-labs/sor";

import { IAMMFunctionality, PoolPairData } from "./types";

export class AMM<TPoolPairData extends PoolPairData> {
  private math: IAMMFunctionality<TPoolPairData>;

  constructor(math: IAMMFunctionality<TPoolPairData>) {
    this.math = math;
  }

  exactTokenInForTokenOut(
    amountIn: number,
    tokenIn: string,
    tokenOut: string,
  ): number {
    const poolPairData = this.math.parsePoolPairData(tokenIn, tokenOut);
    return this.math._exactTokenInForTokenOut(poolPairData, amountIn);
  }

  tokenInForExactTokenOut(
    amountOut: number,
    tokenIn: string,
    tokenOut: string,
  ): number {
    const poolPairData = this.math.parsePoolPairData(tokenIn, tokenOut);

    return this.math
      ._tokenInForExactTokenOut(poolPairData, bnum(amountOut))
      .toNumber();
  }

  spotPrice(tokenIn: string, tokenOut: string): number {
    const poolPairData = this.math.parsePoolPairData(tokenIn, tokenOut);
    return this.math._spotPrice(poolPairData).toNumber();
  }

  _tokenInForExactSpotPriceAfterSwap({
    spotPrice,
    poolPairData,
    inGuess,
    spotPricePrecision = bnum(0.0000001),
    iteration_number = 0,
  }: {
    spotPrice: OldBigNumber;
    poolPairData: TPoolPairData;
    inGuess?: OldBigNumber;
    spotPricePrecision?: OldBigNumber;
    iteration_number?: number;
  }): OldBigNumber {
    // Calculate the amount of tokenIn needed to reach the desired spotPrice
    // The Newton-Raphson method is used to find the SpotPrice of the function
    // Results could be inaccurate for very small amounts of tokenIn
    const inGuessValue = inGuess
      ? inGuess
      : this.math._firstGuessOfTokenInForExactSpotPriceAfterSwap(poolPairData);
    const guessedSpotPrice =
      this.math._spotPriceAfterSwapExactTokenInForTokenOut(
        poolPairData,
        inGuessValue,
      );
    const diffFromSpotPrice = spotPrice.minus(guessedSpotPrice);
    if (diffFromSpotPrice.abs().lte(spotPricePrecision)) {
      return inGuessValue;
    }

    iteration_number += 1;
    if (iteration_number > 255) {
      throw new Error("Max iterations reached");
    }
    const spotPriceDerivative =
      this.math._derivativeSpotPriceAfterSwapExactTokenInForTokenOut(
        poolPairData,
        inGuessValue,
      );
    const newInGuess = diffFromSpotPrice
      .div(spotPriceDerivative)
      .plus(inGuessValue);
    return this._tokenInForExactSpotPriceAfterSwap({
      spotPrice,
      poolPairData,
      inGuess: newInGuess,
      spotPricePrecision,
      iteration_number,
    });
  }

  tokenInForExactSpotPriceAfterSwap(
    spotPriceAfterSwap: number,
    tokenIn: string,
    tokenOut: string,
  ): number {
    const poolPairData = this.math.parsePoolPairData(tokenIn, tokenOut);
    return this._tokenInForExactSpotPriceAfterSwap({
      spotPrice: bnum(spotPriceAfterSwap),
      poolPairData,
    }).toNumber();
  }

  tokenOutForExactSpotPriceAfterSwap(
    spotPriceAfterSwap: number,
    tokenIn: string,
    tokenOut: string,
  ): number {
    const poolPairData = this.math.parsePoolPairData(tokenIn, tokenOut);
    const amountTokenIn = this._tokenInForExactSpotPriceAfterSwap({
      spotPrice: bnum(spotPriceAfterSwap),
      poolPairData,
    });
    return this.math
      ._exactTokenInForTokenOut(poolPairData, amountTokenIn)
      .toNumber();
  }

  effectivePriceForExactTokenInSwap(
    amountIn: number,
    tokenIn: string,
    tokenOut: string,
  ): number {
    const amountInBn = bnum(amountIn);
    const poolPairData = this.math.parsePoolPairData(tokenIn, tokenOut);
    const amountOut = this.math._exactTokenInForTokenOut(
      poolPairData,
      amountInBn,
    );
    return amountInBn.div(amountOut).toNumber();
  }

  effectivePriceForExactTokenOutSwap(
    amountOut: number,
    tokenIn: string,
    tokenOut: string,
  ): number {
    const amountOutBn = bnum(amountOut);

    const poolPairData = this.math.parsePoolPairData(tokenIn, tokenOut);
    const amountIn = this.math._tokenInForExactTokenOut(
      poolPairData,
      amountOutBn,
    );
    return amountIn.div(amountOutBn).toNumber();
  }

  priceImpactForExactTokenInSwap(
    amountIn: number,
    tokenIn: string,
    tokenOut: string,
  ): number {
    const amountInBn = bnum(amountIn);
    const poolPairData = this.math.parsePoolPairData(tokenIn, tokenOut);
    const amountOut = this.math._exactTokenInForTokenOut(
      poolPairData,
      amountInBn,
    );
    const effectivePrice = amountInBn.div(amountOut);
    const spotPrice = this.math._spotPrice(poolPairData);
    return bnum(1).minus(spotPrice.div(effectivePrice)).toNumber();
  }

  priceImpactForExactTokenInReversedSwap(
    amountIn: number,
    tokenIn: string,
    tokenOut: string,
  ): number {
    const amountInBn = bnum(amountIn);
    const poolPairData = this.math.parsePoolPairData(tokenIn, tokenOut);
    const amountOut = this.math._exactTokenInForTokenOut(
      poolPairData,
      amountInBn,
    );
    const effectivePrice = amountInBn.div(amountOut);
    const spotPrice = this.math._spotPrice(poolPairData);
    return bnum(1).minus(effectivePrice.div(spotPrice)).toNumber();
  }

  priceImpactForExactTokenOutSwap(
    amountOut: number,
    tokenIn: string,
    tokenOut: string,
  ): number {
    const amountOutBn = bnum(amountOut);
    const poolPairData = this.math.parsePoolPairData(tokenIn, tokenOut);
    const amountIn = this.math._tokenInForExactTokenOut(
      poolPairData,
      amountOutBn,
    );
    const effectivePrice = amountIn.div(amountOutBn);
    const spotPrice = this.math._spotPrice(poolPairData);
    return bnum(1).minus(spotPrice.div(effectivePrice)).toNumber();
  }

  priceImpactForExactTokenOutReversedSwap(
    amountOut: number,
    tokenIn: string,
    tokenOut: string,
  ): number {
    const amountOutBn = bnum(amountOut);
    const poolPairData = this.math.parsePoolPairData(tokenIn, tokenOut);
    const amountIn = this.math._tokenInForExactTokenOut(
      poolPairData,
      amountOutBn,
    );
    const effectivePrice = amountIn.div(amountOutBn);
    const spotPrice = this.math._spotPrice(poolPairData);
    return bnum(1).minus(effectivePrice.div(spotPrice)).toNumber();
  }
}
