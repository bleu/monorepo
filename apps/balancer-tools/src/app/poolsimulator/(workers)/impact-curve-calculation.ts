import { AMM } from "@bleu/math-poolsimulator/src";
import { PoolPairData } from "@bleu/math-poolsimulator/src/types";

import { AnalysisData } from "#/contexts/PoolSimulatorContext";
import { trimTrailingValues } from "#/lib/utils";

import { PoolTypeEnum, TokensData } from "../(types)";
import { calculateCurvePoints, convertAnalysisDataToAMM } from "../(utils)";
import { getBetaLimitsIndexes } from "../(utils)/getBetaLimits";

export interface ImpactWorkerInputData {
  tokenIn: TokensData;
  tokenOut: TokensData;
  currentTabToken?: TokensData;
  data: AnalysisData;
  poolType: PoolTypeEnum;
  swapDirection: "in" | "out";
  type: "initial" | "custom";
}

export interface ImpactWorkerOutputData {
  result?: {
    amounts: number[];
    priceImpact: number[];
    amountsOut: number[];
    betaLimitIndex: number[];
  };
  swapDirection?: "in" | "out";
  error?: Error;
  type: "initial" | "custom";
}

self.addEventListener(
  "message",
  async (event: MessageEvent<ImpactWorkerInputData>) => {
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
    }: {
      tokenIn: TokensData;
      tokenOut: TokensData;
      amm: AMM<PoolPairData>;
      poolType: PoolTypeEnum;
      swapDirection: "in" | "out";
    }) => {
      const maxBalance = Math.max(tokenIn.balance, tokenOut.balance);
      const rawAmountsIn =
        poolType === PoolTypeEnum.MetaStable
          ? calculateCurvePoints({
              balance: maxBalance,
              startPercentage: 0.001,
            })
          : calculateCurvePoints({
              balance: maxBalance,
              startPercentage: 0.001,
            }).filter((value) => value <= tokenOut.balance);

      const rawPriceImpact = rawAmountsIn.map(
        (amount) =>
          amm.priceImpactForExactTokenInSwap(
            amount,
            tokenIn.symbol,
            tokenOut.symbol,
          ) * 100,
      );

      const { trimmedIn: amountsIn, trimmedOut: priceImpact } =
        trimTrailingValues(rawAmountsIn, rawPriceImpact, 100);

      const amountsOut = rawAmountsIn.map(
        (amount) =>
          amm.exactTokenInForTokenOut(amount, tokenIn.symbol, tokenOut.symbol) *
          -1,
      );

      const betaLimitIndex = getBetaLimitsIndexes({
        amountsA: amountsIn as number[],
        amountsB: amountsOut,
        rateA: tokenIn.rate || 1,
        rateB: tokenOut.rate || 1,
        initialBalanceA: tokenIn.balance,
        initialBalanceB: tokenOut.balance,
        beta: data.poolParams?.beta || 1,
      });

      return {
        amounts: amountsIn as number[],
        priceImpact: priceImpact as number[],
        amountsOut,
        betaLimitIndex,
      };
    };
    const calcResult = calculateTokenImpact({
      tokenIn: swapDirection === "in" ? tokenIn : tokenOut,
      tokenOut: swapDirection === "in" ? tokenOut : tokenIn,
      amm,
      poolType,
      swapDirection,
    });

    const result: ImpactWorkerOutputData = {
      result: calcResult,
      type,
      swapDirection,
    };
    self.postMessage(result);
  },
);
