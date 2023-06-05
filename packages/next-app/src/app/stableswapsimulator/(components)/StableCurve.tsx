"use client";

import { MetaStableMath } from "@balancer-pool-metadata/math/src";

import Plot from "#/components/Plot";
import { Spinner } from "#/components/Spinner";
import { useStableSwap } from "#/contexts/StableSwapContext";

export function StableCurve() {
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
  const calculateTokenAmounts = ({
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
      rates,
      balances,
      amp,
      decimals,
    });

    const amountsTabTokenOut = amountsIn.map(
      (amount) =>
        MetaStableMath.exactTokenInForTokenOut(
          MetaStableMath.numberToOldBigNumber({
            number: amount,
            decimals: decimals[indexIn],
          }),
          poolPairDataIn
        ).toNumber() * -1
    );

    const poolPairDataOut = MetaStableMath.preparePoolPairData({
      indexIn: indexOut,
      indexOut: indexIn,
      swapFee,
      rates,
      balances,
      amp,
      decimals,
    });

    const amountsTabTokenIn = amountsIn.map((amount) =>
      MetaStableMath.exactTokenInForTokenOut(
        MetaStableMath.numberToOldBigNumber({
          number: amount,
          decimals: decimals[indexIn],
        }),
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
    amountsOut: variantAmountsAnalysisTokenOut,
    amountsTabTokenOut: variantAmountTabTokenOut,
    amountsTabTokenIn: variantAmountTabTokenIn,
  } = calculateTokenAmounts({
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
      title="Swap Curve"
      toolTip="Considering a pair of tokens A and B. It indicates the quantity of token B that will be received when swapping a specific amount of token A"
      data={[
        {
          x: initialAmountsAnalysisTokenIn,
          y: initialAmountTabTokenOut,
          type: "scatter",
          mode: "lines",
          legendgroup: "Initial",
          name: "Initial",
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
          legendgroup: "Custom",
          name: "Custom",
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
          legendgroup: "Initial",
          name: "Initial",
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
          legendgroup: "Custom",
          name: "Custom",
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
        xaxis: {
          title: `Amount of ${tokensSymbol[indexAnalysisToken]}`,
        },
        yaxis: {
          title: `Amount of ${tokensSymbol[indexCurrentTabToken]}`,
        },
      }}
      className="w-full h-1/2"
    />
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
