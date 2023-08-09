import { bnum, SubgraphPoolBase } from "@balancer-labs/sor";
import { describe, expect, test } from "@jest/globals";

import { numberToBigNumber } from "../conversions";
import { AMM } from "../index";
import poolsFromFile from "./fixtures/data.json";
import { ExtendedGyro3 } from "./index";

describe("Tests new Gyro 3CLP math function based on package other functions", () => {
  const poolData = poolsFromFile["pool"];

  const tokenIn = "USDC";
  const tokenOut = "BUSD";

  const amm = new AMM(
    new ExtendedGyro3({
      swapFee: poolData.swapFee,
      totalShares: poolData.totalShares,
      tokens: poolData.tokens,
      tokensList: poolData.tokensList,
      root3Alpha: poolData.root3Alpha,
    }),
  );

  const pool = ExtendedGyro3.fromPool(poolData as SubgraphPoolBase);
  const poolPairData = pool.parsePoolPairData(tokenIn, tokenOut);
  const amount = 9104;
  const amountOldBigNumber = bnum(amount);
  const spotPriceExpected = pool._spotPriceAfterSwapExactTokenInForTokenOut(
    poolPairData,
    amountOldBigNumber,
  );
  const amountOut = amm.exactTokenInForTokenOut(amount, tokenIn, tokenOut);

  poolPairData.balanceIn = poolPairData.balanceIn.add(
    numberToBigNumber({ number: amount }),
  );

  poolPairData.balanceOut = poolPairData.balanceOut.sub(
    numberToBigNumber({ number: amountOut }),
  );

  test("_spotPrice", () => {
    checkResult(
      pool._spotPrice(poolPairData).toNumber(),
      spotPriceExpected.toNumber(),
    );
  });

  test("_tokenInForExactSpotPriceAfterSwap", () => {
    const tokenInCalculated = amm.tokenInForExactSpotPriceAfterSwap(
      spotPriceExpected.toNumber(),
      tokenIn,
      tokenOut,
    );
    checkResult(tokenInCalculated, amount);
  });
});

function checkResult(calculated: number, result: number) {
  expect(calculated / result).toBeCloseTo(1);
}
