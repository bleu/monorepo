import { StableMath } from "@georgeroman/balancer-v2-pools";
import {
  scale,
  scaleAll,
} from "@georgeroman/balancer-v2-pools/dist/src/utils/big-number";
import { describe, expect, test } from "@jest/globals";

import {
  _bigNumberToNumber,
  _calcEffectivePriceGivenIn,
  _calcOutGivenIn,
  adjustAmp,
} from "./stable";

const testParameters = {
  amplificationParameter: adjustAmp("1"),
  tokenBalances: scaleAll(["1500000", "1499999.9905"], 18),
  tokenIndexIn: 0,
  tokenIndexOut: 1,
  tokenAmountIn: scale("50000", 18),
};

describe("Check if invariant changes over 10 connectives trades", () => {
  const firstInvariant = StableMath._calculateInvariant(
    testParameters.amplificationParameter,
    testParameters.tokenBalances,
    true
  );
  const lastTokenBalances = testParameters.tokenBalances;
  for (let i = 0; i < 10; i++) {
    const tokenAmountOut = StableMath._calcOutGivenIn(
      testParameters.amplificationParameter,
      lastTokenBalances,
      testParameters.tokenIndexIn,
      testParameters.tokenIndexOut,
      testParameters.tokenAmountIn
    );
    lastTokenBalances[testParameters.tokenIndexIn] = lastTokenBalances[
      testParameters.tokenIndexIn
    ].plus(testParameters.tokenAmountIn);
    lastTokenBalances[testParameters.tokenIndexOut] =
      lastTokenBalances[testParameters.tokenIndexOut].minus(tokenAmountOut);
    const newInvariant = StableMath._calculateInvariant(
      testParameters.amplificationParameter,
      lastTokenBalances,
      true
    );
    test(`Invariant ${i}`, () => {
      expect(_bigNumberToNumber(newInvariant)).toBeCloseTo(
        _bigNumberToNumber(firstInvariant)
      );
    });
  }
});

describe("Check if two opposite trades cancel each other", () => {
  const precision = Math.round(
    Math.log10(_bigNumberToNumber(testParameters.tokenAmountIn) / 100)
  );
  const tokenAmountOut = StableMath._calcOutGivenIn(
    testParameters.amplificationParameter,
    testParameters.tokenBalances,
    testParameters.tokenIndexIn,
    testParameters.tokenIndexOut,
    testParameters.tokenAmountIn
  );

  testParameters.tokenBalances[testParameters.tokenIndexIn] =
    testParameters.tokenBalances[testParameters.tokenIndexIn].plus(
      testParameters.tokenAmountIn
    );
  testParameters.tokenBalances[testParameters.tokenIndexOut] =
    testParameters.tokenBalances[testParameters.tokenIndexOut].minus(
      tokenAmountOut
    );
  const tokenAmountIn = StableMath._calcOutGivenIn(
    testParameters.amplificationParameter,
    testParameters.tokenBalances,
    testParameters.tokenIndexOut,
    testParameters.tokenIndexIn,
    tokenAmountOut
  );
  test("Token amount in", () => {
    expect(_bigNumberToNumber(tokenAmountIn)).toBeCloseTo(
      _bigNumberToNumber(testParameters.tokenAmountIn),
      -precision
    );
  });
});
