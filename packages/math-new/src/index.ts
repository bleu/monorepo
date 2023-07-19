import { bnum, OldBigNumber } from "@balancer-labs/sor";
import { parseFixed } from "@ethersproject/bignumber";

import {
  ExtendedMetaStableMath,
  IMetaStableMath,
  MetaStablePoolPairData,
} from "./metastable";
import {
  ExtendedMetaStableMath_2,
  IMetaStableMath_2,
  MockMetaStablePoolPairData,
} from "./metastable_2";

export function numberToBigNumber({
  number,
  decimals = 18,
}: {
  number: number;
  decimals?: number;
}) {
  const numberAsString = number.toString();
  if (numberAsString.includes(".")) {
    const [integerAsString, floatAsString] = numberAsString.split(".");
    const floatAsStringTrimmed = floatAsString.slice(0, decimals);
    const numberStringTrimmed = `${integerAsString}.${floatAsStringTrimmed}`;
    return parseFixed(numberStringTrimmed, decimals);
  }
  return parseFixed(numberAsString, decimals);
}
export interface IAMM {
  poolType: "MetaStable" | "MetaStable_2";
  poolParams: IMetaStableMath | IMetaStableMath_2;
}

type PoolPairData = MetaStablePoolPairData | MockMetaStablePoolPairData;
export class AMM {
  math!: ExtendedMetaStableMath | ExtendedMetaStableMath_2;

  constructor(amm: IAMM) {
    switch (amm.poolType) {
      case "MetaStable":
        this.math = new ExtendedMetaStableMath(
          amm.poolParams as IMetaStableMath
        );
      case "MetaStable_2":
        this.math = new ExtendedMetaStableMath_2(
          amm.poolParams as IMetaStableMath_2
        );
    }
  }

  exactTokenInForTokenOut(
    amountIn: number,
    tokenIn: string,
    tokenOut: string
  ): number {
    const poolPairData = this.math.parsePoolPairData(tokenIn, tokenOut);
    return this.math
      ._exactTokenInForTokenOut(poolPairData, bnum(amountIn))
      .toNumber();
  }

  tokenInForExactTokenOut(
    amountOut: number,
    tokenIn: string,
    tokenOut: string
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
    inGuess = poolPairData.allBalances[poolPairData.tokenIndexIn].times(
      bnum(0.01)
    ),
    spotPricePrecision = bnum(0.0000001),
    iteration_number = 0,
  }: {
    spotPrice: OldBigNumber;
    poolPairData: PoolPairData;
    inGuess?: OldBigNumber;
    spotPricePrecision?: OldBigNumber;
    iteration_number?: number;
  }): OldBigNumber {
    // Calculate the amount of tokenIn needed to reach the desired spotPrice
    // The Newton-Raphson method is used to find the SpotPrice of the function
    // Results could be inaccurate for very small amounts of tokenIn
    const guessedSpotPrice =
      this.math._spotPriceAfterSwapExactTokenInForTokenOut(
        poolPairData,
        inGuess
      );
    const diffFromSpotPrice = spotPrice.minus(guessedSpotPrice);
    if (diffFromSpotPrice.abs().lte(spotPricePrecision)) {
      return inGuess;
    }

    iteration_number += 1;
    if (iteration_number > 255) {
      throw new Error("Max iterations reached");
    }
    const spotPriceDerivative =
      this.math._derivativeSpotPriceAfterSwapExactTokenInForTokenOut(
        poolPairData,
        inGuess
      );
    const newInGuess = diffFromSpotPrice.div(spotPriceDerivative).plus(inGuess);
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
    tokenOut: string
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
    tokenOut: string
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
    tokenOut: string
  ): number {
    const poolPairData = this.math.parsePoolPairData(tokenIn, tokenOut);
    const amountInBn = bnum(amountIn);
    const amountOut = this.math._exactTokenInForTokenOut(
      poolPairData,
      amountInBn
    );
    return amountInBn.div(amountOut).toNumber();
  }

  effectivePriceForExactTokenOutSwap(
    amountOut: number,
    tokenIn: string,
    tokenOut: string
  ): number {
    const poolPairData = this.math.parsePoolPairData(tokenIn, tokenOut);
    const amountOutBn = bnum(amountOut);
    const amountIn = this.math._tokenInForExactTokenOut(
      poolPairData,
      amountOutBn
    );
    return amountIn.div(amountOutBn).toNumber();
  }

  priceImpactForExactTokenInSwap(
    amountIn: number,
    tokenIn: string,
    tokenOut: string
  ): number {
    const poolPairData = this.math.parsePoolPairData(tokenIn, tokenOut);
    const amountInBn = bnum(amountIn);
    const amountOut = this.math._exactTokenInForTokenOut(
      poolPairData,
      amountInBn
    );
    const effectivePrice = amountInBn.div(amountOut);
    const spotPrice = this.math._spotPrice(poolPairData);
    return bnum(1).minus(spotPrice.div(effectivePrice)).toNumber();
  }

  priceImpactForExactTokenInReversedSwap(
    amountIn: number,
    tokenIn: string,
    tokenOut: string
  ): number {
    const poolPairData = this.math.parsePoolPairData(tokenIn, tokenOut);
    const amountInBn = bnum(amountIn);
    const amountOut = this.math._exactTokenInForTokenOut(
      poolPairData,
      amountInBn
    );
    const effectivePrice = amountInBn.div(amountOut);
    const spotPrice = this.math._spotPrice(poolPairData);
    return bnum(1).minus(effectivePrice.div(spotPrice)).toNumber();
  }

  priceImpactForExactTokenOutSwap(
    amountOut: number,
    tokenIn: string,
    tokenOut: string
  ): number {
    const poolPairData = this.math.parsePoolPairData(tokenIn, tokenOut);
    const amountOutBn = bnum(amountOut);
    const amountIn = this.math._tokenInForExactTokenOut(
      poolPairData,
      amountOutBn
    );
    const effectivePrice = amountIn.div(amountOutBn);
    const spotPrice = this.math._spotPrice(poolPairData);
    return bnum(1).minus(spotPrice.div(effectivePrice)).toNumber();
  }

  priceImpactForExactTokenOutReversedSwap(
    amountOut: number,
    tokenIn: string,
    tokenOut: string
  ): number {
    const poolPairData = this.math.parsePoolPairData(tokenIn, tokenOut);
    const amountOutBn = bnum(amountOut);
    const amountIn = this.math._tokenInForExactTokenOut(
      poolPairData,
      amountOutBn
    );
    const effectivePrice = amountIn.div(amountOutBn);
    const spotPrice = this.math._spotPrice(poolPairData);
    return bnum(1).minus(effectivePrice.div(spotPrice)).toNumber();
  }
}
