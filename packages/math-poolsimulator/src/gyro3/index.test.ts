import { bnum, SubgraphPoolBase } from "@balancer-labs/sor";
import { formatFixed } from "@ethersproject/bignumber";
import { describe, test } from "@jest/globals";

import { numberToBigNumber } from "../conversions";
import { AMM } from "../index";
import { verifyApproximateEquality } from "../utils";
import poolsFromFile from "./fixtures/data.json";
import { ExtendedGyro3 } from "./index";

describe("Tests new Gyro 3CLP math function based on package other functions", () => {
  const poolData = poolsFromFile["pool"];
  const percentages = [25, 50, 75, 95];
  const tokens = ["USDC", "BUSD", "USDT"];

  tokens.forEach((tokenIn) => {
    tokens.forEach((tokenOut) => {
      if (tokenIn === tokenOut) return; // Skip when both tokens are the same

      percentages.forEach((percentage) => {
        describe(`Tests for ${percentage}% with ${tokenIn} as tokenIn and ${tokenOut} as tokenOut`, () => {
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
});
