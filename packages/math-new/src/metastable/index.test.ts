import { bnum, SubgraphPoolBase } from "@balancer-labs/sor";
import { describe, expect, test } from "@jest/globals";

import { AMM } from "../index";
import poolsFromFile from "./fixtures/data.json";
import { ExtendedMetaStableMath } from "./index";

describe("Tests new stable math function based on package other functions", () => {
  const poolData = poolsFromFile["pools"][0];
  const tokenIn = "DAI";
  const tokenOut = "USDC";
  const pool = ExtendedMetaStableMath.fromPool(poolData as SubgraphPoolBase);
  const amm = new AMM({
    poolType: "MetaStable",
    poolParams: {
      swapFee: poolData.swapFee,
      amp: poolData.amp,
      totalShares: poolData.totalShares,
      tokens: poolData.tokens,
      tokensList: poolData.tokensList,
    },
  });
  const poolPairData = pool.parsePoolPairData(tokenIn, tokenOut);
  const amount = 5000000000000;
  const amountOldBigNumber = bnum(amount);
  const spotPriceExpected = pool._spotPriceAfterSwapExactTokenInForTokenOut(
    poolPairData,
    amountOldBigNumber,
  );

  const amountOut = amm.exactTokenInForTokenOut(amount, tokenIn, tokenOut);
  poolPairData.allBalances[poolPairData.tokenIndexIn] =
    poolPairData.allBalances[poolPairData.tokenIndexIn].plus(
      amountOldBigNumber,
    );
  poolPairData.allBalances[poolPairData.tokenIndexOut] =
    poolPairData.allBalances[poolPairData.tokenIndexOut].minus(bnum(amountOut));
  const tokenInCalculated = amm.tokenInForExactSpotPriceAfterSwap(
    spotPriceExpected.toNumber(),
    tokenIn,
    tokenOut,
  );

  test("_spotPrice", () => {
    checkResult(
      pool._spotPrice(poolPairData).toNumber(),
      spotPriceExpected.toNumber(),
    );
  });
  test("__tokenInForExactSpotPriceAfterSwap", () => {
    checkResult(tokenInCalculated, amount);
  });
});

function checkResult(calculated: number, result: number) {
  expect(calculated / result).toBeCloseTo(1);
}
