"use client";

import { StableMath } from "@balancer-pool-metadata/math/src";
import { amberDarkA, blueDarkA, grayDarkA } from "@radix-ui/colors";
import { useState } from "react";

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

  const [hoverInfo, setHoverInfo] = useState<string>();

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
            marker: { color: blueDarkA.blueA9 },
            hovertemplate: hoverInfo,
          },
          {
            x: initialAmountsAnalysisTokenOut,
            y: initialAmountTabTokenIn,
            type: "scatter",
            mode: "lines",
            marker: { color: blueDarkA.blueA9 },
            hovertemplate: hoverInfo,
          },
          {
            x: variantAmountsAnalysisTokenIn,
            y: variantAmountTabTokenOut,
            type: "scatter",
            mode: "lines",
            marker: { color: amberDarkA.amberA9 },
            hovertemplate: hoverInfo,
          },
          {
            x: variantAmountsAnalysisTokenOut,
            y: variantAmountTabTokenIn,
            type: "scatter",
            mode: "lines",
            marker: { color: amberDarkA.amberA9 },
            hovertemplate: hoverInfo,
          },
        ]}
        layout={{
          title: "<b> Swap Curve </b>",
          plot_bgcolor: blueDarkA.blueA1,
          paper_bgcolor: blueDarkA.blueA1,
          font: {
            color: grayDarkA.grayA12,
            family: "Inter",
          },
          xaxis: {
            title: `Amount of ${tokensSymbol[indexAnalysisToken]}`,
          },
          yaxis: {
            title: `Amount of ${tokensSymbol[indexCurrentTabToken]}`,
          },
          showlegend: false,
        }}
        className="w-full h-1/2"
        useResizeHandler={true}
        onHover={(eventData) => {
          const hoverData = eventData.points[0];
          const yValue = hoverData.y?.valueOf() as number;
          const xValue = hoverData.x?.valueOf() as number;

          if (yValue < 0)
            setHoverInfo(
              `Swap ${xValue.toFixed(2)} ${
                tokensSymbol[indexAnalysisToken]
              } for ${Math.abs(yValue).toFixed(2)} ${
                tokensSymbol[indexCurrentTabToken]
              } <extra></extra>`
            );
          else {
            setHoverInfo(
              `Swap ${yValue.toFixed(2)} ${
                tokensSymbol[indexCurrentTabToken]
              } for ${Math.abs(xValue).toFixed(2)} ${
                tokensSymbol[indexAnalysisToken]
              } <extra></extra>`
            );
          }
        }}
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
