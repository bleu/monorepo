import {
  bnum,
  OldBigNumber,
  StableMaths,
  StablePool,
  ZERO,
} from "@balancer-labs/sor";
import { BigNumber, formatFixed } from "@ethersproject/bignumber";
import { WeiPerEther as EONE } from "@ethersproject/constants";

type StablePoolPairData = ReturnType<
  typeof StablePool.prototype.parsePoolPairData
>;
const ONE = bnum(1);

function _poolDerivatives(
  A: BigNumber,
  balances: OldBigNumber[],
  tokenIndexIn: number,
  tokenIndexOut: number,
  is_first_derivative: boolean,
  wrt_out: boolean
): OldBigNumber {
  // This function was copied from @balancer/sor package, since was not exported
  const totalCoins = balances.length;
  const D = StableMaths._invariant(A, balances);
  let S = ZERO;
  for (let i = 0; i < totalCoins; i++) {
    if (i != tokenIndexIn && i != tokenIndexOut) {
      S = S.plus(balances[i]);
    }
  }
  const x = balances[tokenIndexIn];
  const y = balances[tokenIndexOut];
  // A is passed as an ethers bignumber while maths uses bignumber.js
  const AAdjusted = bnum(formatFixed(A, 3));
  const a = AAdjusted.times(totalCoins ** totalCoins); // = ATimesNpowN
  const b = S.minus(D).times(a).plus(D);
  const twoaxy = bnum(2).times(a).times(x).times(y);
  const partial_x = twoaxy.plus(a.times(y).times(y)).plus(b.times(y));
  const partial_y = twoaxy.plus(a.times(x).times(x)).plus(b.times(x));
  let ans;
  if (is_first_derivative) {
    ans = partial_x.div(partial_y);
  } else {
    const partial_xx = bnum(2).times(a).times(y);
    const partial_yy = bnum(2).times(a).times(x);
    const partial_xy = partial_xx.plus(partial_yy).plus(b);
    const numerator = bnum(2)
      .times(partial_x)
      .times(partial_y)
      .times(partial_xy)
      .minus(partial_xx.times(partial_y.pow(2)))
      .minus(partial_yy.times(partial_x.pow(2)));
    const denominator = partial_x.pow(2).times(partial_y);
    ans = numerator.div(denominator);
    if (wrt_out) {
      ans = ans.times(partial_y).div(partial_x);
    }
  }
  return ans;
}

function _effectivePriceForExactTokenInSwap(
  amountIn: OldBigNumber,
  poolPairData: StablePoolPairData
): OldBigNumber {
  const amountOut = StableMaths._exactTokenInForTokenOut(
    amountIn,
    poolPairData
  );
  return amountOut.div(amountIn);
}

function _effectivePriceForExactTokenOutSwap(
  amountOut: OldBigNumber,
  poolPairData: StablePoolPairData
): OldBigNumber {
  const amountIn = StableMaths._tokenInForExactTokenOut(
    amountOut,
    poolPairData
  );
  return amountOut.div(amountIn);
}

function _spotPrice(poolPairData: StablePoolPairData): OldBigNumber {
  const { amp, allBalances, tokenIndexIn, tokenIndexOut, swapFee } =
    poolPairData;
  const n = allBalances.length;
  const A = amp.div(n ** (n - 1));
  const ans = _poolDerivatives(
    A,
    allBalances,
    tokenIndexIn,
    tokenIndexOut,
    true,
    false
  );
  return ONE.div(ans.times(EONE.sub(swapFee).toString()).div(EONE.toString()));
}

function _priceImpactForExactTokenInSwap(
  amountIn: OldBigNumber,
  poolPairData: StablePoolPairData
): OldBigNumber {
  const effectivePrice = _effectivePriceForExactTokenInSwap(
    amountIn,
    poolPairData
  );
  const spotPrice = _spotPrice(poolPairData);
  return ONE.minus(effectivePrice.div(spotPrice));
}

function _priceImpactForExactTokenOutReversedSwap(
  amountOut: OldBigNumber,
  poolPairData: StablePoolPairData
) {
  const effectivePrice = _effectivePriceForExactTokenOutSwap(
    amountOut,
    poolPairData
  );
  const spotPrice = _spotPrice(poolPairData);
  return ONE.minus(spotPrice.div(effectivePrice));
}

function _priceImpactForExactTokenOutSwap(
  amountOut: OldBigNumber,
  poolPairData: StablePoolPairData
): OldBigNumber {
  const effectivePrice = _effectivePriceForExactTokenOutSwap(
    amountOut,
    poolPairData
  );
  const spotPrice = _spotPrice(poolPairData);
  return ONE.minus(effectivePrice.div(spotPrice));
}

function _tokenInForExactSpotPriceAfterSwap(
  spotPrice: OldBigNumber,
  poolPairData: StablePoolPairData,
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
    StableMaths._spotPriceAfterSwapExactTokenInForTokenOut(inGuess, {
      ...poolPairData,
    });
  const diffFromSpotPrice = spotPrice.minus(guessedSpotPrice);
  if (diffFromSpotPrice.abs().lte(spotPricePrecision)) {
    return inGuess;
  }

  iteration_number += 1;
  if (iteration_number > 255) {
    throw new Error("Max iterations reached");
  }
  const spotPriceDerivative =
    StableMaths._derivativeSpotPriceAfterSwapExactTokenInForTokenOut(inGuess, {
      ...poolPairData,
    });
  const newInGuess = diffFromSpotPrice.div(spotPriceDerivative).plus(inGuess);
  return _tokenInForExactSpotPriceAfterSwap(
    spotPrice,
    poolPairData,
    newInGuess,
    spotPricePrecision,
    iteration_number
  );
}

export const ExtendedStableMath = {
  ...StableMaths,
  _poolDerivatives,
  _effectivePriceForExactTokenInSwap,
  _effectivePriceForExactTokenOutSwap,
  _spotPrice,
  _priceImpactForExactTokenInSwap,
  _priceImpactForExactTokenOutSwap,
  _tokenInForExactSpotPriceAfterSwap,
  _priceImpactForExactTokenOutReversedSwap,
} as const;
