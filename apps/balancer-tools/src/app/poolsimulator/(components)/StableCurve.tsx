"use client";

import { AMM } from "@bleu-balancer-tools/math-poolsimulator/src";
import { PlotType } from "plotly.js";

import Plot from "#/components/Plot";
import { Spinner } from "#/components/Spinner";
import { TokensData, useStableSwap } from "#/contexts/PoolSimulatorContext";
import { formatNumber } from "#/utils/formatNumber";

export function StableCurve() {
  const { analysisToken, currentTabToken, initialAMM, customAMM } =
    useStableSwap();

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

  return (
    <Plot
      title="Swap Curve"
      toolTip="It indicates the quantity of token that will be received when swapping a specific amount of another token. The amount sign is based on the pool point of view."
      data={data}
      layout={{
        xaxis: {
          title: `Amount of ${analysisToken.symbol}`,
          range: [
            initialAmountsAnalysisTokenOut[100],
            initialAmountsAnalysisTokenIn[100],
          ],
        },
        yaxis: {
          title: `Amount of ${currentTabToken.symbol}`,
          range: [initialAmountTabTokenOut[100], initialAmountTabTokenIn[100]],
        },
      }}
      className="h-1/2 w-full"
    />
  );
}

export function calculateCurvePoints({
  balance,
  start = 0,
}: {
  balance?: number;
  start?: number;
}) {
  if (!balance || typeof start == "undefined") return [];
  const numberOfPoints = 100;
  const initialValue = balance * 0.001;
  const stepRatio = Math.pow(balance / initialValue, 1 / (numberOfPoints - 1));

  return [
    start,
    ...Array.from(
      { length: numberOfPoints + 20 },
      (_, index) => initialValue * stepRatio ** index,
    ),
  ];
}

const calculateTokenAmounts = (
  tokenIn: TokensData,
  tokenOut: TokensData,
  amm: AMM,
) => {
  const amountsAnalysisTokenIn = calculateCurvePoints({
    balance: tokenIn.balance,
  });
  const amountsTabTokenIn = calculateCurvePoints({
    balance: tokenOut.balance,
  });

  const amountsTabTokenOut = amountsAnalysisTokenIn.map(
    (amount) =>
      amm.exactTokenInForTokenOut(amount, tokenIn.symbol, tokenOut.symbol) * -1,
  );

  const amountsAnalysisTokenOut = amountsTabTokenIn.map(
    (amount) =>
      amm.exactTokenInForTokenOut(amount, tokenOut.symbol, tokenIn.symbol) * -1,
  );

  return {
    amountsAnalysisTokenIn,
    amountsAnalysisTokenOut,
    amountsTabTokenOut,
    amountsTabTokenIn,
  };
};
