// @ts-nocheck - TODO: remove this comment once plotly.js types are fixed (legendgrouptitle on PlotParams)
"use client";

import { MetaStableMath } from "@bleu-balancer-tools/math/src";

import Plot from "#/components/Plot";
import { Spinner } from "#/components/Spinner";
import { useStableSwap } from "#/contexts/StableSwapContext";
import { formatNumber } from "#/utils/formatNumber";

import { calculateCurvePoints } from "./StableCurve";

export function ImpactCurve() {
  const { initialData, customData, indexAnalysisToken, indexCurrentTabToken } =
    useStableSwap();

  if (
    !initialData ||
    !initialData.swapFee ||
    !initialData.ampFactor ||
    !initialData.tokens
  )
    return <Spinner />;

  const tokensSymbol = initialData.tokens.map((token) => token.symbol);

  //TODO: move this function to outside the component once the math PR is merged
  const calculateTokenImpact = ({
    swapFee,
    amp,
    indexIn,
    indexOut,
    balances,
    rates,
    decimals,
  }: {
    swapFee: number;
    amp: number;
    indexIn: number;
    indexOut: number;
    balances: number[];
    rates: number[];
    decimals: number[];
  }) => {
    const maxBalance = Math.max(balances[indexIn], balances[indexOut]);
    const amountsIn = calculateCurvePoints({
      balance: maxBalance,
      start: 0.001,
    });

    const poolPairDataIn = MetaStableMath.preparePoolPairData({
      indexIn,
      indexOut,
      swapFee,
      balances,
      amp,
      rates,
      decimals,
    });

    const priceImpact = amountsIn.map(
      (amount) =>
        MetaStableMath.priceImpactForExactTokenInSwap(
          MetaStableMath.numberToOldBigNumber(amount),
          poolPairDataIn,
        ).toNumber() * 100,
    );

    return {
      amountsIn,
      priceImpact,
    };
  };

  const {
    amountsIn: initialAmountsAnalysisTokenIn,
    priceImpact: initialImpactAnalysisTokenIn,
  } = calculateTokenImpact({
    swapFee: initialData.swapFee,
    amp: initialData.ampFactor,
    indexIn: indexAnalysisToken,
    indexOut: indexCurrentTabToken,
    balances: initialData.tokens.map((token) => token.balance),
    rates: initialData.tokens.map((token) => token.rate),
    decimals: initialData.tokens.map((token) => token.decimal),
  });

  const {
    amountsIn: initialAmountsTabTokenIn,
    priceImpact: initialImpactTabTokenIn,
  } = calculateTokenImpact({
    swapFee: initialData.swapFee,
    amp: initialData.ampFactor,
    indexIn: indexCurrentTabToken,
    indexOut: indexAnalysisToken,
    balances: initialData.tokens.map((token) => token.balance),
    rates: initialData.tokens.map((token) => token.rate),
    decimals: initialData.tokens.map((token) => token.decimal),
  });

  const {
    amountsIn: variantAmountsAnalysisTokenIn,
    priceImpact: variantImpactAnalysisTokenIn,
  } = calculateTokenImpact({
    swapFee: customData?.swapFee ? customData.swapFee : initialData.swapFee,
    amp: customData?.ampFactor ? customData.ampFactor : initialData.ampFactor,
    indexIn: indexAnalysisToken,
    indexOut: indexCurrentTabToken,
    balances: customData.tokens.map((token) => token.balance),
    rates: customData.tokens.map((token) => token.rate),
    decimals: customData.tokens.map((token) => token.decimal),
  });

  const {
    amountsIn: variantAmountsTabTokenIn,
    priceImpact: variantImpactTabTokenIn,
  } = calculateTokenImpact({
    swapFee: customData?.swapFee ? customData.swapFee : initialData.swapFee,
    amp: customData?.ampFactor ? customData.ampFactor : initialData.ampFactor,
    indexIn: indexCurrentTabToken,
    indexOut: indexAnalysisToken,
    balances: customData.tokens.map((token) => token.balance),
    rates: customData.tokens.map((token) => token.rate),
    decimals: customData.tokens.map((token) => token.decimal),
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
    tokensSymbol: string[],
    indexAnalysisToken: number,
    indexCurrentTabToken: number,
    direction: "in" | "out",
    impactData: number[],
  ): string[] => {
    return amounts.map((amount, i) => {
      const swapFromIndex =
        direction === "in" ? indexAnalysisToken : indexCurrentTabToken;
      const swapToIndex =
        direction === "in" ? indexCurrentTabToken : indexAnalysisToken;

      const swapAction = formatAction(
        direction,
        amount,
        tokensSymbol[swapFromIndex],
        tokensSymbol[swapToIndex],
      );

      const impact = formatNumber(impactData[i] / 100, 2, "percent");

      return `Swap ${swapAction} causes a Price Impact of ${impact} ${tokensSymbol[indexCurrentTabToken]}/${tokensSymbol[indexAnalysisToken]} <extra></extra>`;
    });
  };

  const createDataObject = (
    hovertemplateData: number[],
    impactData: number[],
    legendgroup: string,
    name: string,
    isLegendShown: boolean,
    direction: "in" | "out",
    tokensSymbol: string[],
    indexAnalysisToken: number,
    indexCurrentTabToken: number,
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
        tokensSymbol,
        indexAnalysisToken,
        indexCurrentTabToken,
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
      tokensSymbol[indexAnalysisToken],
      true,
      "in",
      tokensSymbol,
      indexAnalysisToken,
      indexCurrentTabToken,
    ),
    createDataObject(
      variantAmountsAnalysisTokenIn,
      variantImpactAnalysisTokenIn,
      "Custom",
      tokensSymbol[indexAnalysisToken],
      true,
      "in",
      tokensSymbol,
      indexAnalysisToken,
      indexCurrentTabToken,
    ),
    createDataObject(
      initialAmountsTabTokenIn,
      initialImpactTabTokenIn,
      "Initial",
      tokensSymbol[indexCurrentTabToken],
      true,
      "out",
      tokensSymbol,
      indexAnalysisToken,
      indexCurrentTabToken,
      "dashdot",
    ),
    createDataObject(
      variantAmountsTabTokenIn,
      variantImpactTabTokenIn,
      "Custom",
      tokensSymbol[indexCurrentTabToken],
      true,
      "out",
      tokensSymbol,
      indexAnalysisToken,
      indexCurrentTabToken,
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
