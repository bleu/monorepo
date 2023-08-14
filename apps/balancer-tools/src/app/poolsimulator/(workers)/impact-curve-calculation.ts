import { AMM } from "@bleu-balancer-tools/math-poolsimulator/src";
import { PoolPairData } from "@bleu-balancer-tools/math-poolsimulator/src/types";

import { PoolTypeEnum, TokensData } from "../(types)";
import {
  calculateCurvePoints,
  convertAnalysisDataToAMM,
  trimTrailingValues,
} from "../(utils)";

self.addEventListener("message", async (event: MessageEvent) => {
  try {
    const { tokenIn, tokenOut, data, poolType, swapDirection, type } =
      event.data;

    if (!data) return;

    const amm = await convertAnalysisDataToAMM(data);

    if (!amm) return;
    const calculateTokenImpact = ({
      tokenIn,
      tokenOut,
      amm,
      poolType,
      swapDirection,
    }: {
      tokenIn: TokensData;
      tokenOut: TokensData;
      amm: AMM<PoolPairData>;
      poolType: PoolTypeEnum;
      swapDirection: "in" | "out";
    }) => {
      const maxBalance = Math.max(tokenIn.balance, tokenOut.balance);
      const limitBalance =
        swapDirection === "in" ? tokenOut.balance : tokenIn.balance;
      const rawAmounts =
        poolType === PoolTypeEnum.MetaStable
          ? calculateCurvePoints({
              balance: maxBalance,
              start: 0.001,
            })
          : calculateCurvePoints({
              balance: maxBalance,
              start: 0.001,
            }).filter((value) => value <= limitBalance);

      const rawPriceImpact = rawAmounts.map(
        (amount) =>
          amm.priceImpactForExactTokenInSwap(
            amount,
            swapDirection === "in" ? tokenIn.symbol : tokenOut.symbol,
            swapDirection === "in" ? tokenOut.symbol : tokenIn.symbol,
          ) * 100,
      );

      const { trimmedIn: amounts, trimmedOut: priceImpact } =
        trimTrailingValues(rawAmounts, rawPriceImpact, 100);

      return {
        amounts: amounts,
        priceImpact: priceImpact,
      };
    };
    const result = calculateTokenImpact({
      tokenIn,
      tokenOut,
      amm,
      poolType,
      swapDirection,
    });
    self.postMessage({ result, type, swapDirection });
  } catch (error) {
    const { type } = event.data;
    self.postMessage({ error, type });
  }
});
