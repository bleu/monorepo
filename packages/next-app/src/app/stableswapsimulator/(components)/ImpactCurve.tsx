"use client";

import { MetaStableMath } from "@balancer-pool-metadata/math/src";

import Plot from "#/components/Plot";
import { Spinner } from "#/components/Spinner";
import { useStableSwap } from "#/contexts/StableSwapContext";

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
    balance,
    swapFee,
    amp,
    indexIn,
    indexOut,
    balances,
    rates,
    decimals,
  }: {
    balance: number | undefined;
    swapFee: number;
    amp: number;
    indexIn: number;
    indexOut: number;
    balances: number[];
    rates: number[];
    decimals: number[];
  }) => {
    const amountsIn = calculateAmounts({ balance });

    const amountsOut = amountsIn.map((amount) => -1 * amount);

    const poolPairDataIn = MetaStableMath.preparePoolPairData({
      indexIn,
      indexOut,
      swapFee,
      balances,
      amp,
      rates,
      decimals,
    });

    const impactTabTokenOut = amountsIn.map(
      (amount) =>
        MetaStableMath.priceImpactForExactTokenInSwap(
          MetaStableMath.numberToOldBigNumber({
            number: amount,
            decimals: decimals[indexIn],
          }),
          poolPairDataIn
        ).toNumber() * 100
    );

    const poolPairDataOut = MetaStableMath.preparePoolPairData({
      indexIn: indexOut,
      indexOut: indexIn,
      swapFee,
      balances,
      amp,
      rates,
      decimals,
    });

    const impactTabTokenIn = amountsIn.map(
      (amount) =>
        MetaStableMath.priceImpactForExactTokenOutReversedSwap(
          MetaStableMath.numberToOldBigNumber({
            number: amount,
            decimals: decimals[indexIn],
          }),
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
    balance: initialData.tokens[indexAnalysisToken]?.balance,
    swapFee: initialData.swapFee,
    amp: initialData.ampFactor,
    indexIn: indexAnalysisToken,
    indexOut: indexCurrentTabToken,
    balances: initialData.tokens.map((token) => token.balance),
    rates: initialData.tokens.map((token) => token.rate),
    decimals: initialData.tokens.map((token) => token.decimal),
  });

  const {
    amountsIn: variantAmountsAnalysisTokenIn,
    impactTabTokenOut: variantImpactTabTokenOut,
    amountsOut: variantAmountsAnalysisTokenOut,
    impactTabTokenIn: variantImpactTabTokenIn,
  } = calculateTokenImpact({
    balance: customData?.tokens?.[indexAnalysisToken]?.balance,
    swapFee: customData?.swapFee ? customData.swapFee : initialData.swapFee,
    amp: customData?.ampFactor ? customData.ampFactor : initialData.ampFactor,
    indexIn: indexAnalysisToken,
    indexOut: indexCurrentTabToken,
    balances: customData.tokens.map((token) => token.balance),
    rates: customData.tokens.map((token) => token.rate),
    decimals: customData.tokens.map((token) => token.decimal),
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
          legendgroup: "Initial",
          name: "Initial",
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
          legendgroup: "Custom",
          name: "Custom",
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
          legendgroup: "Initial",
          name: "Initial",
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
          legendgroup: "Custom",
          name: "Custom",
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
