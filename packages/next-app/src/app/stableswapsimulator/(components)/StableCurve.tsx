"use client";

import { MetaStableMath } from "@balancer-pool-metadata/math/src";

import Plot from "#/components/Plot";
import { Spinner } from "#/components/Spinner";
import { useStableSwap } from "#/contexts/StableSwapContext";

export default function StableCurve() {
  const {
    baselineData,
    variantData,
    indexAnalysisToken,
    indexCurrentTabToken,
  } = useStableSwap();

  if (
    !baselineData ||
    !baselineData.swapFee ||
    !baselineData.ampFactor ||
    !baselineData.tokens
  )
    return <Spinner />;

  const tokensSymbol = baselineData.tokens.map((token) => token.symbol);

  const calculateTokenAmounts = (
    balance: number | undefined,
    swapFee: number,
    amp: number,
    indexIn: number,
    indexOut: number
  ) => {
    const amountsIn = calculateAmounts({ balance });

    const amountsOut = amountsIn.map((amount) => -1 * amount);

    const poolPairDataIn = MetaStableMath.preparePoolPairData({
      indexIn,
      indexOut,
      swapFee,
      balances: baselineData.tokens.map((token) => token.balance),
      rates: baselineData.tokens.map((token) => token.rate),
      amp,
    });

    const amountsTabTokenOut = amountsIn.map(
      (amount) =>
        MetaStableMath.exactTokenInForTokenOut(
          MetaStableMath.numberToOldBigNumber(amount),
          poolPairDataIn
        ).toNumber() * -1
    );

    const poolPairDataOut = MetaStableMath.preparePoolPairData({
      indexIn: indexOut,
      indexOut: indexIn,
      swapFee,
      balances: baselineData.tokens.map((token) => token.balance),
      rates: baselineData.tokens.map((token) => token.rate),
      amp,
    });

    const amountsTabTokenIn = amountsIn.map((amount) =>
      MetaStableMath.exactTokenInForTokenOut(
        MetaStableMath.numberToOldBigNumber(amount),
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
  } = calculateTokenAmounts(
    baselineData.tokens[indexAnalysisToken]?.balance,
    baselineData.swapFee,
    baselineData.ampFactor,
    indexAnalysisToken,
    indexCurrentTabToken
  );

  const {
    amountsIn: variantAmountsAnalysisTokenIn,
    amountsOut: variantAmountsAnalysisTokenOut,
    amountsTabTokenOut: variantAmountTabTokenOut,
    amountsTabTokenIn: variantAmountTabTokenIn,
  } = calculateTokenAmounts(
    variantData?.tokens?.[indexAnalysisToken]?.balance,
    variantData?.swapFee ? variantData.swapFee : baselineData.swapFee,
    variantData?.ampFactor ? variantData.ampFactor : baselineData.ampFactor,
    indexAnalysisToken,
    indexCurrentTabToken
  );

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
  const step = (balance - start) / (numberOfPoints - 1);

  return Array.from(
    { length: (balance - start) / step + 1 },
    (value, index) => start + index * step
  );
}
