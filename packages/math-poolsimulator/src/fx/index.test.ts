import { bnum, SubgraphPoolBase } from "@balancer-labs/sor";
import { formatFixed } from "@ethersproject/bignumber";
import { describe, test } from "@jest/globals";

import { numberToBigNumber } from "../conversions";
import { AMM } from "../index";
import { verifyApproximateEquality } from "../utils";
import poolsFromFile from "./fixtures/data.json";
import { ExtendedFx } from "./index";

describe("Tests new Fx math function based on package other functions", () => {
  const poolData = poolsFromFile["pool"];
  const tokens = poolData.tokens.map((token) => token.symbol);
  const percentages = [25, 50, 75, 95];

  tokens.forEach((tokenIn) => {
    const tokenOut = tokenIn === tokens[0] ? tokens[1] : tokens[0];

    percentages.forEach((percentage) => {
      describe(`Tests for ${percentage}% with ${tokenIn} as tokenIn`, () => {
        const amm = new AMM(
          new ExtendedFx({
            swapFee: poolData.swapFee,
            totalShares: poolData.totalShares,
            tokens: poolData.tokens,
            tokensList: poolData.tokensList,
            alpha: poolData.alpha,
            beta: poolData.beta,
            delta: poolData.delta,
            lambda: poolData.lambda,
            epsilon: poolData.epsilon,
          })
        );

        const pool = ExtendedFx.fromPool(poolData as SubgraphPoolBase);
        const poolPairData = pool.parsePoolPairData(tokenIn, tokenOut);

        const amount =
          Number(
            formatFixed(poolPairData.balanceOut, poolPairData.decimalsOut)
          ) *
          (percentage / 100);
        const amountOldBigNumber = bnum(amount);
        if (!pool._checkIfInIsOnLimit(poolPairData, amountOldBigNumber)) {
          return;
        }
        // const spotPriceExpected =
        //   pool._spotPriceAfterSwapExactTokenInForTokenOut(
        //     poolPairData,
        //     amountOldBigNumber
        //   );

        test(`_twoSpotPricePoints`, () => {
          const amountOutBigNumber = pool._exactTokenInForTokenOut(
            poolPairData,
            amountOldBigNumber
          );
          const amountInBigNumber = pool._tokenInForExactTokenOut(
            poolPairData,
            amountOutBigNumber
          );
          console.log({
            amountInBigNumber: amountInBigNumber.toNumber(),
            amountOldBigNumber: amountOldBigNumber.toNumber(),
            amountOutBigNumber: amountOutBigNumber.toNumber(),
          });
          verifyApproximateEquality(
            amountInBigNumber.toNumber(),
            amountOldBigNumber.toNumber()
          );
          //   const spotPriceExpectedOnTokenOut =
          //     pool._spotPriceAfterSwapTokenInForExactTokenOut(
          //       poolPairData,
          //       amountOutBigNumber
          //     );

          //   console.log({
          //     spotPriceTokenOut: spotPriceExpectedOnTokenOut.toNumber(),
          //     spotPriceTokenIn: spotPriceExpected.toNumber(),
          //     tokenIn,
          //     tokenOut,
          //     amount,
          //   });
          //   verifyApproximateEquality(
          //     spotPriceExpectedOnTokenOut.toNumber(),
          //     spotPriceExpected.toNumber()
          //   );
        });

        // test(`_spotPrice`, () => {
        //   const amountOut = amm.exactTokenInForTokenOut(
        //     amount,
        //     tokenIn,
        //     tokenOut
        //   );
        //   poolPairData.balanceIn = poolPairData.balanceIn.add(
        //     numberToBigNumber({
        //       number: amount,
        //       decimals: poolPairData.decimalsIn,
        //     })
        //   );

        //   poolPairData.balanceOut = poolPairData.balanceOut.sub(
        //     numberToBigNumber({
        //       number: amountOut,
        //       decimals: poolPairData.decimalsOut,
        //     })
        //   );
        //   //   console.log({
        //   //     spotPrice: pool._spotPrice(poolPairData).toNumber(),
        //   //     spotPriceExpected: spotPriceExpected.toNumber(),
        //   //     tokenIn,
        //   //     tokenOut,
        //   //     percentage,
        //   //   });
        //   verifyApproximateEquality(
        //     pool._spotPrice(poolPairData).toNumber(),
        //     spotPriceExpected.toNumber()
        //   );
        // });

        // test(`_tokenInForExactSpotPriceAfterSwap`, () => {
        //   const tokenInCalculated = amm.tokenInForExactSpotPriceAfterSwap(
        //     spotPriceExpected.toNumber(),
        //     tokenIn,
        //     tokenOut
        //   );
        //   verifyApproximateEquality(tokenInCalculated, amount);
        // });
      });
    });
  });
});
