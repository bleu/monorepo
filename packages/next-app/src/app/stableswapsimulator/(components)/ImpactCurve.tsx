"use client";

import { StableMath } from "@balancer-pool-metadata/math/src";

import Plot from "#/components/Plot";
import { Spinner } from "#/components/Spinner";
import { useStableSwap } from "#/contexts/StableSwapContext";

export default function StableCurve() {
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

  const calculateTokenAmounts = ({
    balance,
    swapFee,
    amp,
    indexIn,
    indexOut,
  }: {
    balance: number | undefined;
    swapFee: number;
    amp: number;
    indexIn: number;
    indexOut: number;
  }) => {
    const amountsIn = calculateAmounts({ balance });

    const amountsOut = amountsIn.map((amount) => -1 * amount);

    const poolPairDataIn = preparePoolPairData({
      indexIn,
      indexOut,
      swapFee,
      allBalances: baselineData.tokens.map((token) => token.balance),
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
      allBalances: baselineData.tokens.map((token) => token.balance),
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
  } = calculateTokenAmounts({
    balance: baselineData.tokens[indexAnalysisToken]?.balance,
    swapFee: baselineData.swapFee,
    amp: baselineData.ampFactor,
    indexIn: indexAnalysisToken,
    indexOut: indexCurrentTabToken,
  });

  const {
    amountsIn: variantAmountsAnalysisTokenIn,
    impactTabTokenOut: variantImpactTabTokenOut,
    amountsOut: variantAmountsAnalysisTokenOut,
    impactTabTokenIn: variantImpactTabTokenIn,
  } = calculateTokenAmounts({
    balance: variantData?.tokens?.[indexAnalysisToken]?.balance,
    swapFee: variantData?.swapFee ? variantData.swapFee : baselineData.swapFee,
    amp: variantData?.ampFactor
      ? variantData.ampFactor
      : baselineData.ampFactor,
    indexIn: indexAnalysisToken,
    indexOut: indexCurrentTabToken,
  });

  return (
    <div className="text-white">
      <Plot
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
          title: "<b> Impact Curve </b>",
          xaxis: {
            title: `Amount of ${tokensSymbol[indexAnalysisToken]}`,
          },
          yaxis: {
            title: `${tokensSymbol[indexCurrentTabToken]}/${tokensSymbol[indexAnalysisToken]} price impact (%)`,
          },
        }}
        className="w-full h-1/2"
      />
    </div>
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
