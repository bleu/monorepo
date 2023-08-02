// @ts-nocheck - TODO: remove this comment once plotly.js types are fixed (legendgrouptitle on PlotParams)
"use client";

import { AMM } from "@bleu-balancer-tools/math-poolsimulator/src";
import { MetaStablePoolPairData } from "@bleu-balancer-tools/math-poolsimulator/src/metastable";

import Plot from "#/components/Plot";
import { Spinner } from "#/components/Spinner";
import { TokensData, usePoolSimulator } from "#/contexts/PoolSimulatorContext";
import { formatNumber } from "#/utils/formatNumber";

import { calculateCurvePoints } from "./StableCurve";

export function ImpactCurve() {
  const { analysisToken, currentTabToken, initialAMM, customAMM } =
    usePoolSimulator();

  if (!initialAMM || !customAMM) return <Spinner />;

  const {
    amountsIn: initialAmountsAnalysisTokenIn,
    priceImpact: initialImpactAnalysisTokenIn,
  } = calculateTokenImpact({
    tokenIn: analysisToken,
    tokenOut: currentTabToken,
    amm: initialAMM,
  });

  const {
    amountsIn: initialAmountsTabTokenIn,
    priceImpact: initialImpactTabTokenIn,
  } = calculateTokenImpact({
    tokenIn: currentTabToken,
    tokenOut: analysisToken,
    amm: initialAMM,
  });

  const {
    amountsIn: variantAmountsAnalysisTokenIn,
    priceImpact: variantImpactAnalysisTokenIn,
  } = calculateTokenImpact({
    tokenIn: analysisToken,
    tokenOut: currentTabToken,
    amm: customAMM,
  });

  const {
    amountsIn: variantAmountsTabTokenIn,
    priceImpact: variantImpactTabTokenIn,
  } = calculateTokenImpact({
    tokenIn: currentTabToken,
    tokenOut: analysisToken,
    amm: customAMM,
  });

  // Helper function to format the swap action string
  const formatAction = (
    direction: "in" | "out",
    amount: number,
    tokenFrom: string,
    tokenTo: string,
  ) => {
    const formattedAmount = formatNumber(amount, 2);
    return direction === "in"
      ? `${formattedAmount} ${tokenFrom} for ${tokenTo}`
      : `${tokenTo} for ${formattedAmount} ${tokenFrom}`;
  };

  const createHoverTemplate = (
    amounts: number[],
    direction: "in" | "out",
    impactData: number[],
  ): string[] => {
    return amounts.map((amount, i) => {
      const swapFromSymbol =
        direction === "in" ? analysisToken.symbol : currentTabToken.symbol;
      const swapToSymbol =
        direction === "in" ? currentTabToken.symbol : analysisToken.symbol;

      const swapAction = formatAction(
        direction,
        amount,
        swapFromSymbol,
        swapToSymbol,
      );

      const impact = formatNumber(impactData[i] / 100, 2, "percent");

      return `Swap ${swapAction} causes a Price Impact of ${impact} ${swapFromSymbol}/${swapToSymbol} <extra></extra>`;
    });
  };

  const createDataObject = (
    hovertemplateData: number[],
    impactData: number[],
    legendgroup: string,
    name: string,
    isLegendShown: boolean,
    direction: "in" | "out",
    lineStyle: "solid" | "dashdot" = "solid",
  ) => {
    const line = lineStyle === "dashdot" ? { dash: "dashdot" } : {};

    return {
      x: hovertemplateData,
      y: impactData,
      type: "scatter" as const,
      mode: "lines",
      legendgroup,
      legendgrouptitle: { text: legendgroup },
      name,
      showlegend: isLegendShown,
      hovertemplate: createHoverTemplate(
        hovertemplateData,
        direction,
        impactData,
      ),
      line,
    };
  };

  const data = [
    createDataObject(
      initialAmountsAnalysisTokenIn,
      initialImpactAnalysisTokenIn,
      "Initial",
      analysisToken.symbol,
      true,
      "in",
    ),
    createDataObject(
      variantAmountsAnalysisTokenIn,
      variantImpactAnalysisTokenIn,
      "Custom",
      analysisToken.symbol,
      true,
      "in",
    ),
    createDataObject(
      initialAmountsTabTokenIn,
      initialImpactTabTokenIn,
      "Initial",
      currentTabToken.symbol,
      true,
      "out",
      "dashdot",
    ),
    createDataObject(
      variantAmountsTabTokenIn,
      variantImpactTabTokenIn,
      "Custom",
      currentTabToken.symbol,
      true,
      "out",
      "dashdot",
    ),
  ];

  return (
    <Plot
      title="Price Impact Curve"
      toolTip="Indicates how much the swapping of a particular amount of token effects on the Price Impact (rate between the price of both tokens). The sign is based on the pool point of view."
      data={data}
      layout={{
        xaxis: {
          title: `Amount in`,
        },
        yaxis: {
          title: `Price impact (%)`,
        },
      }}
      className="h-1/2 w-full"
    />
  );
}

const calculateTokenImpact = ({
  tokenIn,
  tokenOut,
  amm,
}: {
  tokenIn: TokensData;
  tokenOut: TokensData;
  amm: AMM<MetaStablePoolPairData>;
}) => {
  const maxBalance = Math.max(tokenIn.balance, tokenOut.balance);
  const amountsIn = calculateCurvePoints({
    balance: maxBalance,
    start: 0.001,
  });

  const priceImpact = amountsIn.map(
    (amount) =>
      amm.priceImpactForExactTokenInSwap(
        amount,
        tokenIn.symbol,
        tokenOut.symbol,
      ) * 100,
  );

  return {
    amountsIn,
    priceImpact,
  };
};
