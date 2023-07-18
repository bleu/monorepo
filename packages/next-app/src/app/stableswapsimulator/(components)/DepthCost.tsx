"use client";

import { bnum } from "@balancer-labs/sor";
import { MetaStableMath } from "@bleu-balancer-tools/math/src";
import { PlotType } from "plotly.js";

import Plot, { defaultAxisLayout } from "#/components/Plot";
import { Spinner } from "#/components/Spinner";
import { AnalysisData, useStableSwap } from "#/contexts/StableSwapContext";
import { formatNumber } from "#/utils/formatNumber";

const createHoverTemplate = (
  direction: "in" | "out",
  amounts: number[],
  analysisSymbol: string | undefined,
  tokenSymbols: string[],
  templateDirection: string
): string[] => {
  return amounts.map((amount, i) => {
    const displayAmount = `${formatNumber(amount, 2)} ${analysisSymbol}`;
    const action =
      direction === "in"
        ? `${displayAmount} for ${tokenSymbols[i]}`
        : `${tokenSymbols[i]} for ${displayAmount}`;

    return `Swap ${action} to move the price ${tokenSymbols[i]}/${analysisSymbol} on ${templateDirection} <extra></extra>`;
  });
};

const createDataObject = (
  x: string[],
  y: number[],
  legendgroup: string,
  name: string,
  isLegendShown: boolean,
  direction: "in" | "out",
  analysisSymbol: string | undefined,
  hovertemplateData: number[],
  yAxis = "",
  xAxis = ""
) => {
  const templateDirection = direction === "in" ? "-2%" : "+2%";

  return {
    x,
    y,
    type: "bar" as PlotType,
    legendgroup,
    legendgrouptitle: { text: legendgroup },
    name,
    showlegend: isLegendShown,
    yaxis: yAxis,
    xaxis: xAxis,
    hovertemplate: createHoverTemplate(
      direction,
      hovertemplateData,
      analysisSymbol,
      x,
      templateDirection
    ),
  };
};

export function DepthCost() {
  const { indexAnalysisToken, initialData, customData } = useStableSwap();
  if (
    !initialData.swapFee ||
    !initialData.ampFactor ||
    !customData.ampFactor ||
    !customData.swapFee
  )
    return <Spinner />;

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
    createDataObject(
      dataX,
      depthCostAmounts.initial.in,
      "Initial",
      "Initial",
      true,
      "in",
      analysisToken?.symbol,
      depthCostAmounts.initial.in
    ),
    createDataObject(
      dataX,
      depthCostAmounts.custom.in,
      "Custom",
      "Custom",
      true,
      "in",
      analysisToken?.symbol,
      depthCostAmounts.custom.in
    ),
    createDataObject(
      dataX,
      depthCostAmounts.initial.out,
      "Initial",
      "Initial",
      false,
      "out",
      analysisToken?.symbol,
      depthCostAmounts.initial.out,
      "y2",
      "x2"
    ),
    createDataObject(
      dataX,
      depthCostAmounts.custom.out,
      "Custom",
      "Custom",
      false,
      "out",
      analysisToken?.symbol,
      depthCostAmounts.custom.out,
      "y2",
      "x2"
    ),
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
  if (!data.swapFee || !data.ampFactor) return 0;

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
