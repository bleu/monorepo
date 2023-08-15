import { AMM } from "@bleu-balancer-tools/math-poolsimulator/src";
import { PoolPairData } from "@bleu-balancer-tools/math-poolsimulator/src/types";

import { AnalysisData } from "#/contexts/PoolSimulatorContext";

import { TokensData } from "../(types)";
import {
  calculateCurvePoints,
  convertAnalysisDataToAMM,
  trimTrailingValues,
} from "../(utils)";

export interface SwapCurveWorkerInputData {
  analysisToken: TokensData;
  currentTabToken: TokensData;
  data: AnalysisData;
  type: "initial" | "custom";
}

export interface SwapCurveWorkerOutputData {
  result?: {
    analysisTokenIn: number[];
    analysisTokenOut: number[];
    tabTokenOut: number[];
    tabTokenIn: number[];
  };
  error?: Error;
  type: "initial" | "custom";
}

self.addEventListener(
  "message",
  async (event: MessageEvent<SwapCurveWorkerInputData>) => {
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

    const calcResult = calculateTokenAmounts(
      analysisToken,
      currentTabToken,
      amm,
    );

    const result: SwapCurveWorkerOutputData = {
      result: calcResult,
      type,
    };
    self.postMessage(result);
  },
);
