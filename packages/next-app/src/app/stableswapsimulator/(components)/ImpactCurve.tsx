// @ts-nocheck - TODO: remove this comment once plotly.js types are fixed (legendgrouptitle on PlotParams)
"use client";

import { MetaStableMath } from "@bleu-balancer-tools/math/src";

import Plot from "#/components/Plot";
import { Spinner } from "#/components/Spinner";
import { useStableSwap } from "#/contexts/StableSwapContext";

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
          poolPairDataIn
        ).toNumber() * 100
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

  return (
    <Plot
      title="Price Impact Curve"
      toolTip="Indicates how much the swapping of a particular amount of token effects on the Price Impact (rate between the price of both tokens). The sign is based on the pool point of view."
      data={[
        {
          x: initialAmountsAnalysisTokenIn,
          y: initialImpactAnalysisTokenIn,
          type: "scatter",
          mode: "lines",
          legendgroup: "Initial",
          legendgrouptitle: { text: "Initial" },
          name: tokensSymbol[indexAnalysisToken],
          hovertemplate: initialAmountsAnalysisTokenIn.map(
            (amount, index) =>
              `Swap ${amount.toFixed(2)} ${
                tokensSymbol[indexAnalysisToken]
              } for ${
                tokensSymbol[indexCurrentTabToken]
              } causes a Price Impact of ${initialImpactAnalysisTokenIn[
                index
              ].toFixed(2)}% ${tokensSymbol[indexCurrentTabToken]}/${
                tokensSymbol[indexAnalysisToken]
              } <extra></extra>`
          ),
        },
        {
          x: variantAmountsAnalysisTokenIn,
          y: variantImpactAnalysisTokenIn,
          type: "scatter",
          mode: "lines",
          legendgroup: "Custom",
          legendgrouptitle: { text: "Custom" },
          name: tokensSymbol[indexAnalysisToken],
          hovertemplate: variantAmountsAnalysisTokenIn.map(
            (amount, index) =>
              `Swap ${amount.toFixed(2)} ${
                tokensSymbol[indexAnalysisToken]
              } for ${
                tokensSymbol[indexCurrentTabToken]
              } causes a Price Impact of ${variantImpactAnalysisTokenIn[
                index
              ].toFixed(2)}% ${tokensSymbol[indexCurrentTabToken]}/${
                tokensSymbol[indexAnalysisToken]
              } <extra></extra>`
          ),
        },
        {
          x: initialAmountsTabTokenIn,
          y: initialImpactTabTokenIn,
          type: "scatter",
          mode: "lines",
          line: { dash: "dashdot" },
          legendgroup: "Initial",
          legendgrouptitle: { text: "Initial" },
          name: tokensSymbol[indexCurrentTabToken],
          hovertemplate: initialAmountsTabTokenIn.map(
            (amount, index) =>
              `Swap ${amount.toFixed(2)} ${
                tokensSymbol[indexCurrentTabToken]
              } for ${
                tokensSymbol[indexAnalysisToken]
              } causes a Price Impact of ${initialImpactTabTokenIn[
                index
              ].toFixed(2)}% ${tokensSymbol[indexAnalysisToken]}/${
                tokensSymbol[indexCurrentTabToken]
              } <extra></extra>`
          ),
        },
        {
          x: variantAmountsTabTokenIn,
          y: variantImpactTabTokenIn,
          type: "scatter",
          mode: "lines",
          line: { dash: "dashdot" },
          legendgroup: "Custom",
          legendgrouptitle: { text: "Custom" },
          name: tokensSymbol[indexCurrentTabToken],
          hovertemplate: variantAmountsTabTokenIn.map(
            (amount, index) =>
              `Swap ${amount.toFixed(2)}${
                tokensSymbol[indexCurrentTabToken]
              } for ${
                tokensSymbol[indexAnalysisToken]
              } causes a Price Impact of ${variantImpactTabTokenIn[
                index
              ].toFixed(2)}% ${tokensSymbol[indexAnalysisToken]}/${
                tokensSymbol[indexCurrentTabToken]
              } <extra></extra>`
          ),
        },
      ]}
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
