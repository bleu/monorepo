import { bnum, OldBigNumber } from "@balancer-labs/sor";
import { parseFixed } from "@ethersproject/bignumber";

import { ExtendedGyroEV2, GyroEPoolPairData, IGyroEMaths } from "./gyroE";
import {
  ExtendedMetaStableMath,
  IMetaStableMath,
  MetaStablePoolPairData,
} from "./metastable";

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

type PoolPairData = MetaStablePoolPairData | GyroEPoolPairData;
export interface IAMM {
  poolType: "MetaStable" | "GyroE";
  poolParams: IMetaStableMath | IGyroEMaths;
}

export class AMM {
  math!: ExtendedMetaStableMath | ExtendedGyroEV2;

  constructor(amm: IAMM) {
    switch (amm.poolType) {
      case "MetaStable":
        this.math = new ExtendedMetaStableMath(
          amm.poolParams as IMetaStableMath
        );

        break;
      case "GyroE":
        this.math = new ExtendedGyroEV2(amm.poolParams as IGyroEMaths);
        break;
    }
  }

  exactTokenInForTokenOut(
    amountIn: number,
    tokenIn: string,
    tokenOut: string
  ): number {
    if (this.math instanceof ExtendedMetaStableMath) {
      const poolPairData = this.math.parsePoolPairData(
        tokenIn,
        tokenOut
      ) as MetaStablePoolPairData;
      return this.math
        ._exactTokenInForTokenOut(poolPairData, bnum(amountIn))
        .toNumber();
    } else if (this.math instanceof ExtendedGyroEV2) {
      const poolPairData = this.math.parsePoolPairData(
        tokenIn,
        tokenOut
      ) as GyroEPoolPairData;
      return this.math
        ._exactTokenInForTokenOut(poolPairData, bnum(amountIn))
        .toNumber();
    } else throw new Error("Invalid math instance");
  }

  tokenInForExactTokenOut(
    amountOut: number,
    tokenIn: string,
    tokenOut: string
  ): number {
    if (this.math instanceof ExtendedMetaStableMath) {
      const poolPairData = this.math.parsePoolPairData(
        tokenIn,
        tokenOut
      ) as MetaStablePoolPairData;

      return this.math
        ._tokenInForExactTokenOut(poolPairData, bnum(amountOut))
        .toNumber();
    } else if (this.math instanceof ExtendedGyroEV2) {
      const poolPairData = this.math.parsePoolPairData(
        tokenIn,
        tokenOut
      ) as GyroEPoolPairData;

      return this.math
        ._tokenInForExactTokenOut(poolPairData, bnum(amountOut))
        .toNumber();
    } else throw new Error("Invalid math instance");
  }

  spotPrice(tokenIn: string, tokenOut: string): number {
    if (this.math instanceof ExtendedMetaStableMath) {
      const poolPairData = this.math.parsePoolPairData(
        tokenIn,
        tokenOut
      ) as MetaStablePoolPairData;
      return this.math._spotPrice(poolPairData).toNumber();
    } else if (this.math instanceof ExtendedGyroEV2) {
      const poolPairData = this.math.parsePoolPairData(
        tokenIn,
        tokenOut
      ) as GyroEPoolPairData;
      return this.math._spotPrice(poolPairData).toNumber();
    } else throw new Error("Invalid math instance");
  }

  _tokenInForExactSpotPriceAfterSwap({
    spotPrice,
    poolPairData,
    inGuess,
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
    if (this.math instanceof ExtendedMetaStableMath) {
      const poolPairDataExtended = poolPairData as MetaStablePoolPairData;
      const inGuessValue = inGuess
        ? inGuess
        : poolPairDataExtended.allBalances[
            poolPairDataExtended.tokenIndexIn
          ].times(bnum(0.01));
      const guessedSpotPrice =
        this.math._spotPriceAfterSwapExactTokenInForTokenOut(
          poolPairDataExtended,
          inGuessValue
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
          poolPairDataExtended,
          inGuessValue
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
    if (this.math instanceof ExtendedGyroEV2) {
      const poolPairDataExtended = poolPairData as GyroEPoolPairData;
      const inGuessValue = bnum(
        poolPairDataExtended.balanceIn.toString()
      ).times(bnum(0.01));
      const guessedSpotPrice =
        this.math._spotPriceAfterSwapExactTokenInForTokenOut(
          poolPairDataExtended,
          inGuessValue
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
          poolPairDataExtended,
          inGuessValue
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
    } else throw new Error("Invalid math instance");
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
    if (this.math instanceof ExtendedMetaStableMath) {
      const poolPairData = this.math.parsePoolPairData(
        tokenIn,
        tokenOut
      ) as MetaStablePoolPairData;
      const amountTokenIn = this._tokenInForExactSpotPriceAfterSwap({
        spotPrice: bnum(spotPriceAfterSwap),
        poolPairData,
      });
      return this.math
        ._exactTokenInForTokenOut(poolPairData, amountTokenIn)
        .toNumber();
    } else if (this.math instanceof ExtendedGyroEV2) {
      const poolPairData = this.math.parsePoolPairData(
        tokenIn,
        tokenOut
      ) as GyroEPoolPairData;
      const amountTokenIn = this._tokenInForExactSpotPriceAfterSwap({
        spotPrice: bnum(spotPriceAfterSwap),
        poolPairData,
      });
      return this.math
        ._exactTokenInForTokenOut(poolPairData, amountTokenIn)
        .toNumber();
    } else throw new Error("Invalid math instance");
  }

  effectivePriceForExactTokenInSwap(
    amountIn: number,
    tokenIn: string,
    tokenOut: string
  ): number {
    const amountInBn = bnum(amountIn);
    if (this.math instanceof ExtendedMetaStableMath) {
      const poolPairData = this.math.parsePoolPairData(
        tokenIn,
        tokenOut
      ) as MetaStablePoolPairData;
      const amountOut = this.math._exactTokenInForTokenOut(
        poolPairData,
        amountInBn
      );
      return amountInBn.div(amountOut).toNumber();
    }
    if (this.math instanceof ExtendedGyroEV2) {
      const poolPairData = this.math.parsePoolPairData(
        tokenIn,
        tokenOut
      ) as GyroEPoolPairData;
      const amountOut = this.math._exactTokenInForTokenOut(
        poolPairData,
        amountInBn
      );
      return amountInBn.div(amountOut).toNumber();
    } else throw new Error("Invalid math instance");
  }

  effectivePriceForExactTokenOutSwap(
    amountOut: number,
    tokenIn: string,
    tokenOut: string
  ): number {
    const amountOutBn = bnum(amountOut);
    if (this.math instanceof ExtendedMetaStableMath) {
      const poolPairData = this.math.parsePoolPairData(
        tokenIn,
        tokenOut
      ) as MetaStablePoolPairData;
      const amountIn = this.math._tokenInForExactTokenOut(
        poolPairData,
        amountOutBn
      );
      return amountIn.div(amountOutBn).toNumber();
    } else if (this.math instanceof ExtendedGyroEV2) {
      const poolPairData = this.math.parsePoolPairData(
        tokenIn,
        tokenOut
      ) as GyroEPoolPairData;
      const amountIn = this.math._tokenInForExactTokenOut(
        poolPairData,
        amountOutBn
      );
      return amountIn.div(amountOutBn).toNumber();
    } else {
      throw new Error("Invalid math instance");
    }
  }

  priceImpactForExactTokenInSwap(
    amountIn: number,
    tokenIn: string,
    tokenOut: string
  ): number {
    const amountInBn = bnum(amountIn);
    if (this.math instanceof ExtendedMetaStableMath) {
      const poolPairData = this.math.parsePoolPairData(
        tokenIn,
        tokenOut
      ) as MetaStablePoolPairData;
      const amountOut = this.math._exactTokenInForTokenOut(
        poolPairData,
        amountInBn
      );
      const effectivePrice = amountInBn.div(amountOut);
      const spotPrice = this.math._spotPrice(poolPairData);
      return bnum(1).minus(spotPrice.div(effectivePrice)).toNumber();
    }
    if (this.math instanceof ExtendedGyroEV2) {
      const poolPairData = this.math.parsePoolPairData(
        tokenIn,
        tokenOut
      ) as GyroEPoolPairData;
      const amountOut = this.math._exactTokenInForTokenOut(
        poolPairData,
        amountInBn
      );
      const effectivePrice = amountInBn.div(amountOut);
      const spotPrice = this.math._spotPrice(poolPairData);
      return bnum(1).minus(spotPrice.div(effectivePrice)).toNumber();
    } else {
      throw new Error("Invalid math instance");
    }
  }

  priceImpactForExactTokenInReversedSwap(
    amountIn: number,
    tokenIn: string,
    tokenOut: string
  ): number {
    const amountInBn = bnum(amountIn);
    if (this.math instanceof ExtendedMetaStableMath) {
      const poolPairData = this.math.parsePoolPairData(
        tokenIn,
        tokenOut
      ) as MetaStablePoolPairData;
      const amountOut = this.math._exactTokenInForTokenOut(
        poolPairData,
        amountInBn
      );
      const effectivePrice = amountInBn.div(amountOut);
      const spotPrice = this.math._spotPrice(poolPairData);
      return bnum(1).minus(effectivePrice.div(spotPrice)).toNumber();
    }
    if (this.math instanceof ExtendedGyroEV2) {
      const poolPairData = this.math.parsePoolPairData(
        tokenIn,
        tokenOut
      ) as GyroEPoolPairData;
      const amountOut = this.math._exactTokenInForTokenOut(
        poolPairData,
        amountInBn
      );
      const effectivePrice = amountInBn.div(amountOut);
      const spotPrice = this.math._spotPrice(poolPairData);
      return bnum(1).minus(effectivePrice.div(spotPrice)).toNumber();
    } else {
      throw new Error("Invalid math instance");
    }
  }

  priceImpactForExactTokenOutSwap(
    amountOut: number,
    tokenIn: string,
    tokenOut: string
  ): number {
    const amountOutBn = bnum(amountOut);
    if (this.math instanceof ExtendedMetaStableMath) {
      const poolPairData = this.math.parsePoolPairData(
        tokenIn,
        tokenOut
      ) as MetaStablePoolPairData;
      const amountIn = this.math._tokenInForExactTokenOut(
        poolPairData,
        amountOutBn
      );
      const effectivePrice = amountIn.div(amountOutBn);
      const spotPrice = this.math._spotPrice(poolPairData);
      return bnum(1).minus(spotPrice.div(effectivePrice)).toNumber();
    }
    if (this.math instanceof ExtendedGyroEV2) {
      const poolPairData = this.math.parsePoolPairData(
        tokenIn,
        tokenOut
      ) as GyroEPoolPairData;
      const amountIn = this.math._tokenInForExactTokenOut(
        poolPairData,
        amountOutBn
      );
      const effectivePrice = amountIn.div(amountOutBn);
      const spotPrice = this.math._spotPrice(poolPairData);
      return bnum(1).minus(spotPrice.div(effectivePrice)).toNumber();
    } else {
      throw new Error("Invalid math instance");
    }
  }

  priceImpactForExactTokenOutReversedSwap(
    amountOut: number,
    tokenIn: string,
    tokenOut: string
  ): number {
    const amountOutBn = bnum(amountOut);
    if (this.math instanceof ExtendedMetaStableMath) {
      const poolPairData = this.math.parsePoolPairData(
        tokenIn,
        tokenOut
      ) as MetaStablePoolPairData;
      const amountIn = this.math._tokenInForExactTokenOut(
        poolPairData,
        amountOutBn
      );
      const effectivePrice = amountIn.div(amountOutBn);
      const spotPrice = this.math._spotPrice(poolPairData);
      return bnum(1).minus(effectivePrice.div(spotPrice)).toNumber();
    }
    if (this.math instanceof ExtendedGyroEV2) {
      const poolPairData = this.math.parsePoolPairData(
        tokenIn,
        tokenOut
      ) as GyroEPoolPairData;
      const amountIn = this.math._tokenInForExactTokenOut(
        poolPairData,
        amountOutBn
      );
      const effectivePrice = amountIn.div(amountOutBn);
      const spotPrice = this.math._spotPrice(poolPairData);
      return bnum(1).minus(effectivePrice.div(spotPrice)).toNumber();
    } else {
      throw new Error("Invalid math instance");
    }
  }
}
