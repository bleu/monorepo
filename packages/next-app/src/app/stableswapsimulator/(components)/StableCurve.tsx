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

    const amountsTabTokenOut = amountsIn.map(
      (amount) =>
        StableMath._exactTokenInForTokenOut(
          numberToOldBigNumber(amount),
          poolPairDataIn
        ).toNumber() * -1
    );

    const poolPairDataOut = preparePoolPairData({
      indexIn: indexOut,
      indexOut: indexIn,
      swapFee,
      allBalances: baselineData.tokens.map((token) => token.balance),
      amp,
    });

    const amountsTabTokenIn = amountsIn.map((amount) =>
      StableMath._exactTokenInForTokenOut(
        numberToOldBigNumber(amount),
        poolPairDataOut
      ).toNumber()
    );

    return {
      amountsIn,
      amountsOut,
      amountsTabTokenOut,
      amountsTabTokenIn,
    };
  };

  const {
    amountsIn: initialAmountsAnalysisTokenIn,
    amountsOut: initialAmountsAnalysisTokenOut,
    amountsTabTokenOut: initialAmountTabTokenOut,
    amountsTabTokenIn: initialAmountTabTokenIn,
  } = calculateTokenAmounts({
    balance: baselineData.tokens[indexAnalysisToken]?.balance,
    swapFee: baselineData.swapFee,
    amp: baselineData.ampFactor,
    indexIn: indexAnalysisToken,
    indexOut: indexCurrentTabToken,
  });

  const {
    amountsIn: variantAmountsAnalysisTokenIn,
    amountsOut: variantAmountsAnalysisTokenOut,
    amountsTabTokenOut: variantAmountTabTokenOut,
    amountsTabTokenIn: variantAmountTabTokenIn,
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
            y: initialAmountTabTokenOut,
            type: "scatter",
            mode: "lines",
            legendgroup: "Baseline",
            name: "Baseline",
            hovertemplate: initialAmountsAnalysisTokenIn.map(
              (amount, index) =>
                `Swap ${amount.toFixed(2)} ${
                  tokensSymbol[indexAnalysisToken]
                } for ${(initialAmountTabTokenOut[index] * -1).toFixed(2)} ${
                  tokensSymbol[indexCurrentTabToken]
                } <extra></extra>`
            ),
          },
          {
            x: variantAmountsAnalysisTokenIn,
            y: variantAmountTabTokenOut,
            type: "scatter",
            mode: "lines",
            legendgroup: "Variant",
            name: "Variant",
            hovertemplate: variantAmountsAnalysisTokenIn.map(
              (amount, index) =>
                `Swap ${amount.toFixed(2)} ${
                  tokensSymbol[indexAnalysisToken]
                } for ${(variantAmountTabTokenOut[index] * -1).toFixed(2)} ${
                  tokensSymbol[indexCurrentTabToken]
                } <extra></extra>`
            ),
          },
          {
            x: initialAmountsAnalysisTokenOut,
            y: initialAmountTabTokenIn,
            type: "scatter",
            mode: "lines",
            legendgroup: "Baseline",
            name: "Baseline",
            showlegend: false,
            hovertemplate: initialAmountsAnalysisTokenOut.map(
              (amount, index) =>
                `Swap ${initialAmountTabTokenIn[index].toFixed(2)} ${
                  tokensSymbol[indexCurrentTabToken]
                } for ${(amount * -1).toFixed(2)} ${
                  tokensSymbol[indexAnalysisToken]
                } <extra></extra>`
            ),
          },
          {
            x: variantAmountsAnalysisTokenOut,
            y: variantAmountTabTokenIn,
            type: "scatter",
            mode: "lines",
            legendgroup: "Variant",
            name: "Variant",
            showlegend: false,
            hovertemplate: variantAmountsAnalysisTokenOut.map(
              (amount, index) =>
                `Swap ${variantAmountTabTokenIn[index].toFixed(2)} ${
                  tokensSymbol[indexCurrentTabToken]
                } for ${(amount * -1).toFixed(2)} ${
                  tokensSymbol[indexAnalysisToken]
                } <extra></extra>`
            ),
          },
        ]}
        layout={{
          title: "<b> Swap Curve </b>",
          xaxis: {
            title: `Amount of ${tokensSymbol[indexAnalysisToken]}`,
          },
          yaxis: {
            title: `Amount of ${tokensSymbol[indexCurrentTabToken]}`,
          },
        }}
        className="w-full h-1/2"
      />
    </div>
  );
}

function calculateAmounts({
  balance,
  start = 0,
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
