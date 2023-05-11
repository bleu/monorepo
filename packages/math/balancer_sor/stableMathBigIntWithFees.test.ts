import { describe, expect, test } from "@jest/globals";

import { MathSol } from "./basicOperations";
import * as stableMath from "./stableMathBigInt";

const amplificationParameter = BigInt(1e3);
const tokenBalances = [BigInt(2000000e18), BigInt(1401869.15e18)];
const rates = [BigInt(1e18), BigInt(1.07e18)];
const tokenIndexIn = 0;
const tokenIndexOut = 1;
const amountIn = BigInt(50000e18);
const fee = BigInt(0.005e18);
const tokenBalancesScaled = tokenBalances.map((e, i) =>
  MathSol.mulUpFixed(e, rates[i])
);

const amountOutResult = BigInt(39675.8566e18);
const spotPriceResult = BigInt(0.80443e18);
const reversedSpotPriceResult = BigInt(1.2307e18);
const effectivePriceResult = BigInt(0.7935e18);
const priceImpactResult = BigInt(0.0135662077140133e18);

function compareBigInt(a: bigint, b: bigint) {
  return Number(a) / 1e18 / (Number(b) / 1e18);
}

describe("ZD sheets tests", () => {
  const precision = 3;
  const feeComplement = MathSol.complementFixed(fee);
  const amountInScaled = MathSol.mulUpFixed(amountIn, rates[tokenIndexIn]);
  const amountOutCalculatedScaled = stableMath._calcOutGivenIn(
    amplificationParameter,
    [...tokenBalancesScaled],
    tokenIndexIn,
    tokenIndexOut,
    amountInScaled,
    fee
  );
  const amountOutCalculated = MathSol.divUpFixed(
    amountOutCalculatedScaled,
    rates[tokenIndexOut]
  );
  test("Token amount out", () => {
    expect(compareBigInt(amountOutCalculated, amountOutResult)).toBeCloseTo(
      1,
      precision
    );
  });
  const spotPriceCalculatedScaled = stableMath._poolDerivatives(
    amplificationParameter,
    tokenBalancesScaled,
    tokenIndexIn,
    tokenIndexOut,
    true,
    false
  );

  const spotPriceCalculated = MathSol.mulDownFixed(
    MathSol.divDownFixed(rates[tokenIndexIn], rates[tokenIndexOut]),
    spotPriceCalculatedScaled
  );

  const spotPriceCalculatedWithFee = MathSol.mulDownFixed(
    spotPriceCalculated,
    feeComplement
  );

  test("Spot Price", () => {
    expect(
      compareBigInt(spotPriceCalculatedWithFee, spotPriceResult)
    ).toBeCloseTo(1, precision);
  });

  const reversedSpotPriceCalculated = MathSol.divDownFixed(
    MathSol.ONE,
    spotPriceCalculated
  );

  const reversedSpotPriceCalculatedWithFee = MathSol.mulDownFixed(
    reversedSpotPriceCalculated,
    feeComplement
  );

  test("Reverse spot Price", () => {
    expect(
      compareBigInt(reversedSpotPriceCalculatedWithFee, reversedSpotPriceResult)
    ).toBeCloseTo(1, precision);
  });

  const effectivePriceCalculated = MathSol.divDownFixed(
    amountOutCalculated,
    amountIn
  );
  test("Effective Price", () => {
    expect(
      compareBigInt(effectivePriceCalculated, effectivePriceResult)
    ).toBeCloseTo(1, precision);
  });

  const priceImpactCalculated = MathSol.sub(
    MathSol.ONE,
    MathSol.divDownFixed(effectivePriceCalculated, spotPriceCalculatedWithFee)
  );
  test("Price Impact", () => {
    expect(compareBigInt(priceImpactCalculated, priceImpactResult)).toBeCloseTo(
      1,
      precision
    );
  });
});
