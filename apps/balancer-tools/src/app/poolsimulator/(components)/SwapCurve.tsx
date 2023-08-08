"use client";

import { AMM } from "@bleu-balancer-tools/math-poolsimulator/src";
import { PoolPairData } from "@bleu-balancer-tools/math-poolsimulator/src/types";
import { PlotType } from "plotly.js";

import Plot from "#/components/Plot";
import { Spinner } from "#/components/Spinner";
import { usePoolSimulator } from "#/contexts/PoolSimulatorContext";
import { formatNumber } from "#/utils/formatNumber";

import { TokensData } from "../(types)";
import { calculateCurvePoints, trimTrailingValues } from "../(utils)";

export function SwapCurve() {
  const { analysisToken, currentTabToken, initialAMM, customAMM } =
    usePoolSimulator();

  if (!initialAMM || !customAMM) return <Spinner />;

  const {
    amountsAnalysisTokenIn: initialAmountsAnalysisTokenIn,
    amountsAnalysisTokenOut: initialAmountsAnalysisTokenOut,
    amountsTabTokenOut: initialAmountTabTokenOut,
    amountsTabTokenIn: initialAmountTabTokenIn,
  } = calculateTokenAmounts(analysisToken, currentTabToken, initialAMM);

  const {
    amountsAnalysisTokenIn: customAmountsAnalysisTokenIn,
    amountsAnalysisTokenOut: customAmountsAnalysisTokenOut,
    amountsTabTokenOut: customAmountTabTokenOut,
    amountsTabTokenIn: customAmountTabTokenIn,
  } = calculateTokenAmounts(analysisToken, currentTabToken, customAMM);

  const formatSwap = (
    amountIn: number,
    tokenIn: string,
    amountOut: number,
    tokenOut: string,
  ) => {
    const formattedAmountIn = formatNumber(amountIn, 2);
    const formattedAmountOut = formatNumber(amountOut, 2);
    return `Swap ${formattedAmountIn} ${tokenIn} for ${formattedAmountOut} ${tokenOut} <extra></extra>`;
  };

  const createDataObject = (
    x: number[],
    y: number[],
    legendGroup: string,
    name: string,
    showlegend = true,
    hovertemplate: string[],
  ) => {
    return {
      x,
      y,
      type: "scatter" as PlotType,
      legendgroup: legendGroup,
      name,
      showlegend,
      hovertemplate,
    };
  };

  const data = [
    createDataObject(
      initialAmountsAnalysisTokenIn,
      initialAmountTabTokenOut,
      "Initial",
      "Initial",
      true,
      initialAmountsAnalysisTokenIn.map((amount, index) =>
        formatSwap(
          amount,
          analysisToken.symbol,
          -initialAmountTabTokenOut[index],
          currentTabToken.symbol,
        ),
      ),
    ),
    createDataObject(
      customAmountsAnalysisTokenIn,
      customAmountTabTokenOut,
      "Custom",
      "Custom",
      true,
      customAmountsAnalysisTokenIn.map((amount, index) =>
        formatSwap(
          amount,
          analysisToken.symbol,
          -customAmountTabTokenOut[index],
          currentTabToken.symbol,
        ),
      ),
    ),
    createDataObject(
      initialAmountsAnalysisTokenOut,
      initialAmountTabTokenIn,
      "Initial",
      "Initial",
      false,
      initialAmountsAnalysisTokenOut.map((amount, index) =>
        formatSwap(
          initialAmountTabTokenIn[index],
          currentTabToken.symbol,
          -amount,
          analysisToken.symbol,
        ),
      ),
    ),
    createDataObject(
      customAmountsAnalysisTokenOut,
      customAmountTabTokenIn,
      "Custom",
      "Custom",
      false,
      customAmountsAnalysisTokenOut.map((amount, index) =>
        formatSwap(
          customAmountTabTokenIn[index],
          currentTabToken.symbol,
          -amount,
          analysisToken.symbol,
        ),
      ),
    ),
  ];

  function getGraphScale({
    initialAmountsIn,
    customAmountsIn,
    initialAmountsOut,
    customAmountsOut,
  }: {
    initialAmountsIn: number[];
    customAmountsIn: number[];
    initialAmountsOut: number[];
    customAmountsOut: number[];
  }) {
    const maxOfIn = {
      initial: Math.max(...initialAmountsIn),
      custom: Math.max(...customAmountsIn),
    };
    const minOfOut = {
      initial: Math.min(...initialAmountsOut),
      custom: Math.min(...customAmountsOut),
    };

    const limits = {
      lowerIn: Math.min(maxOfIn.initial, maxOfIn.custom),
      higherOut: Math.max(minOfOut.initial, minOfOut.custom),
    };

    if (maxOfIn.initial === maxOfIn.custom) {
      return [initialAmountsOut[100], initialAmountsIn[100]];
    }

    if (maxOfIn.initial === limits.lowerIn) {
      const indexMax = initialAmountsIn.indexOf(limits.lowerIn);
      const indexMin = initialAmountsOut.indexOf(limits.higherOut);
      return [initialAmountsOut[indexMin], initialAmountsIn[indexMax]];
    }
    if (maxOfIn.initial === limits.lowerIn) {
      const indexMax = customAmountsIn.indexOf(limits.lowerIn);
      const indexMin = customAmountsOut.indexOf(limits.higherOut);
      return [customAmountsOut[indexMin], customAmountsIn[indexMax]];
    }
  }

  return (
    <Plot
      title="Swap Curve"
      toolTip="It indicates the quantity of token that will be received when swapping a specific amount of another token. The amount sign is based on the pool point of view."
      data={data}
      layout={{
        xaxis: {
          title: `Amount of ${analysisToken.symbol}`,
          range: getGraphScale({
            initialAmountsOut: initialAmountsAnalysisTokenOut,
            customAmountsOut: customAmountsAnalysisTokenOut,
            initialAmountsIn: initialAmountsAnalysisTokenIn,
            customAmountsIn: customAmountsAnalysisTokenIn,
          }),
        },
        yaxis: {
          title: `Amount of ${currentTabToken.symbol}`,
          range: getGraphScale({
            initialAmountsOut: initialAmountTabTokenOut,
            customAmountsOut: customAmountTabTokenOut,
            initialAmountsIn: initialAmountTabTokenIn,
            customAmountsIn: customAmountTabTokenIn,
          }),
        },
      }}
      className="h-1/2 w-full"
    />
  );
}

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
      amm.exactTokenInForTokenOut(amount, tokenIn.symbol, tokenOut.symbol) * -1,
  );

  const rawAmountsAnalysisTokenOut = rawAmountsTabTokenIn.map(
    (amount) =>
      amm.exactTokenInForTokenOut(amount, tokenOut.symbol, tokenIn.symbol) * -1,
  );

  const { trimmedIn: amountsTabTokenIn, trimmedOut: amountsAnalysisTokenOut } =
    trimTrailingValues(rawAmountsTabTokenIn, rawAmountsAnalysisTokenOut, 0);

  const { trimmedIn: amountsAnalysisTokenIn, trimmedOut: amountsTabTokenOut } =
    trimTrailingValues(rawAmountsAnalysisTokenIn, rawAmountsTabTokenOut, 0);

  return {
    amountsAnalysisTokenIn,
    amountsAnalysisTokenOut,
    amountsTabTokenOut,
    amountsTabTokenIn,
  };
};
