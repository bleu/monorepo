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

function numberToBigNumber(number: number, decimals = 18) {
  return parseFixed(number.toString(), decimals);
}

function numberToOldBigNumber(number: number, decimals = 18) {
  return bnum(number.toFixed(decimals));
}

function preparePoolPairData({
  indexIn,
  indexOut,
  swapFee,
  balances,
  rates,
  amp,
}: {
  indexIn: number;
  indexOut: number;
  swapFee: number;
  balances: number[];
  rates: number[];
  amp: number;
}) {
  const allBalancesOldBn = balances.map((balance, i) =>
    numberToOldBigNumber(balance).times(numberToOldBigNumber(rates[i]))
  );
  const allBalancesBn = balances.map((balance, i) =>
    numberToBigNumber(balance).mul(numberToBigNumber(rates[i])).div(ONE)
  );

  return {
    id: "0x",
    address: "0x",
    poolType: 1,
    tokenIn: "0x",
    tokenOut: "0x",
    balanceIn: numberToBigNumber(balances[indexIn])
      .mul(numberToBigNumber(rates[indexIn]))
      .div(ONE),
    balanceOut: numberToBigNumber(balances[indexOut])
      .mul(numberToBigNumber(rates[indexOut]))
      .div(ONE),
    swapFee: numberToBigNumber(swapFee, 18),
    rateIn: numberToOldBigNumber(rates[indexIn]),
    rateOut: numberToOldBigNumber(rates[indexOut]),
    allBalances: allBalancesOldBn,
    allBalancesScaled: allBalancesBn,
    amp: numberToBigNumber(amp, 3),
    tokenIndexIn: indexIn,
    tokenIndexOut: indexOut,
    decimalsIn: 6,
    decimalsOut: 18,
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

export const MetaStableMath = {
  numberToBigNumber,
  numberToOldBigNumber,
  preparePoolPairData,
  exactTokenInForTokenOut,
  tokenInForExactTokenOut,
  spotPrice,
  tokenInForExactSpotPriceAfterSwap,
  tokenOutForExactSpotPriceAfterSwap,
} as const;
