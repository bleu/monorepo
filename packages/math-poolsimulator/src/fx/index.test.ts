import { bnum, FxMaths, FxPool, SubgraphPoolBase } from "@balancer-labs/sor";
import { formatFixed } from "@ethersproject/bignumber";
import { describe, test } from "@jest/globals";

import { numberToBigNumber } from "../conversions";
import { verifyApproximateEquality } from "../utils";
import poolsFromFile from "./fixtures/data.json";

describe("Tests new Fx math function based on package other functions", () => {
  const poolData = poolsFromFile["pool"];
  const tokens = poolData.tokens.map((token) => token.address);
  const percentages = [10];

  tokens.forEach((tokenIn) => {
    const tokenOut = tokenIn === tokens[0] ? tokens[1] : tokens[0];

    percentages.forEach((percentage) => {
      describe(`Tests for ${percentage}% with ${tokenIn} as tokenIn`, () => {
        const pool = FxPool.fromPool(poolData as SubgraphPoolBase);
        const poolPairDataBeforeSwap = pool.parsePoolPairData(
          tokenIn,
          tokenOut,
        );

        const amount =
          Number(
            formatFixed(
              poolPairDataBeforeSwap.balanceIn,
              poolPairDataBeforeSwap.decimalsIn,
            ),
          ) *
          (percentage / 100);
        const amountOldBigNumber = bnum(amount);

        const spotPriceExpected =
          FxMaths._spotPriceAfterSwapExactTokenInForTokenOut(
            poolPairDataBeforeSwap,
            amountOldBigNumber,
          );

        test(`_spotPrice`, () => {
          const amountOut = pool._exactTokenInForTokenOut(
            poolPairDataBeforeSwap,
            bnum(amount),
          );

          pool.updateTokenBalanceForPool(
            tokenIn,
            poolPairDataBeforeSwap.balanceIn.add(
              numberToBigNumber({
                number: amount,
                decimals: poolPairDataBeforeSwap.decimalsIn,
              }),
            ),
          );

          pool.updateTokenBalanceForPool(
            tokenOut,
            poolPairDataBeforeSwap.balanceOut.sub(
              numberToBigNumber({
                number: amountOut.toNumber(),
                decimals: poolPairDataBeforeSwap.decimalsIn,
              }),
            ),
          );

          const poolPairDataAfterSwap = pool.parsePoolPairData(
            tokenIn,
            tokenOut,
          );
          const spotPrice = FxMaths._spotPriceAfterSwapExactTokenInForTokenOut(
            poolPairDataAfterSwap,
            bnum(0),
          );

          verifyApproximateEquality(
            spotPrice.toNumber(),
            spotPriceExpected.toNumber(),
          );
        });
      });
    });
  });
});
