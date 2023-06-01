"use client";

import { StableMath } from "@balancer-pool-metadata/math/src";

import Plot from "#/components/Plot";
import { Spinner } from "#/components/Spinner";
import { useStableSwap } from "#/contexts/StableSwapContext";

export function ImpactCurve() {
  const {
    baselineData,
    variantData,
    indexAnalysisToken,
    indexCurrentTabToken,
    preparePoolPairData,
    numberToOldBigNumber,
  } = useStableSwap();

  if (
    !baselineData ||
    !baselineData.swapFee ||
    !baselineData.ampFactor ||
    !baselineData.tokens
  )
    return <Spinner />;

  const tokensSymbol = baselineData.tokens.map((token) => token.symbol);

  //TODO: move this function to outside the component once the math PR is merged
  const calculateTokenImpact = ({
    balance,
    swapFee,
    amp,
    indexIn,
    indexOut,
    allBalances,
  }: {
    balance: number | undefined;
    swapFee: number;
    amp: number;
    indexIn: number;
    indexOut: number;
    allBalances: number[];
  }) => {
    const amountsIn = calculateAmounts({ balance });

    const amountsOut = amountsIn.map((amount) => -1 * amount);

    const poolPairDataIn = preparePoolPairData({
      indexIn,
      indexOut,
      swapFee,
      allBalances,
      amp,
    });

    const impactTabTokenOut = amountsIn.map(
      (amount) =>
        StableMath._priceImpactForExactTokenInSwap(
          numberToOldBigNumber(amount),
          poolPairDataIn
        ).toNumber() * 100
    );

    const poolPairDataOut = preparePoolPairData({
      indexIn: indexOut,
      indexOut: indexIn,
      swapFee,
      allBalances,
      amp,
    });

    const impactTabTokenIn = amountsIn.map(
      (amount) =>
        StableMath._priceImpactForExactTokenOutReversedSwap(
          numberToOldBigNumber(amount),
          poolPairDataOut
        ).toNumber() * 100
    );

    return {
      amountsIn,
      amountsOut,
      impactTabTokenOut,
      impactTabTokenIn,
    };
  };

  const {
    amountsIn: initialAmountsAnalysisTokenIn,
    impactTabTokenOut: initialImpactTabTokenOut,
    amountsOut: initialAmountsAnalysisTokenOut,
    impactTabTokenIn: initialImpactTabTokenIn,
  } = calculateTokenImpact({
    balance: baselineData.tokens[indexAnalysisToken]?.balance,
    swapFee: baselineData.swapFee,
    amp: baselineData.ampFactor,
    indexIn: indexAnalysisToken,
    indexOut: indexCurrentTabToken,
    allBalances: baselineData.tokens.map((token) => token.balance),
  });

  const {
    amountsIn: variantAmountsAnalysisTokenIn,
    impactTabTokenOut: variantImpactTabTokenOut,
    amountsOut: variantAmountsAnalysisTokenOut,
    impactTabTokenIn: variantImpactTabTokenIn,
  } = calculateTokenImpact({
    balance: variantData?.tokens?.[indexAnalysisToken]?.balance,
    swapFee: variantData?.swapFee ? variantData.swapFee : baselineData.swapFee,
    amp: variantData?.ampFactor
      ? variantData.ampFactor
      : baselineData.ampFactor,
    indexIn: indexAnalysisToken,
    indexOut: indexCurrentTabToken,
    allBalances: baselineData.tokens.map((token) => token.balance),
  });

  return (
    <Plot
      title="Price Impact Curve"
      toolTip="Indicates how much the swapping of a particular amount of token effects on the Price Impact (rate between the price of both tokens)"
      data={[
        {
          x: initialAmountsAnalysisTokenIn,
          y: initialImpactTabTokenOut,
          type: "scatter",
          mode: "lines",
          legendgroup: "Baseline",
          name: "Baseline",
          hovertemplate: initialAmountsAnalysisTokenIn.map(
            (amount, index) =>
              `Swap ${amount.toFixed(2)} ${
                tokensSymbol[indexAnalysisToken]
              } for ${
                tokensSymbol[indexCurrentTabToken]
              } causes a Price Impact of ${initialImpactTabTokenOut[
                index
              ].toFixed(2)}% ${tokensSymbol[indexCurrentTabToken]}/${
                tokensSymbol[indexAnalysisToken]
              } <extra></extra>`
          ),
        },
        {
          x: variantAmountsAnalysisTokenIn,
          y: variantImpactTabTokenOut,
          type: "scatter",
          mode: "lines",
          legendgroup: "Variant",
          name: "Variant",
          showlegend: false,
          hovertemplate: variantAmountsAnalysisTokenIn.map(
            (amount, index) =>
              `Swap ${amount.toFixed(2)} ${
                tokensSymbol[indexAnalysisToken]
              } for ${
                tokensSymbol[indexCurrentTabToken]
              } causes a Price Impact of ${variantImpactTabTokenOut[
                index
              ].toFixed(2)}% ${tokensSymbol[indexCurrentTabToken]}/${
                tokensSymbol[indexAnalysisToken]
              } <extra></extra>`
          ),
        },
        {
          x: initialAmountsAnalysisTokenOut,
          y: initialImpactTabTokenIn,
          type: "scatter",
          mode: "lines",
          legendgroup: "Baseline",
          name: "Baseline",
          showlegend: false,
          hovertemplate: initialAmountsAnalysisTokenOut.map(
            (amount, index) =>
              `Swap ${tokensSymbol[indexCurrentTabToken]} for ${(
                amount * -1
              ).toFixed(2)} ${
                tokensSymbol[indexAnalysisToken]
              } causes a Price Impact of ${initialImpactTabTokenIn[
                index
              ].toFixed(2)}% ${tokensSymbol[indexCurrentTabToken]}/${
                tokensSymbol[indexAnalysisToken]
              } <extra></extra>`
          ),
        },
        {
          x: variantAmountsAnalysisTokenOut,
          y: variantImpactTabTokenIn,
          type: "scatter",
          mode: "lines",
          legendgroup: "Variant",
          name: "Variant",
          hovertemplate: variantAmountsAnalysisTokenOut.map(
            (amount, index) =>
              `Swap ${tokensSymbol[indexCurrentTabToken]} for ${(
                amount * -1
              ).toFixed(2)} ${
                tokensSymbol[indexAnalysisToken]
              } causes a Price Impact of ${variantImpactTabTokenIn[
                index
              ].toFixed(2)}% ${tokensSymbol[indexCurrentTabToken]}/${
                tokensSymbol[indexAnalysisToken]
              } <extra></extra>`
          ),
        },
      ]}
      layout={{
        xaxis: {
          title: `Amount of ${tokensSymbol[indexAnalysisToken]}`,
        },
        yaxis: {
          title: `${tokensSymbol[indexCurrentTabToken]}/${tokensSymbol[indexAnalysisToken]} price impact (%)`,
        },
      }}
      className="w-full h-1/2"
    />
  );
}

function calculateAmounts({
  balance,
  start = 0.0001,
}: {
  balance?: number;
  start?: number;
}) {
  if (!balance) return [];
  const numberOfPoints = 20;
  const resizedBalance = balance * 0.5;

  const step = (resizedBalance - start) / (numberOfPoints - 1);

  return Array.from(
    { length: (resizedBalance - start) / step + 1 },
    (value, index) => start + index * step
  );
}
