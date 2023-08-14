import { AMM } from "@bleu-balancer-tools/math-poolsimulator/src";
import { PoolPairData } from "@bleu-balancer-tools/math-poolsimulator/src/types";

import { TokensData } from "../(types)";
import {
  calculateCurvePoints,
  convertAnalysisDataToAMM,
  trimTrailingValues,
} from "../(utils)";

self.addEventListener("message", async (event: MessageEvent) => {
  try {
    const { analysisToken, currentTabToken, data, type } = event.data;

    if (!data) return;

    const amm = await convertAnalysisDataToAMM(data);

    if (!amm) return;

    const calculateTokenAmounts = (
      tokenIn: TokensData,
      tokenOut: TokensData,
      amm: AMM<PoolPairData>,
    ) => {
      const rawAmountsAnalysisTokenIn = calculateCurvePoints({
        balance: tokenIn.balance,
      });

      const rawAmountsTabTokenIn = calculateCurvePoints({
        balance: tokenOut.balance,
      });

      const rawAmountsTabTokenOut = rawAmountsAnalysisTokenIn.map(
        (amount) =>
          amm.exactTokenInForTokenOut(amount, tokenIn.symbol, tokenOut.symbol) *
          -1,
      );

      const rawAmountsAnalysisTokenOut = rawAmountsTabTokenIn.map(
        (amount) =>
          amm.exactTokenInForTokenOut(amount, tokenOut.symbol, tokenIn.symbol) *
          -1,
      );

      const { trimmedIn: tabTokenIn, trimmedOut: analysisTokenOut } =
        trimTrailingValues(rawAmountsTabTokenIn, rawAmountsAnalysisTokenOut, 0);

      const { trimmedIn: analysisTokenIn, trimmedOut: tabTokenOut } =
        trimTrailingValues(rawAmountsAnalysisTokenIn, rawAmountsTabTokenOut, 0);

      return {
        analysisTokenIn,
        analysisTokenOut,
        tabTokenOut,
        tabTokenIn,
      };
    };

    const result = calculateTokenAmounts(analysisToken, currentTabToken, amm);
    self.postMessage({ result, type });
  } catch (error) {
    const { type } = event.data;
    self.postMessage({ error, type });
  }
});
