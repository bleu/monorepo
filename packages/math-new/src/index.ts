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
      ._tokenInForExactTokenOut(bnum(amountIn), poolPairData)
      .toNumber();
  }

  tokenInForExactTokenOut(
    amountOut: number,
    tokenIn: string,
    tokenOut: string
  ): number {
    const poolPairData = this.math.parsePoolPairData(tokenIn, tokenOut);
    return this.math
      ._tokenInForExactTokenOut(bnum(amountOut), poolPairData)
      .toNumber();
  }

  spotPrice(tokenIn: string, tokenOut: string): number {
    const poolPairData = this.math.parsePoolPairData(tokenIn, tokenOut);
    return this.math._spotPrice(poolPairData).toNumber();
  }

  _tokenInForExactSpotPriceAfterSwap(
    spotPrice: OldBigNumber,
    poolPairData: PoolPairData,
    inGuess = poolPairData.allBalances[poolPairData.tokenIndexIn].times(
      bnum(0.01)
    ),
    spotPricePrecision = bnum(0.0000001),
    iteration_number = 0
  ): OldBigNumber {
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
    const newInGuess = diffFromSpotPrice
      .div(spotPriceDerivative.times(10))
      .plus(inGuess);
    return this._tokenInForExactSpotPriceAfterSwap(
      spotPrice,
      poolPairData,
      newInGuess,
      spotPricePrecision,
      iteration_number
    );
  }

  tokenInForExactSpotPriceAfterSwap(
    spotPrice: number,
    tokenIn: string,
    tokenOut: string
  ): number {
    const poolPairData = this.math.parsePoolPairData(tokenIn, tokenOut);
    return this._tokenInForExactSpotPriceAfterSwap(
      bnum(spotPrice),
      poolPairData
    ).toNumber();
  }

  tokenOutForExactSpotPriceAfterSwap(
    spotPriceAfterSwap: number,
    tokenIn: string,
    tokenOut: string
  ): number {
    const poolPairData = this.math.parsePoolPairData(tokenIn, tokenOut);
    const amountTokenIn = this._tokenInForExactSpotPriceAfterSwap(
      spotPriceAfterSwap,
      poolPairData
    );

    return this.exactTokenInForTokenOut(amountTokenIn, tokenIn, tokenOut);
  }

  effectivePriceForExactTokenInSwap(
    amountIn: number,
    tokenIn: string,
    tokenOut: string
  ): number {
    const poolPairData = this.math.parsePoolPairData(tokenIn, tokenOut);
    const amountOut = this.math._exactTokenInForTokenOut(
      bnum(amountIn),
      poolPairData
    );
    return amountOut.div(amountIn).toNumber();
  }

  effectivePriceForExactTokenOutSwap(
    amountOut: number,
    tokenIn: string,
    tokenOut: string
  ): number {
    const poolPairData = this.math.parsePoolPairData(tokenIn, tokenOut);
    const amountIn = this.math._tokenInForExactTokenOut(
      bnum(amountOut),
      poolPairData
    );
    return bnum(amountOut).div(amountIn).toNumber();
  }

  priceImpactForExactTokenInSwap(
    amountIn: number,
    tokenIn: string,
    tokenOut: string
  ): number {
    const poolPairData = this.math.parsePoolPairData(tokenIn, tokenOut);
    const amountOut = this.math._exactTokenInForTokenOut(
      bnum(amountIn),
      poolPairData
    );
    const effectivePrice = amountOut.div(amountIn);
    const spotPrice = this.math._spotPrice(poolPairData);
    return bnum(1).minus(effectivePrice.div(spotPrice)).toNumber();
  }

  priceImpactForExactTokenInReversedSwap(
    amountIn: number,
    tokenIn: string,
    tokenOut: string
  ): number {
    const poolPairData = this.math.parsePoolPairData(tokenIn, tokenOut);
    const amountOut = this.math._exactTokenInForTokenOut(
      bnum(amountIn),
      poolPairData
    );
    const effectivePrice = amountOut.div(amountIn);
    const spotPrice = this.math._spotPrice(poolPairData);
    return bnum(1).minus(spotPrice.div(effectivePrice)).toNumber();
  }

  priceImpactForExactTokenOutSwap(
    amountOut: number,
    tokenIn: string,
    tokenOut: string
  ): number {
    const poolPairData = this.math.parsePoolPairData(tokenIn, tokenOut);
    const amountIn = this.math._tokenInForExactTokenOut(
      bnum(amountOut),
      poolPairData
    );
    const effectivePrice = bnum(amountOut).div(amountIn);
    const spotPrice = this.math._spotPrice(poolPairData);
    return bnum(1).minus(effectivePrice.div(spotPrice)).toNumber();
  }

  priceImpactForExactTokenOutReversedSwap(
    amountOut: number,
    tokenIn: string,
    tokenOut: string
  ): number {
    const poolPairData = this.math.parsePoolPairData(tokenIn, tokenOut);
    const amountIn = this.math._tokenInForExactTokenOut(
      bnum(amountOut),
      poolPairData
    );
    const effectivePrice = bnum(amountOut).div(amountIn).toNumber();
    const spotPrice = this.math._spotPrice(poolPairData);
    return bnum(1).minus(spotPrice.div(effectivePrice)).toNumber();
  }
}
