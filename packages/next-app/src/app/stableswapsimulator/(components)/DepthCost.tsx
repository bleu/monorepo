"use client";

import { bnum } from "@balancer-labs/sor";
import { MetaStableMath, StableMath } from "@balancer-pool-metadata/math/src";
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
      text: depthCostAmounts.baseline.in.map(
        (amount, i) =>
          `Swap ${amount} of ${tokenY?.symbol} for ${dataX[i]} to move the price ${dataX[i]}/${tokenY?.symbol} on -2%`
      ),
      textposition: "none" as const,
      hoverinfo: "text" as const,
    },
    {
      x: dataX,
      y: depthCostAmounts.variant.in,
      type: "bar" as PlotType,
      legendgroup: "Variant",
      name: "Variant",
      text: depthCostAmounts.baseline.in.map(
        (amount, i) =>
          `Swap ${amount} of ${tokenY?.symbol} for ${dataX[i]} to move the price ${dataX[i]}/${tokenY?.symbol} on -2%`
      ),
      textposition: "none" as const,
      hoverinfo: "text" as const,
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
      text: depthCostAmounts.baseline.in.map(
        (amount, i) =>
          `Swap ${dataX[i]} for ${amount} of ${tokenY?.symbol} to move the price ${dataX[i]}/${tokenY?.symbol} on +2%`
      ),
      textposition: "none" as const,
      hoverinfo: "text" as const,
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
      text: depthCostAmounts.baseline.in.map(
        (amount, i) =>
          `Swap ${dataX[i]} for ${amount} of ${tokenY?.symbol} to move the price ${dataX[i]}/${tokenY?.symbol} on +2%`
      ),
      textposition: "none" as const,
      hoverinfo: "text" as const,
    },
  ];

  const props = {
    data: data,
    layout: {
      title: "Depth Cost",
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
        title: `${tokenY?.symbol} amount in`,
        range: [0, maxDepthCostAmount],
        domain: [0, 0.9],
      },
      yaxis2: {
        ...defaultAxisLayout,
        title: `${tokenY?.symbol} amount out`,
        range: [0, maxDepthCostAmount],
        domain: [0, 0.9],
      },
      grid: { columns: 2, rows: 1, pattern: "independent" as const },
      annotations: [
        {
          text: "-2% Price impact",
          font: {
            size: 16,
          },
          showarrow: false,
          align: "center" as const,
          x: 0.15,
          y: 1,
          xref: "paper" as const,
          yref: "paper" as const,
        },
        {
          text: "+2% Price Impact",
          font: {
            size: 16,
          },
          showarrow: false,
          align: "center" as const,
          x: 0.84,
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

  const rateIn = bnum(data?.tokens[indexIn].rate);
  const rateOut = bnum(data?.tokens[indexOut].rate);

  const poolPairData = preparePoolPairData({
    indexIn: indexIn,
    indexOut: indexOut,
    swapFee: data?.swapFee,
    allBalances: data?.tokens?.map((token) => token.balance),
    amp: data?.ampFactor,
  });

  const currentSpotPriceFromStableMath = MetaStableMath.priceFromStableMath(
    StableMath._spotPrice(poolPairData),
    rateIn,
    rateOut
  );

  const newSpotPriceToStableMath = MetaStableMath.priceToStableMath(
    currentSpotPriceFromStableMath.times(bnum(1.02)),
    rateIn,
    rateOut
  );

  if (poolSide === "in") {
    return MetaStableMath.amountFromStableMath(
      StableMath._tokenInForExactSpotPriceAfterSwap(
        newSpotPriceToStableMath,
        poolPairData
      ),
      rateIn
    ).toNumber();
  }

  return MetaStableMath.amountFromStableMath(
    StableMath._tokenInForExactSpotPriceAfterSwap(
      newSpotPriceToStableMath,
      poolPairData
    ),
    rateIn
  ).toNumber();
}
