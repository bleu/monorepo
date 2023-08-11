import { bnum, SubgraphPoolBase } from "@balancer-labs/sor";
import { formatFixed } from "@ethersproject/bignumber";
import { describe, test } from "@jest/globals";

import { numberToBigNumber } from "../conversions";
import { AMM } from "../index";
import { verifyApproximateEquality } from "../utils";
import poolsFromFile from "./fixtures/data.json";
import { ExtendedGyro2 } from "./index";

describe("Tests new Gyro 2CLP math function based on package other functions", () => {
  const poolData = poolsFromFile["pool"];
  const percentages = [25, 50, 75, 95];

  const tokenIn = "USDC";
  const tokenOut = "DAI";

  percentages.forEach((percentage) => {
    describe(`Tests for ${percentage}% with ${tokenIn} as tokenIn`, () => {
      const amm = new AMM(
        new ExtendedGyro2({
          swapFee: poolData.swapFee,
          totalShares: poolData.totalShares,
          tokens: poolData.tokens,
          tokensList: poolData.tokensList,
          sqrtAlpha: poolData.sqrtAlpha,
          sqrtBeta: poolData.sqrtBeta,
        }),
      );

      const pool = ExtendedGyro2.fromPool(poolData as SubgraphPoolBase);
      const poolPairData = pool.parsePoolPairData(tokenIn, tokenOut);

      const amount =
        Number(formatFixed(poolPairData.balanceOut, poolPairData.decimalsOut)) *
        (percentage / 100);
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
      test(`_spotPrice`, () => {
        verifyApproximateEquality(
          pool._spotPrice(poolPairData).toNumber(),
          spotPriceExpected.toNumber(),
        );
      });

      test(`_tokenInForExactSpotPriceAfterSwap`, () => {
        const tokenInCalculated = amm.tokenInForExactSpotPriceAfterSwap(
          spotPriceExpected.toNumber(),
          tokenIn,
          tokenOut,
        );
        verifyApproximateEquality(tokenInCalculated, amount);
      });
    });
  });
});
