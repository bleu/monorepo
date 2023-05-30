"use client";

import { bnum } from "@balancer-labs/sor";
import { StableMath } from "@balancer-pool-metadata/math/src";
import { PlotType } from "plotly.js";

import Plot, { defaultAxisLayout } from "#/components/Plot";
import { AnalysisData, useStableSwap } from "#/contexts/StableSwapContext";

export default function DepthCost() {
  const { indexAnalysisToken, baselineData, variantData } = useStableSwap();

  const tokenY = baselineData?.tokens[indexAnalysisToken];
  const tokensX = baselineData?.tokens.filter(
    (token) => token.symbol !== tokenY.symbol
  );
  const indexesX = tokensX.map((token) => baselineData?.tokens.indexOf(token));

  const depthCostAmounts = {
    baseline: {
      in: indexesX.map((indexX) =>
        calculateDepthCostAmount(indexX, baselineData, "in")
      ),
      out: indexesX.map((indexX) =>
        calculateDepthCostAmount(indexX, baselineData, "out")
      ),
    },
    variant: {
      in: indexesX.map((indexX) =>
        calculateDepthCostAmount(indexX, variantData, "in")
      ),
      out: indexesX.map((indexX) =>
        calculateDepthCostAmount(indexX, variantData, "out")
      ),
    },
  };

  const maxDepthCostAmount = Math.max(
    ...depthCostAmounts.baseline.in,
    ...depthCostAmounts.baseline.out,
    ...depthCostAmounts.variant.in,
    ...depthCostAmounts.variant.out
  );

  const dataX = tokensX.map((token) => token.symbol);

  const data = [
    {
      x: dataX,
      y: depthCostAmounts.baseline.in,
      type: "bar" as PlotType,
      legendgroup: "Baseline",
      name: "Baseline",
      hovertemplate: depthCostAmounts.baseline.in.map(
        (amount, i) =>
          `Swap ${amount.toFixed()} of ${tokenY?.symbol} for ${
            dataX[i]
          } to move the price ${dataX[i]}/${tokenY?.symbol} on -2%`
      ),
    },
    {
      x: dataX,
      y: depthCostAmounts.variant.in,
      type: "bar" as PlotType,
      legendgroup: "Variant",
      name: "Variant",
      hovertemplate: depthCostAmounts.baseline.in.map(
        (amount, i) =>
          `Swap ${amount.toFixed()} of ${tokenY?.symbol} for ${
            dataX[i]
          } to move the price ${dataX[i]}/${tokenY?.symbol} on -2%`
      ),
    },
    {
      x: dataX,
      y: depthCostAmounts.baseline.out,
      type: "bar" as PlotType,
      legendgroup: "Baseline",
      name: "Baseline",
      showlegend: false,
      yaxis: "y2",
      xaxis: "x2",
      hovertemplate: depthCostAmounts.baseline.in.map(
        (amount, i) =>
          `Swap ${dataX[i]} for ${amount.toFixed()} of ${
            tokenY?.symbol
          } to move the price ${dataX[i]}/${tokenY?.symbol} on +2%`
      ),
    },
    {
      x: dataX,
      y: depthCostAmounts.variant.out,
      type: "bar" as PlotType,
      legendgroup: "Variant",
      name: "Variant",
      showlegend: false,
      yaxis: "y2",
      xaxis: "x2",
      hovertemplate: depthCostAmounts.baseline.in.map(
        (amount, i) =>
          `Swap ${dataX[i]} for ${amount.toFixed()} of ${
            tokenY?.symbol
          } to move the price ${dataX[i]}/${tokenY?.symbol} on +2%`
      ),
    },
  ];

  const props = {
    className: "h-full w-2/3",
    data: data,
    layout: {
      margin: {
        l: 10,
        r: 10,
        b: 10,
        t: 10,
      },
      xaxis: {
        tickmode: "array" as const,
        tickvals: dataX,
        ticktext: tokensX.map((token) => token.symbol),
      },
      xaxis2: {
        ...defaultAxisLayout,
        tickmode: "array" as const,
        tickvals: dataX,
        ticktext: tokensX.map((token) => token.symbol),
      },
      yaxis: {
        title: `${tokenY?.symbol} in`,
        range: [0, maxDepthCostAmount],
        domain: [0, 0.85],
      },
      yaxis2: {
        ...defaultAxisLayout,
        title: `${tokenY?.symbol} out`,
        range: [0, maxDepthCostAmount],
        domain: [0, 0.85],
      },
      grid: { columns: 2, rows: 1, pattern: "independent" as const },
      annotations: [
        // subplot titles, manually centered is needed
        {
          text: "-2% Depth Cost",
          font: {
            size: 16,
          },
          showarrow: false,
          align: "center" as const,
          x: 0.11,
          y: 1,
          xref: "paper" as const,
          yref: "paper" as const,
        },
        {
          text: "+2% Depth Cost",
          font: {
            size: 16,
          },
          showarrow: false,
          align: "center" as const,
          x: 0.89,
          y: 1,
          xref: "paper" as const,
          yref: "paper" as const,
        },
      ],
    },

    config: { displayModeBar: false },
  };

  return <Plot {...props} />;
}

function calculateDepthCostAmount(
  indexX: number,
  data: AnalysisData,
  poolSide: "in" | "out"
) {
  if (!data.swapFee || !data.ampFactor) return;

  const { preparePoolPairData, indexAnalysisToken } = useStableSwap();

  const indexIn = poolSide === "in" ? indexAnalysisToken : indexX;
  const indexOut = poolSide === "in" ? indexX : indexAnalysisToken;

  const poolPairData = preparePoolPairData({
    indexIn: indexIn,
    indexOut: indexOut,
    swapFee: data?.swapFee,
    allBalances: data?.tokens?.map((token) => token.balance),
    amp: data?.ampFactor,
  });

  const currentSpotPriceFromStableMath = StableMath._spotPrice(poolPairData);

  const newSpotPriceToStableMath = currentSpotPriceFromStableMath.times(
    bnum(1.02)
  );

  if (poolSide === "in") {
    StableMath._tokenInForExactSpotPriceAfterSwap(
      newSpotPriceToStableMath,
      poolPairData
    ).toNumber();
  }

  return StableMath._tokenInForExactSpotPriceAfterSwap(
    newSpotPriceToStableMath,
    poolPairData
  ).toNumber();
}
