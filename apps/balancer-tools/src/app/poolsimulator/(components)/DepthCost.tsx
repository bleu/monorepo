"use client";

import { AMM } from "@bleu-balancer-tools/math-poolsimulator/src";
import { PlotType } from "plotly.js";

import Plot, { defaultAxisLayout } from "#/components/Plot";
import { Spinner } from "#/components/Spinner";
import {
  AnalysisData,
  PoolPairData,
  usePoolSimulator,
} from "#/contexts/PoolSimulatorContext";
import { formatNumber } from "#/utils/formatNumber";

import { PoolTypeEnum, TokensData } from "../(types)";

export function DepthCost() {
  const { analysisToken, initialData, customData, initialAMM, customAMM } =
    usePoolSimulator();

  if (!initialAMM || !customAMM) return <Spinner />;

  const pairTokens = initialData?.tokens.filter(
    (token) => token.symbol !== analysisToken.symbol,
  );

  const depthCostAmounts = {
    initial: {
      in: pairTokens.map((pairToken) =>
        calculateDepthCostAmount(
          pairToken,
          "in",
          initialData,
          initialAMM,
          initialData.poolType,
        ),
      ),
      out: pairTokens.map((pairToken) =>
        calculateDepthCostAmount(
          pairToken,
          "out",
          initialData,
          initialAMM,
          initialData.poolType,
        ),
      ),
    },
    custom: {
      in: pairTokens.map((pairToken) =>
        calculateDepthCostAmount(
          pairToken,
          "in",
          customData,
          customAMM,
          customData.poolType,
        ),
      ),
      out: pairTokens.map((pairToken) =>
        calculateDepthCostAmount(
          pairToken,
          "out",
          customData,
          customAMM,
          customData.poolType,
        ),
      ),
    },
  };

  const maxDepthCostAmount = Math.max(
    ...depthCostAmounts.initial.in,
    ...depthCostAmounts.initial.out,
    ...depthCostAmounts.custom.in,
    ...depthCostAmounts.custom.out,
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
      depthCostAmounts.initial.in,
    ),
    createDataObject(
      dataX,
      depthCostAmounts.custom.in,
      "Custom",
      "Custom",
      true,
      "in",
      analysisToken?.symbol,
      depthCostAmounts.custom.in,
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
      "x2",
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
      "x2",
    ),
  ];

  const props = {
    data: data,
    title: "Depth cost (2% of price change)",
    toolTip:
      "Indicates the amount of tokens needed on a swap to alter the spot price (rate between the price of both tokens) to the depth cost point. For stable pools, the depth cost point is 2% of the spot price. For concentrated liquidity pools is 99% of the liquidity range or 2% of the spot price, whichever is closer.",
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

const createHoverTemplate = (
  direction: "in" | "out",
  amounts: number[],
  analysisSymbol: string | undefined,
  tokenSymbols: string[],
): string[] => {
  return amounts.map((amount, i) => {
    const displayAmount = `${formatNumber(amount, 2)} ${analysisSymbol}`;
    const action =
      direction === "in"
        ? `${displayAmount} for ${tokenSymbols[i]}`
        : `${tokenSymbols[i]} for ${displayAmount}`;

    const price =
      direction === "in"
        ? `${analysisSymbol}/${tokenSymbols[i]}`
        : `${tokenSymbols[i]}/${analysisSymbol}`;

    return `Swap ${action} to move the price ${price} until the depth cost point <extra></extra>`;
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
  xAxis = "",
) => {
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
    ),
  };
};

function calculateDepthCostAmount(
  pairToken: TokensData,
  poolSide: "in" | "out",
  data: AnalysisData,
  amm: AMM<PoolPairData>,
  poolType: PoolTypeEnum,
) {
  const { analysisToken } = usePoolSimulator();

  const tokenIn = poolSide === "in" ? analysisToken : pairToken;
  const tokenOut = poolSide === "in" ? pairToken : analysisToken;

  const currentSpotPrice = amm.spotPrice(tokenIn.symbol, tokenOut.symbol);
  const newSpotPrice = currentSpotPrice * 1.02;

  switch (poolType) {
    case PoolTypeEnum.MetaStable:
      // For metastable pools we'll assume depth cost as 2% of the current spot price
      return poolSide === "in"
        ? amm.tokenInForExactSpotPriceAfterSwap(
            newSpotPrice,
            tokenIn.symbol,
            tokenOut.symbol,
          )
        : amm.tokenOutForExactSpotPriceAfterSwap(
            newSpotPrice,
            tokenIn.symbol,
            tokenOut.symbol,
          );
    case PoolTypeEnum.GyroE: {
      // For CLP pools we'll assume depth cost as the pool depth == 99% of the liquidity or 2% of the current spot price, whichever is closer
      if (
        newSpotPrice < (data.poolParams?.alpha as number) ||
        newSpotPrice > (data.poolParams?.beta as number)
      ) {
        return poolSide === "in"
          ? amm.tokenInForExactTokenOut(
              tokenOut.balance * 0.99,
              tokenIn.symbol,
              tokenOut.symbol,
            )
          : tokenOut.balance * 0.99;
      }
      return poolSide === "in"
        ? amm.tokenInForExactSpotPriceAfterSwap(
            newSpotPrice,
            tokenIn.symbol,
            tokenOut.symbol,
          )
        : amm.tokenOutForExactSpotPriceAfterSwap(
            newSpotPrice,
            tokenIn.symbol,
            tokenOut.symbol,
          );
    }
    default:
      return 0;
  }
}
