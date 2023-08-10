import { bnum, SubgraphPoolBase } from "@balancer-labs/sor";
import { formatFixed } from "@ethersproject/bignumber";
import { describe, test } from "@jest/globals";

import { numberToBigNumber } from "../conversions";
import { AMM } from "../index";
import { verifyApproximateEquality } from "../utils";
import poolsFromFile from "./fixtures/data.json";
import { ExtendedGyroEV2 } from "./index";

describe("Tests new Gyro ECLP math function based on package other functions", () => {
  const poolData = poolsFromFile["pool"];
  const percentages = [25, 50, 75, 80];
  const tokens = ["wstETH", "swETH"];

  tokens.forEach((tokenIn) => {
    const tokenOut = tokenIn === "wstETH" ? "swETH" : "wstETH";

    percentages.forEach((percentage) => {
      describe(`Tests for ${percentage}% with ${tokenIn} as tokenIn and ${tokenOut} as tokenOut`, () => {
        const amm = new AMM(
          new ExtendedGyroEV2({
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
            },
          }),
        );

        const pool = ExtendedGyroEV2.fromPool(poolData as SubgraphPoolBase);
        const poolPairData = pool.parsePoolPairData(tokenIn, tokenOut);

        const amount =
          Number(
            formatFixed(poolPairData.balanceOut, poolPairData.decimalsOut),
          ) *
          (percentage / 100);
        const amountOldBigNumber = bnum(amount);
        const spotPriceExpected =
          pool._spotPriceAfterSwapExactTokenInForTokenOut(
            poolPairData,
            amountOldBigNumber,
          );
        const amountOut = amm.exactTokenInForTokenOut(
          amount,
          tokenIn,
          tokenOut,
        );

        poolPairData.balanceIn = poolPairData.balanceIn.add(
          numberToBigNumber({
            number: amount,
            decimals: poolPairData.decimalsIn,
          }),
        );

        poolPairData.balanceOut = poolPairData.balanceOut.sub(
          numberToBigNumber({
            number: amountOut,
            decimals: poolPairData.decimalsOut,
          }),
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
});
