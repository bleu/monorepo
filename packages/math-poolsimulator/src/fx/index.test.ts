import { bnum, FxMaths, FxPool, SubgraphPoolBase } from "@balancer-labs/sor";
import { formatFixed, parseFixed } from "@ethersproject/bignumber";
import { describe, test } from "@jest/globals";

import { numberToBigNumber } from "../conversions";
import { verifyApproximateEquality } from "../utils";
import poolsFromFile from "./fixtures/data.json";

describe("Tests new Fx math function based on package other functions", () => {
  const poolData = poolsFromFile["pool"];
  const tokens = poolData.tokens.map((token) => token.address);
  const percentages = [25];

  tokens.forEach((tokenIn) => {
    const tokenOut = tokenIn === tokens[0] ? tokens[1] : tokens[0];

    percentages.forEach((percentage) => {
      describe(`Tests for ${percentage}% with ${tokenIn} as tokenIn`, () => {
        const pool = FxPool.fromPool(poolData as SubgraphPoolBase);
        const poolPairData = pool.parsePoolPairData(tokenIn, tokenOut);

        const amount =
          Number(
            formatFixed(poolPairData.balanceOut, poolPairData.decimalsOut)
          ) *
          (percentage / 100);
        const amountOldBigNumber = bnum(amount);

        const spotPriceExpected =
          FxMaths._spotPriceAfterSwapExactTokenInForTokenOut(
            poolPairData,
            amountOldBigNumber
          );

        test(`_spotPrice`, () => {
          const amountOut = pool._exactTokenInForTokenOut(
            poolPairData,
            bnum(amount)
          );

          poolPairData.balanceIn = poolPairData.balanceIn.add(
            numberToBigNumber({
              number: amount,
              decimals: poolPairData.decimalsIn,
            })
          );

          poolPairData.balanceOut = poolPairData.balanceOut.sub(
            parseFixed(amountOut.toString(), poolPairData.decimalsOut)
          );

          verifyApproximateEquality(
            FxMaths._spotPriceAfterSwapExactTokenInForTokenOut(
              poolPairData,
              bnum(0)
            ).toNumber(),
            spotPriceExpected.toNumber()
          );
        });
      });
    });
  });
});
