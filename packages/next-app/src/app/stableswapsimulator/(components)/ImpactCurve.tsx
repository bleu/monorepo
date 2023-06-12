"use client";

import { MetaStableMath } from "@balancer-pool-metadata/math/src";

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
    const amountsAnalysisTokenIn = calculateCurvePoints({
      balance: balances[indexIn],
      start: 0.001,
    });
    const amountsTabTokenIn = calculateCurvePoints({
      balance: balances[indexOut],
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

    const impactAnalysisTokenIn = amountsAnalysisTokenIn.map(
      (amount) =>
        MetaStableMath.priceImpactForExactTokenInSwap(
          MetaStableMath.numberToOldBigNumber(amount),
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

    const amountsAnalysisTokenOut = amountsTabTokenIn.map(
      (amount) =>
        MetaStableMath.exactTokenInForTokenOut(
          MetaStableMath.numberToOldBigNumber(amount),
          poolPairDataOut
        ).toNumber() * -1
    );

    const impactAnalysisTokenOut = amountsTabTokenIn.map(
      (amount) =>
        MetaStableMath.priceImpactForExactTokenInReversedSwap(
          MetaStableMath.numberToOldBigNumber(amount),
          poolPairDataOut
        ).toNumber() * 100
    );

    return {
      amountsAnalysisTokenIn,
      amountsAnalysisTokenOut,
      impactAnalysisTokenIn,
      impactAnalysisTokenOut,
    };
  };

  const {
    amountsAnalysisTokenIn: initialAmountsAnalysisTokenIn,
    impactAnalysisTokenIn: initialImpactAnalysisTokenIn,
    amountsAnalysisTokenOut: initialAmountsAnalysisTokenOut,
    impactAnalysisTokenOut: initialImpactAnalysisTokenOut,
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
    amountsAnalysisTokenIn: variantAmountsAnalysisTokenIn,
    impactAnalysisTokenIn: variantImpactAnalysisTokenIn,
    amountsAnalysisTokenOut: variantAmountsAnalysisTokenOut,
    impactAnalysisTokenOut: variantImpactAnalysisTokenOut,
  } = calculateTokenImpact({
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
      toolTip="Indicates how much the swapping of a particular amount of token effects on the Price Impact (rate between the price of both tokens). The sign is based on the pool point of view."
      data={[
        {
          x: initialAmountsAnalysisTokenIn,
          y: initialImpactAnalysisTokenIn,
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
          name: "Custom",
          showlegend: false,
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
          x: initialAmountsAnalysisTokenOut,
          y: initialImpactAnalysisTokenOut,
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
              } causes a Price Impact of ${initialImpactAnalysisTokenOut[
                index
              ].toFixed(2)}% ${tokensSymbol[indexCurrentTabToken]}/${
                tokensSymbol[indexAnalysisToken]
              } <extra></extra>`
          ),
        },
        {
          x: variantAmountsAnalysisTokenOut,
          y: variantImpactAnalysisTokenOut,
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
              } causes a Price Impact of ${variantImpactAnalysisTokenOut[
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
          range: [
            initialAmountsAnalysisTokenOut[100],
            initialAmountsAnalysisTokenIn[100],
          ],
        },
        yaxis: {
          title: `${tokensSymbol[indexCurrentTabToken]}/${tokensSymbol[indexAnalysisToken]} price impact (%)`,
          range: [
            initialImpactAnalysisTokenOut[100],
            initialImpactAnalysisTokenIn[100],
          ],
        },
      }}
      className="w-full h-1/2"
    />
  );
}
