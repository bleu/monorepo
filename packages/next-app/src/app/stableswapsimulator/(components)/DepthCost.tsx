"use client";

import { bnum } from "@balancer-labs/sor";
import { MetaStableMath } from "@bleu-balancer-tools/math/src";
import { PlotType } from "plotly.js";

import Plot, { defaultAxisLayout } from "#/components/Plot";
import { Spinner } from "#/components/Spinner";
import { AnalysisData, useStableSwap } from "#/contexts/StableSwapContext";

export function DepthCost() {
  const { indexAnalysisToken, initialData, customData } = useStableSwap();

  const analysisToken = initialData?.tokens[indexAnalysisToken];
  const pairTokens = initialData?.tokens.filter(
    (token) => token.symbol !== analysisToken.symbol
  );
  const pairTokensIndexes = pairTokens.map((token) =>
    initialData?.tokens.indexOf(token)
  );

  const depthCostAmounts = {
    initial: {
      in: pairTokensIndexes.map((pairTokenIndex) =>
        calculateDepthCostAmount(pairTokenIndex, initialData, "in")
      ),
      out: pairTokensIndexes.map((pairTokenIndex) =>
        calculateDepthCostAmount(pairTokenIndex, initialData, "out")
      ),
    },
    custom: {
      in: pairTokensIndexes.map((pairTokenIndex) =>
        calculateDepthCostAmount(pairTokenIndex, customData, "in")
      ),
      out: pairTokensIndexes.map((pairTokenIndex) =>
        calculateDepthCostAmount(pairTokenIndex, customData, "out")
      ),
    },
  };

  const maxDepthCostAmount = Math.max(
    ...depthCostAmounts.initial.in,
    ...depthCostAmounts.initial.out,
    ...depthCostAmounts.custom.in,
    ...depthCostAmounts.custom.out
  );

  if (!maxDepthCostAmount) return <Spinner />;

  const dataX = pairTokens.map((token) => token.symbol);

  const data = [
    {
      x: dataX,
      y: depthCostAmounts.initial.in,
      type: "bar" as PlotType,
      legendgroup: "Initial",
      name: "Initial",
      hovertemplate: depthCostAmounts.initial.in.map(
        (amount, i) =>
          `Swap ${amount.toFixed()} ${analysisToken?.symbol} for ${
            dataX[i]
          } to move the price ${dataX[i]}/${
            analysisToken?.symbol
          } on -2% <extra></extra>`
      ),
    },
    {
      x: dataX,
      y: depthCostAmounts.custom.in,
      type: "bar" as PlotType,
      legendgroup: "Custom",
      name: "Custom",
      hovertemplate: depthCostAmounts.custom.in.map(
        (amount, i) =>
          `Swap ${amount.toFixed()} ${analysisToken?.symbol} for ${
            dataX[i]
          } to move the price ${dataX[i]}/${
            analysisToken?.symbol
          } on -2% <extra></extra>`
      ),
    },
    {
      x: dataX,
      y: depthCostAmounts.initial.out,
      type: "bar" as PlotType,
      legendgroup: "Initial",
      name: "Initial",
      showlegend: false,
      yaxis: "y2",
      xaxis: "x2",
      hovertemplate: depthCostAmounts.initial.out.map(
        (amount, i) =>
          `Swap ${dataX[i]} for ${amount.toFixed()} ${
            analysisToken?.symbol
          } to move the price ${dataX[i]}/${
            analysisToken?.symbol
          } on +2% <extra></extra>`
      ),
    },
    {
      x: dataX,
      y: depthCostAmounts.custom.out,
      type: "bar" as PlotType,
      legendgroup: "Custom",
      name: "Custom",
      showlegend: false,
      yaxis: "y2",
      xaxis: "x2",
      hovertemplate: depthCostAmounts.custom.out.map(
        (amount, i) =>
          `Swap ${dataX[i]} for ${amount.toFixed()} ${
            analysisToken?.symbol
          } to move the price ${dataX[i]}/${
            analysisToken?.symbol
          } on +2% <extra></extra>`
      ),
    },
  ];

  const props = {
    data: data,
    title: "Depth cost (-/+ 2% of price change)",
    toolTip:
      "Indicates the amount of tokens needed on a swap to alter the spot price (rate between the price of both tokens) to -2% and +2%",
    layout: {
      margin: { l: 3, r: 3 },
      xaxis: {
        tickmode: "array" as const,
        tickvals: dataX,
        ticktext: pairTokens.map((token) => token.symbol),
      },
      xaxis2: {
        ...defaultAxisLayout,
        tickmode: "array" as const,
        tickvals: dataX,
        ticktext: pairTokens.map((token) => token.symbol),
      },
      yaxis: {
        title: `${analysisToken?.symbol} in`,
        range: [0, maxDepthCostAmount],
      },
      yaxis2: {
        ...defaultAxisLayout,
        title: `${analysisToken?.symbol} out`,
        range: [0, maxDepthCostAmount],
      },
      grid: { columns: 2, rows: 1, pattern: "independent" as const },
    },

    config: { displayModeBar: false },
  };

  return <Plot {...props} />;
}

function calculateDepthCostAmount(
  pairTokenIndex: number,
  data: AnalysisData,
  poolSide: "in" | "out"
) {
  if (!data.swapFee || !data.ampFactor) return;

  const { indexAnalysisToken } = useStableSwap();

  const indexIn = poolSide === "in" ? indexAnalysisToken : pairTokenIndex;
  const indexOut = poolSide === "in" ? pairTokenIndex : indexAnalysisToken;

  const poolPairData = MetaStableMath.preparePoolPairData({
    indexIn: indexIn,
    indexOut: indexOut,
    swapFee: data?.swapFee,
    balances: data?.tokens?.map((token) => token.balance),
    rates: data?.tokens?.map((token) => token.rate),
    amp: data?.ampFactor,
    decimals: data?.tokens?.map((token) => token.decimal),
  });

  const currentSpotPriceFromStableMath = MetaStableMath.spotPrice(poolPairData);

  const newSpotPriceToStableMath = currentSpotPriceFromStableMath.times(
    bnum(1.02)
  );

  if (poolSide === "in") {
    return MetaStableMath.tokenInForExactSpotPriceAfterSwap(
      newSpotPriceToStableMath,
      poolPairData
    ).toNumber();
  }
  return MetaStableMath.tokenOutForExactSpotPriceAfterSwap(
    newSpotPriceToStableMath,
    poolPairData
  ).toNumber();
}
