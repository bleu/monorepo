import { bnum, OldBigNumber, StablePool } from "@balancer-labs/sor";
import { parseFixed } from "@ethersproject/bignumber";
import { WeiPerEther as ONE } from "@ethersproject/constants";

import * as MetaStableConversions from "./metastable";
import { ExtendedStableMath } from "./stable";

type StablePoolPairData = ReturnType<
  typeof StablePool.prototype.parsePoolPairData
>;

interface MetaStablePoolPairData extends StablePoolPairData {
  rateIn: OldBigNumber;
  rateOut: OldBigNumber;
}

function numberToBigNumber({
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

function numberToOldBigNumber({
  number,
  decimals = 18,
}: {
  number: number;
  decimals?: number;
}) {
  return bnum(number.toFixed(decimals));
}

function preparePoolPairData({
  indexIn,
  indexOut,
  swapFee,
  balances,
  rates,
  amp,
  decimals,
}: {
  indexIn: number;
  indexOut: number;
  swapFee: number;
  balances: number[];
  rates: number[];
  amp: number;
  decimals: number[];
}) {
  const allBalancesOldBn = balances.map((balance, i) =>
    numberToOldBigNumber({ number: balance, decimals: decimals[i] })
  );
  const allBalancesBn = balances.map((balance, i) =>
    numberToBigNumber({ number: balance, decimals: decimals[i] })
  );

  return {
    id: "0x",
    address: "0x",
    poolType: 1,
    tokenIn: "0x",
    tokenOut: "0x",
    balanceIn: numberToBigNumber({
      number: balances[indexIn],
      decimals: decimals[indexIn],
    })
      .mul(numberToBigNumber({ number: rates[indexIn] }))
      .div(ONE),
    balanceOut: numberToBigNumber({
      number: balances[indexOut],
      decimals: decimals[indexOut],
    })
      .mul(numberToBigNumber({ number: rates[indexOut] }))
      .div(ONE),
    swapFee: numberToBigNumber({ number: swapFee, decimals: 18 }),
    rateIn: numberToOldBigNumber({ number: rates[indexIn] }),
    rateOut: numberToOldBigNumber({ number: rates[indexOut] }),
    allBalances: allBalancesOldBn,
    allBalancesScaled: allBalancesBn,
    amp: numberToBigNumber({ number: amp, decimals: 3 }),
    tokenIndexIn: indexIn,
    tokenIndexOut: indexOut,
    decimalsIn: decimals[indexIn],
    decimalsOut: decimals[indexOut],
  } as MetaStablePoolPairData;
}

function exactTokenInForTokenOut(
  amountIn: OldBigNumber,
  poolPairData: MetaStablePoolPairData
) {
  const amountInToStableMath = MetaStableConversions.amountToStableMath(
    amountIn,
    poolPairData.rateIn
  );
  const amountOutToStableMath = ExtendedStableMath._exactTokenInForTokenOut(
    amountInToStableMath,
    poolPairData
  );
  return MetaStableConversions.amountFromStableMath(
    amountOutToStableMath,
    poolPairData.rateOut
  );
}

function tokenInForExactTokenOut(
  amountOut: OldBigNumber,
  poolPairData: MetaStablePoolPairData
) {
  const amountOutToStableMath = MetaStableConversions.amountToStableMath(
    amountOut,
    poolPairData.rateOut
  );
  const amountInToStableMath = ExtendedStableMath._tokenInForExactTokenOut(
    amountOutToStableMath,
    poolPairData
  );
  return MetaStableConversions.amountFromStableMath(
    amountInToStableMath,
    poolPairData.rateIn
  );
}

function spotPrice(poolPairData: MetaStablePoolPairData) {
  const spotPriceToStableMath = ExtendedStableMath._spotPrice(poolPairData);
  return MetaStableConversions.priceFromStableMath(
    spotPriceToStableMath,
    poolPairData.rateIn,
    poolPairData.rateOut
  );
}

function tokenInForExactSpotPriceAfterSwap(
  spotPriceAfterSwap: OldBigNumber,
  poolPairData: MetaStablePoolPairData
) {
  const spotPriceAfterSwapToStableMath =
    MetaStableConversions.priceToStableMath(
      spotPriceAfterSwap,
      poolPairData.rateIn,
      poolPairData.rateOut
    );
  const amountInToStableMath =
    ExtendedStableMath._tokenInForExactSpotPriceAfterSwap(
      spotPriceAfterSwapToStableMath,
      poolPairData
    );
  return MetaStableConversions.amountFromStableMath(
    amountInToStableMath,
    poolPairData.rateIn
  );
}

function tokenOutForExactSpotPriceAfterSwap(
  spotPriceAfterSwap: OldBigNumber,
  poolPairData: MetaStablePoolPairData
) {
  const spotPriceAfterSwapToStableMath =
    MetaStableConversions.priceToStableMath(
      spotPriceAfterSwap,
      poolPairData.rateIn,
      poolPairData.rateOut
    );
  const amountOutToStableMath =
    ExtendedStableMath._tokenOutForExactSpotPriceAfterSwap(
      spotPriceAfterSwapToStableMath,
      poolPairData
    );
  return MetaStableConversions.amountFromStableMath(
    amountOutToStableMath,
    poolPairData.rateOut
  );
}

function effectivePriceForExactTokenInSwap(
  amountIn: OldBigNumber,
  poolPairData: MetaStablePoolPairData
): OldBigNumber {
  const amountInToStableMath = MetaStableConversions.amountToStableMath(
    amountIn,
    poolPairData.rateIn
  );
  const effectivePriceToStableMath =
    ExtendedStableMath._effectivePriceForExactTokenInSwap(
      amountInToStableMath,
      poolPairData
    );
  return MetaStableConversions.priceFromStableMath(
    effectivePriceToStableMath,
    poolPairData.rateIn,
    poolPairData.rateOut
  );
}

function effectivePriceForExactTokenOutSwap(
  amountOut: OldBigNumber,
  poolPairData: MetaStablePoolPairData
): OldBigNumber {
  const amountOutToStableMath = MetaStableConversions.amountToStableMath(
    amountOut,
    poolPairData.rateOut
  );
  const effectivePriceToStableMath =
    ExtendedStableMath._effectivePriceForExactTokenOutSwap(
      amountOutToStableMath,
      poolPairData
    );
  return MetaStableConversions.priceFromStableMath(
    effectivePriceToStableMath,
    poolPairData.rateIn,
    poolPairData.rateOut
  );
}

function priceImpactForExactTokenInSwap(
  amountIn: OldBigNumber,
  poolPairData: MetaStablePoolPairData
): OldBigNumber {
  const effectivePriceMetastable = effectivePriceForExactTokenInSwap(
    amountIn,
    poolPairData
  );
  const spotPriceMetastable = spotPrice(poolPairData);
  return bnum(1).minus(effectivePriceMetastable.div(spotPriceMetastable));
}

function priceImpactForExactTokenOutReversedSwap(
  amountOut: OldBigNumber,
  poolPairData: MetaStablePoolPairData
): OldBigNumber {
  const effectivePriceMetastable = effectivePriceForExactTokenOutSwap(
    amountOut,
    poolPairData
  );
  const spotPriceMetastable = spotPrice(poolPairData);
  return bnum(1).minus(spotPriceMetastable.div(effectivePriceMetastable));
}

export const MetaStableMath = {
  numberToBigNumber,
  numberToOldBigNumber,
  preparePoolPairData,
  exactTokenInForTokenOut,
  tokenInForExactTokenOut,
  spotPrice,
  tokenInForExactSpotPriceAfterSwap,
  tokenOutForExactSpotPriceAfterSwap,
  priceImpactForExactTokenInSwap,
  priceImpactForExactTokenOutReversedSwap,
} as const;
