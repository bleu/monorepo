import { describe, expect, test } from "@jest/globals";

// import { MathSol } from "./basicOperations";
import * as stableMath from "./stableMathBigInt";

const amplificationParameter = BigInt(1e3);
const tokenBalances = [BigInt(2000000e18), BigInt(1401869.15e18)];
const tokenIndexIn = 0;
const tokenIndexOut = 1;
const fee = BigInt(0);

const inputAmountResult = BigInt(50000e18);

const spotPriceResult = BigInt(0.835477e18);
const spotPriceToInputAmount =
  stableMath._spotPriceAfterSwapExactTokenInForTokenOut(
    amplificationParameter,
    [...tokenBalances],
    tokenIndexIn,
    tokenIndexOut,
    inputAmountResult,
    fee
  );
console.log("spotPriceToInputAmount", Number(spotPriceToInputAmount) / 1e18);

function compareBigInt(a: bigint, b: bigint) {
  return Number(a) / 1e18 / (Number(b) / 1e18);
}

describe("ZD sheets tests", () => {
  const precision = 3;

  const spotPriceCalculated = stableMath._currentSpotPrice(
    amplificationParameter,
    [...tokenBalances],
    tokenIndexIn,
    tokenIndexOut,
    fee
  );

  test("Spot Price", () => {
    expect(compareBigInt(spotPriceCalculated, spotPriceResult)).toBeCloseTo(
      1,
      precision
    );
  });

  const inputAmountCalculated = stableMath._calcInGivenSpotPrice(
    amplificationParameter,
    [...tokenBalances],
    tokenIndexIn,
    tokenIndexOut,
    spotPriceToInputAmount,
    fee
  );
  test("Input amount", () => {
    expect(compareBigInt(inputAmountCalculated, inputAmountResult)).toBeCloseTo(
      1,
      precision
    );
  });
});
