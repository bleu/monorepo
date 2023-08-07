"use client";

import { MetaStableMath } from "@bleu-balancer-tools/math-stableswapsimulator/src";
import { type PlotType } from "plotly.js";

import Plot from "#/components/Plot";
import { Spinner } from "#/components/Spinner";
import { useStableSwap } from "#/contexts/StableSwapContext";
import { formatNumber } from "#/utils/formatNumber";

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
    });
    const amountsTabTokenIn = calculateCurvePoints({
      balance: balances[indexOut],
    });

    const poolPairDataIn = MetaStableMath.preparePoolPairData({
      indexIn,
      indexOut,
      swapFee,
      rates,
      balances,
      amp,
      decimals,
    });

    const amountsTabTokenOut = amountsAnalysisTokenIn.map(
      (amount) =>
        MetaStableMath.exactTokenInForTokenOut(
          MetaStableMath.numberToOldBigNumber(amount),
          poolPairDataIn,
        ).toNumber() * -1,
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

    const amountsAnalysisTokenOut = amountsTabTokenIn.map(
      (amount) =>
        MetaStableMath.exactTokenInForTokenOut(
          MetaStableMath.numberToOldBigNumber(amount),
          poolPairDataOut,
        ).toNumber() * -1,
    );

    return {
      amountsAnalysisTokenIn,
      amountsAnalysisTokenOut,
      amountsTabTokenOut,
      amountsTabTokenIn,
    };
  };

  const {
    amountsAnalysisTokenIn: initialAmountsAnalysisTokenIn,
    amountsAnalysisTokenOut: initialAmountsAnalysisTokenOut,
    amountsTabTokenOut: initialAmountTabTokenOut,
    amountsTabTokenIn: initialAmountTabTokenIn,
  } = calculateTokenAmounts({
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
    amountsAnalysisTokenOut: variantAmountsAnalysisTokenOut,
    amountsTabTokenOut: variantAmountTabTokenOut,
    amountsTabTokenIn: variantAmountTabTokenIn,
  } = calculateTokenAmounts({
    swapFee: customData?.swapFee ? customData.swapFee : initialData.swapFee,
    amp: customData?.ampFactor ? customData.ampFactor : initialData.ampFactor,
    indexIn: indexAnalysisToken,
    indexOut: indexCurrentTabToken,
    balances: customData.tokens.map((token) => token.balance),
    rates: customData.tokens.map((token) => token.rate),
    decimals: customData.tokens.map((token) => token.decimal),
  });

  const formatSwap = (
    amountIn: number,
    tokenIn: string,
    amountOut: number,
    tokenOut: string,
  ) => {
    const formattedAmountIn = formatNumber(amountIn, 2);
    const formattedAmountOut = formatNumber(amountOut, 2);
    return `Swap ${formattedAmountIn} ${tokenIn} for ${formattedAmountOut} ${tokenOut} <extra></extra>`;
  };

  const createDataObject = (
    x: number[],
    y: number[],
    legendGroup: string,
    name: string,
    showlegend = true,
    hovertemplate: string[],
  ) => {
    return {
      x,
      y,
      type: "scatter" as PlotType,
      legendgroup: legendGroup,
      name,
      showlegend,
      hovertemplate,
    };
  };

  const data = [
    createDataObject(
      initialAmountsAnalysisTokenIn,
      initialAmountTabTokenOut,
      "Initial",
      "Initial",
      true,
      initialAmountsAnalysisTokenIn.map((amount, index) =>
        formatSwap(
          amount,
          tokensSymbol[indexAnalysisToken],
          -initialAmountTabTokenOut[index],
          tokensSymbol[indexCurrentTabToken],
        ),
      ),
    ),
    createDataObject(
      variantAmountsAnalysisTokenIn,
      variantAmountTabTokenOut,
      "Custom",
      "Custom",
      true,
      variantAmountsAnalysisTokenIn.map((amount, index) =>
        formatSwap(
          amount,
          tokensSymbol[indexAnalysisToken],
          -variantAmountTabTokenOut[index],
          tokensSymbol[indexCurrentTabToken],
        ),
      ),
    ),
    createDataObject(
      initialAmountsAnalysisTokenOut,
      initialAmountTabTokenIn,
      "Initial",
      "Initial",
      false,
      initialAmountsAnalysisTokenOut.map((amount, index) =>
        formatSwap(
          initialAmountTabTokenIn[index],
          tokensSymbol[indexCurrentTabToken],
          -amount,
          tokensSymbol[indexAnalysisToken],
        ),
      ),
    ),
    createDataObject(
      variantAmountsAnalysisTokenOut,
      variantAmountTabTokenIn,
      "Custom",
      "Custom",
      false,
      variantAmountsAnalysisTokenOut.map((amount, index) =>
        formatSwap(
          variantAmountTabTokenIn[index],
          tokensSymbol[indexCurrentTabToken],
          -amount,
          tokensSymbol[indexAnalysisToken],
        ),
      ),
    ),
  ];

  return (
    <Plot
      title="Swap Curve"
      toolTip="It indicates the quantity of token that will be received when swapping a specific amount of another token. The amount sign is based on the pool point of view."
      data={data}
      layout={{
        xaxis: {
          title: `Amount of ${tokensSymbol[indexAnalysisToken]}`,
          range: [
            initialAmountsAnalysisTokenOut[100],
            initialAmountsAnalysisTokenIn[100],
          ],
        },
        yaxis: {
          title: `Amount of ${tokensSymbol[indexCurrentTabToken]}`,
          range: [initialAmountTabTokenOut[100], initialAmountTabTokenIn[100]],
        },
      }}
      className="h-1/2 w-full"
    />
  );
}

export function calculateCurvePoints({
  balance,
  start = 0,
}: {
  balance?: number;
  start?: number;
}) {
  if (!balance || typeof start == "undefined") return [];
  const numberOfPoints = 100;
  const initialValue = balance * 0.001;
  const stepRatio = Math.pow(balance / initialValue, 1 / (numberOfPoints - 1));

  return [
    start,
    ...Array.from(
      { length: numberOfPoints + 20 },
      (_, index) => initialValue * stepRatio ** index,
    ),
  ];
}
