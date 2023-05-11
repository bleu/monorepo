import { describe, expect, test } from "@jest/globals";

import { MathSol } from "./basicOperations";
import * as stableMath from "./stableMathBigInt";

const amplificationParameter = BigInt(1e3);
const tokenBalances = [BigInt(2000000e18), BigInt(1401869.15e18)];
const rates = [BigInt(1e18), BigInt(1.07e18)];
const tokenIndexIn = 0;
const tokenIndexOut = 1;
const amountIn = BigInt(50000e18);
const fee = BigInt(0);
const tokenBalancesScaled = tokenBalances.map((e, i) =>
  MathSol.mulUpFixed(e, rates[i])
);

const spotPriceResult = BigInt(0.808473e18);
const reversedSpotPriceResult = BigInt(1.2369e18);
const amountOutResult = BigInt(39872.5037e18);
const effectivePriceResult = BigInt(0.7975e18);
const priceImpactResult = BigInt(0.01363e18);

function compareBigInt(a: bigint, b: bigint) {
  return Number(a) / 1e18 / (Number(b) / 1e18);
}

describe("ZD sheets tests", () => {
  const precision = 3;
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

  test("Spot Price", () => {
    expect(compareBigInt(spotPriceCalculated, spotPriceResult)).toBeCloseTo(
      1,
      precision
    );
  });

  const reversedSpotPriceCalculated = MathSol.divDownFixed(
    MathSol.ONE,
    spotPriceCalculated
  );

  test("Reverse spot Price", () => {
    expect(
      compareBigInt(reversedSpotPriceCalculated, reversedSpotPriceResult)
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
    MathSol.divDownFixed(effectivePriceCalculated, spotPriceCalculated)
  );
  test("Price Impact", () => {
    expect(compareBigInt(priceImpactCalculated, priceImpactResult)).toBeCloseTo(
      1,
      precision
    );
  });
});
