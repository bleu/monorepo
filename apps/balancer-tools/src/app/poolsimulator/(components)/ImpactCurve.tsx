// @ts-nocheck - TODO: remove this comment once plotly.js types are fixed (legendgrouptitle on PlotParams)
"use client";

import { AMM } from "@bleu-balancer-tools/math-poolsimulator/src";
import { MetaStablePoolPairData } from "@bleu-balancer-tools/math-poolsimulator/src/metastable";

import Plot from "#/components/Plot";
import { Spinner } from "#/components/Spinner";
import { TokensData, usePoolSimulator } from "#/contexts/PoolSimulatorContext";
import { formatNumber } from "#/utils/formatNumber";

import { PoolTypeEnum } from "../(types)";
import { calculateCurvePoints, trimTrailingValues } from "../(utils)";

export function ImpactCurve() {
  const {
    analysisToken,
    currentTabToken,
    initialAMM,
    customAMM,
    initialData,
    customData,
  } = usePoolSimulator();

  if (!initialAMM || !customAMM) return <Spinner />;

  const {
    amounts: initialAmountsAnalysisTokenIn,
    priceImpact: initialImpactAnalysisTokenIn,
  } = calculateTokenImpact({
    tokenIn: analysisToken,
    tokenOut: currentTabToken,
    amm: initialAMM,
    poolType: initialData.poolType,
    swapDirection: "in",
  });

  const {
    amounts: initialAmountsTabTokenIn,
    priceImpact: initialImpactTabTokenIn,
  } = calculateTokenImpact({
    tokenIn: analysisToken,
    tokenOut: currentTabToken,
    amm: initialAMM,
    poolType: initialData.poolType,
    swapDirection: "out",
  });

  const {
    amounts: variantAmountsAnalysisTokenIn,
    priceImpact: variantImpactAnalysisTokenIn,
  } = calculateTokenImpact({
    tokenIn: analysisToken,
    tokenOut: currentTabToken,
    amm: customAMM,
    poolType: customData.poolType,
    swapDirection: "in",
  });

  const {
    amounts: variantAmountsTabTokenIn,
    priceImpact: variantImpactTabTokenIn,
  } = calculateTokenImpact({
    tokenIn: analysisToken,
    tokenOut: currentTabToken,
    amm: customAMM,
    poolType: customData.poolType,
    swapDirection: "out",
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

  const maxFromInitialAmounts = Math.max(
    ...initialAmountsAnalysisTokenIn,
    ...initialAmountsTabTokenIn,
  );
  const maxFromCustomAmounts = Math.max(
    ...variantAmountsAnalysisTokenIn,
    ...variantAmountsTabTokenIn,
  );
  const xlimit = Math.min(maxFromInitialAmounts, maxFromCustomAmounts);
  function indexOfXLimit(value, ...arrays) {
    return arrays.map((arr) => arr.indexOf(value)).find((idx) => idx !== -1);
  }

  const arraysToSearch = [
    initialAmountsAnalysisTokenIn,
    initialAmountsTabTokenIn,
    variantAmountsAnalysisTokenIn,
    variantAmountsTabTokenIn,
  ];
  const xLimitIndex = maxFromInitialAmounts
    ? indexOfXLimit(xlimit, ...arraysToSearch)
    : undefined;

  const getImpactOnXLimit = (analysis, tab) =>
    Math.max(analysis[xLimitIndex] || 0, tab[xLimitIndex] || 0);

  const ylimit = Math.max(
    getImpactOnXLimit(initialImpactAnalysisTokenIn, initialImpactTabTokenIn),
    getImpactOnXLimit(variantImpactAnalysisTokenIn, variantImpactTabTokenIn),
  );
  return (
    <Plot
      title="Price Impact Curve"
      toolTip="Indicates how much the swapping of a particular amount of token effects on the Price Impact (rate between the price of both tokens). The sign is based on the pool point of view."
      data={data}
      layout={{
        xaxis: {
          title: `Amount in`,
          range: [0, xlimit],
        },
        yaxis: {
          title: `Price impact (%)`,
          range: [, ylimit],
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
  poolType,
  swapDirection,
}: {
  tokenIn: TokensData;
  tokenOut: TokensData;
  amm: AMM<MetaStablePoolPairData>;
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

  const { trimmedIn: amounts, trimmedOut: priceImpact } = trimTrailingValues(
    rawAmounts,
    rawPriceImpact,
    100,
  );

  return {
    amounts: amounts,
    priceImpact: priceImpact,
  };
};
