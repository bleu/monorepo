import { AMM } from "@bleu/math-poolsimulator/src";
import { PoolPairData } from "@bleu/math-poolsimulator/src/types";

import { AnalysisData } from "#/contexts/PoolSimulatorContext";
import { trimTrailingValues } from "#/lib/utils";

import { TokensData } from "../(types)";
import { calculateCurvePoints, convertAnalysisDataToAMM } from "../(utils)";

export interface SwapCurveWorkerInputData {
  analysisToken: TokensData;
  data: AnalysisData;
  type: "initial" | "custom";
}

export interface SwapCurveWorkerOutputData {
  result?: {
    analysisTokenIn: number[];
    analysisTokenOut: number[];
    pairTokenOut: number[];
    pairTokenIn: number[];
    pairTokenSymbol: string;
  }[];
  error?: Error;
  type: "initial" | "custom";
}

self.addEventListener(
  "message",
  async (event: MessageEvent<SwapCurveWorkerInputData>) => {
    const { analysisToken, data, type } = event.data;

    if (!data) return;

    const amm = await convertAnalysisDataToAMM(data);

    if (!amm) return;

    const pairTokens = data.tokens.filter(
      (token) => token.symbol !== analysisToken.symbol
    );

    const result = pairTokens.map((pairToken) => {
      const calculateTokenAmounts = (
        tokenIn: TokensData,
        tokenOut: TokensData,
        amm: AMM<PoolPairData>
      ) => {
        const rawAmountsAnalysisTokenIn = calculateCurvePoints({
          balance: tokenOut.balance,
        });

        const rawAmountsTabTokenIn = calculateCurvePoints({
          balance: tokenIn.balance,
        });

        const rawAmountsTabTokenOut = rawAmountsAnalysisTokenIn.map(
          (amount) =>
            amm.exactTokenInForTokenOut(
              amount,
              tokenIn.symbol,
              tokenOut.symbol
            ) * -1
        );

        const rawAmountsAnalysisTokenOut = rawAmountsTabTokenIn.map(
          (amount) =>
            amm.exactTokenInForTokenOut(
              amount,
              tokenOut.symbol,
              tokenIn.symbol
            ) * -1
        );

        const { trimmedIn: tabTokenIn, trimmedOut: analysisTokenOut } =
          trimTrailingValues(
            rawAmountsTabTokenIn,
            rawAmountsAnalysisTokenOut,
            0
          );

        const { trimmedIn: analysisTokenIn, trimmedOut: tabTokenOut } =
          trimTrailingValues(
            rawAmountsAnalysisTokenIn,
            rawAmountsTabTokenOut,
            0
          );

        return {
          analysisTokenIn: analysisTokenIn as number[],
          analysisTokenOut: analysisTokenOut as number[],
          pairTokenOut: tabTokenOut as number[],
          pairTokenIn: tabTokenIn as number[],
          pairTokenSymbol: pairToken.symbol as string,
        };
      };

      return calculateTokenAmounts(
        analysisToken as TokensData,
        pairToken as TokensData,
        amm
      );
    });

    self.postMessage({
      result,
      type,
    } as SwapCurveWorkerOutputData);
  }
);
