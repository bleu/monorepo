import { bnum, SubgraphPoolBase } from "@balancer-labs/sor";
import { describe, expect, test } from "@jest/globals";

import { AMM, numberToBigNumber } from "../index";
import poolsFromFile from "./fixtures/data.json";
import { ExtendedGyroEV2 } from "./index";

describe("Tests new Gyro ECLP math function based on package other functions", () => {
  const poolData = poolsFromFile["pool"];

  const tokenIn = "wstETH";
  const tokenOut = "swETH";

  const amm = new AMM(new ExtendedGyroEV2({
      swapFee: poolData.swapFee,
      totalShares: poolData.totalShares,
      tokens: poolData.tokens,
      tokensList: poolData.tokensList,
      gyroEParams: {
        alpha: poolData.alpha,
        beta: poolData.beta,
        c: poolData.c,
        s: poolData.s,
        lambda: poolData.lambda,
      },
      tokenRates: poolData.tokenRates,
      derivedGyroEParams: {
        tauAlphaX: poolData.tauAlphaX,
        tauAlphaY: poolData.tauAlphaY,
        tauBetaX: poolData.tauBetaX,
        tauBetaY: poolData.tauBetaY,
        u: poolData.u,
        v: poolData.v,
        w: poolData.w,
        z: poolData.z,
        dSq: poolData.dSq,
  }}));
  const pool = ExtendedGyroEV2.fromPool(poolData as SubgraphPoolBase);
  const poolPairData = pool.parsePoolPairData(tokenIn, tokenOut);
  const amount = 0.01;
  const amountOldBigNumber = bnum(amount);
  const spotPriceExpected = pool._spotPriceAfterSwapExactTokenInForTokenOut(
    poolPairData,
    amountOldBigNumber
  );

  const amountOut = amm.exactTokenInForTokenOut(amount, tokenIn, tokenOut);
  poolPairData.balanceIn = poolPairData.balanceIn.add(
    numberToBigNumber({ number: amount })
  );
  poolPairData.balanceOut = poolPairData.balanceOut.sub(
    numberToBigNumber({ number: amountOut })
  );

  test("_spotPrice", () => {
    checkResult(
      pool._spotPrice(poolPairData).toNumber(),
      spotPriceExpected.toNumber()
    );
  });
  test("_tokenInForExactSpotPriceAfterSwap", () => {
    const tokenInCalculated = amm.tokenInForExactSpotPriceAfterSwap(
      spotPriceExpected.toNumber(),
      tokenIn,
      tokenOut
    );
    checkResult(tokenInCalculated, amount);
  });
});

function checkResult(calculated: number, result: number) {
  expect(calculated / result).toBeCloseTo(1);
}
