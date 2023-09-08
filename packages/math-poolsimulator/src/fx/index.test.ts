import { bnum, SubgraphPoolBase } from "@balancer-labs/sor";
import { formatFixed } from "@ethersproject/bignumber";
import { describe, test } from "@jest/globals";

import { AMM } from "../index";
import { verifyApproximateEquality } from "../utils";
import poolsFromFile from "./fixtures/data.json";
import { ExtendedFx } from "./index";

describe("Tests new Fx math function based on package other functions", () => {
  const poolData = poolsFromFile["pool"];
  // const tokens = poolData.tokens.map((token) => token.address);
  const tokens = ["EURS"];
  // const percentages = [10, 20, 30, 40, 50, 60, 70, 80, 90];
  const percentages = [30];

  tokens.forEach((tokenIn) => {
    // const tokenOut = tokenIn === tokens[0] ? tokens[1] : tokens[0];
    const tokenOut = "USDC";

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
            lambda: poolData.lambda,
            delta: poolData.delta,
            epsilon: poolData.epsilon,
          })
        );

        const pool = ExtendedFx.fromPool(poolData as SubgraphPoolBase);
        const poolPairDataBeforeSwap = pool.parsePoolPairData(
          tokenIn,
          tokenOut
        );

        const amount =
          Number(
            formatFixed(
              poolPairDataBeforeSwap.balanceOut,
              poolPairDataBeforeSwap.decimalsOut
            )
          ) *
          (percentage / 100);
        const amountOldBigNumber = bnum(amount);

        if (
          !pool._checkIfInIsOnLimit(poolPairDataBeforeSwap, amountOldBigNumber)
        )
          return;

        const spotPriceExpected =
          pool._spotPriceAfterSwapExactTokenInForTokenOut(
            poolPairDataBeforeSwap,
            amountOldBigNumber
          );

        const currentSpotPrice = pool._spotPrice(poolPairDataBeforeSwap);
        console.log({
          spotPriceExpected: spotPriceExpected.toString(),
          currentSpotPrice: currentSpotPrice.toString(),
          amount,
        });
        test(`_spotPrice`, () => {
          const amountOut = pool._exactTokenInForTokenOut(
            poolPairDataBeforeSwap,
            bnum(amount)
          );
          const poolPairDataAfterSwap = pool.parsePoolPairDataAfterSwap(
            tokenIn,
            tokenOut,
            amountOldBigNumber,
            amountOut
          );
          const spotPrice = pool._spotPrice(poolPairDataAfterSwap);

          verifyApproximateEquality(
            spotPrice.toNumber(),
            spotPriceExpected.toNumber()
          );
        });

        // // if (currentSpotPrice.gte(spotPriceExpected.toString())) return;
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
