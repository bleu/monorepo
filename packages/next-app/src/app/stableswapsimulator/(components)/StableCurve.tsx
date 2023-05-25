"use client";

import { StableMath } from "@balancer-pool-metadata/math/src";
import { blueDarkA, grayDarkA } from "@radix-ui/colors";
import { useState } from "react";
import Plot from "react-plotly.js";

import { Spinner } from "#/components/Spinner";
import { useStableSwap } from "#/contexts/StableSwapContext";

export default function StableCurve() {
  const {
    baselineData,
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

  const initialAmountsAnalysisTokenIn = calculateAmounts({
    balance: baselineData?.tokens?.[indexAnalysisToken]?.balance,
  });

  const initialAmountsAnalysisTokenOut = initialAmountsAnalysisTokenIn.map(
    (amount) => -1 * amount //This is being multiplied by -1 because it is the OUT part of the trade
  );

  const initialPoolPairDataAnalysisIn = preparePoolPairData({
    indexIn: indexAnalysisToken,
    indexOut: indexCurrentTabToken,
    swapFee: baselineData?.swapFee,
    allBalances: baselineData?.tokens?.map((token) => token.balance),
    amp: baselineData?.ampFactor,
  });

  const initialAmountTabTokenOut = initialAmountsAnalysisTokenIn.map(
    (amount) => {
      return (
        StableMath._exactTokenInForTokenOut(
          numberToOldBigNumber(amount),
          initialPoolPairDataAnalysisIn
        ).toNumber() * -1 //This is being multiplied by -1 because it is the OUT part of the trade
      );
    }
  );

  const initialPoolPairDataAnalysisOut = preparePoolPairData({
    indexIn: indexCurrentTabToken,
    indexOut: indexAnalysisToken,
    swapFee: baselineData?.swapFee,
    allBalances: baselineData?.tokens?.map((token) => token.balance),
    amp: baselineData?.ampFactor,
  });

  const initialAmountTabTokenIn = initialAmountsAnalysisTokenIn.map(
    (amount) => {
      return StableMath._exactTokenInForTokenOut(
        numberToOldBigNumber(amount),
        initialPoolPairDataAnalysisOut
      ).toNumber();
    }
  );

  const initialPoolPairDataAnalysis = [
    ...initialAmountsAnalysisTokenIn,
    ...initialAmountsAnalysisTokenOut,
  ];

  const initialAmountTabToken = [
    ...initialAmountTabTokenOut,
    ...initialAmountTabTokenIn,
  ];

  return (
    <div className="text-white">
      <Plot
        data={[
          {
            x: initialPoolPairDataAnalysis,
            y: initialAmountTabToken,
            type: "scatter",
            mode: "lines",
            marker: { color: blueDarkA.blueA9 },
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
            gridcolor: grayDarkA.grayA10,
            linecolor: grayDarkA.grayA12,
            linewidth: 0.5,
            automargin: true,
            zerolinecolor: grayDarkA.grayA10,
          },
          yaxis: {
            title: `Amount of ${tokensSymbol[indexCurrentTabToken]}`,
            gridcolor: grayDarkA.grayA10,
            linecolor: grayDarkA.grayA12,
            linewidth: 0.5,
            automargin: true,
            zerolinecolor: grayDarkA.grayA10,
          },
          modebar: {
            bgcolor: blueDarkA.blueA1,
            color: grayDarkA.grayA12,
            activecolor: grayDarkA.grayA12,
          },
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
