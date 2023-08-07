import {
  bnum,
  type OldBigNumber,
  StablePool,
  type SubgraphPoolBase,
} from "@balancer-labs/sor";
import { describe, expect, test } from "@jest/globals";
import { StableMath } from "index";

import poolsFromFile from "./fixtures/data.json";

describe("Tests new stable math function based on package other functions", () => {
  const pool = poolsFromFile["pools"][0];
  const tokenIn = "0xdac17f958d2ee523a2206206994597c13d831ec7";
  const tokenOut = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const poolPairData = createPoolPairData(pool, tokenIn, tokenOut);
  const amount = bnum(50000000000);
  const spotPriceExpected =
    StableMath._spotPriceAfterSwapExactTokenInForTokenOut(amount, poolPairData);

  const amountOut = StableMath._exactTokenInForTokenOut(amount, poolPairData);
  const poolPairDataAfterSwap = createPoolPairData(pool, tokenIn, tokenOut);
  poolPairDataAfterSwap.allBalances[poolPairData.tokenIndexIn] =
    poolPairData.allBalances[poolPairData.tokenIndexIn].plus(amount);
  poolPairDataAfterSwap.allBalances[poolPairData.tokenIndexOut] =
    poolPairData.allBalances[poolPairData.tokenIndexOut].minus(amountOut);

  test("_spotPrice", () => {
    const spotPriceCalculated = StableMath._spotPrice(poolPairDataAfterSwap);
    checkResult(spotPriceCalculated, spotPriceExpected);
  });
  test("__tokenInForExactSpotPriceAfterSwap", () => {
    const tokenInCalculated = StableMath._tokenInForExactSpotPriceAfterSwap(
      spotPriceExpected,
      poolPairData,
    );
    checkResult(tokenInCalculated, amount);
  });
});

function createPoolPairData(
  pool: object,
  tokenIndexIn: string,
  tokenIndexOut: string,
) {
  const stableBptSwapPool = StablePool.fromPool(pool as SubgraphPoolBase);
  return stableBptSwapPool.parsePoolPairData(
    tokenIndexIn.toLowerCase(),
    tokenIndexOut.toLowerCase(),
  );
}

function checkResult(calculated: OldBigNumber, result: OldBigNumber) {
  expect(calculated.div(result).toNumber()).toBeCloseTo(1);
}
