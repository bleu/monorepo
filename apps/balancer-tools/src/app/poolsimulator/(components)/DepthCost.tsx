"use client";

import { AMM } from "@bleu-balancer-tools/math-poolsimulator/src";
import { PlotType } from "plotly.js";

import { ErrorCard } from "#/components/ErrorCard";
import Plot, { defaultAxisLayout, PlotTitle } from "#/components/Plot";
import { Spinner } from "#/components/Spinner";
import {
  AnalysisData,
  PoolPairData,
  usePoolSimulator,
} from "#/contexts/PoolSimulatorContext";
import { formatNumber } from "#/utils/formatNumber";

import { PoolTypeEnum, TokensData } from "../(types)";

const PLOT_TITLE = "Depth cost";
const PLOT_TOOLTIP =
  "Indicates the amount of tokens needed on a swap to alter the spot price (rate between the price of both tokens) to the depth cost point. For stable pools, the depth cost point is 2% of the spot price. For concentrated liquidity pools is 99% of the liquidity range or 2% of the spot price, whichever is closer.";

export function DepthCost() {
  const { analysisToken, initialData, customData, initialAMM, customAMM } =
    usePoolSimulator();

  if (!initialAMM || !customAMM) return <Spinner />;

  const pairTokens = initialData?.tokens.filter(
    (token) => token.symbol !== analysisToken.symbol,
  );

  try {
    const depthCostAmounts = {
      initial: {
        in: pairTokens.map((pairToken) =>
          calculateDepthCost(
            pairToken,
            "in",
            initialData,
            initialAMM,
            initialData.poolType,
          ),
        ),
        out: pairTokens.map((pairToken) =>
          calculateDepthCost(
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
          calculateDepthCost(
            pairToken,
            "in",
            customData,
            customAMM,
            customData.poolType,
          ),
        ),
        out: pairTokens.map((pairToken) =>
          calculateDepthCost(
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
      ...depthCostAmounts.initial.in.map(({ amount }) => amount),
      ...depthCostAmounts.initial.out.map(({ amount }) => amount),
      ...depthCostAmounts.custom.in.map(({ amount }) => amount),
      ...depthCostAmounts.custom.out.map(({ amount }) => amount),
    );

    if (!maxDepthCostAmount) return <Spinner />;

    const dataX = pairTokens.map((token) => token.symbol);

    const data = [
      createDataObject(
        dataX,
        depthCostAmounts.initial.in.map(({ amount }) => amount),
        "Initial",
        "Initial",
        true,
        "in",
        analysisToken?.symbol,
        depthCostAmounts.initial.in.map(({ type }) => type),
      ),
      createDataObject(
        dataX,
        depthCostAmounts.custom.in.map(({ amount }) => amount),
        "Custom",
        "Custom",
        true,
        "in",
        analysisToken?.symbol,
        depthCostAmounts.custom.in.map(({ type }) => type),
      ),
      createDataObject(
        dataX,
        depthCostAmounts.initial.out.map(({ amount }) => amount),
        "Initial",
        "Initial",
        false,
        "out",
        analysisToken?.symbol,
        depthCostAmounts.initial.out.map(({ type }) => type),
        "y2",
        "x2",
      ),
      createDataObject(
        dataX,
        depthCostAmounts.custom.out.map(({ amount }) => amount),
        "Custom",
        "Custom",
        false,
        "out",
        analysisToken?.symbol,
        depthCostAmounts.custom.out.map(({ type }) => type),
        "y2",
        "x2",
      ),
    ];

    const props = {
      data: data,
      title: PLOT_TITLE,
      toolTip: PLOT_TOOLTIP,
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
  } catch (e) {
    return (
      <div className="flex w-full flex-col">
        <PlotTitle title={PLOT_TITLE} tooltip={PLOT_TOOLTIP} />
        <ErrorCard
          message="The depth cost chart runs using numerical calculus. Usually this happens because at least one pool parameter value is not defined properly, so the simulation does not converge. Please review the initial and custom pool parameters used."
          title="Depth Cost not converged"
        />
      </div>
    );
  }
}

const createHoverTemplate = (
  direction: "in" | "out",
  amounts: number[],
  analysisSymbol: string | undefined,
  tokenSymbols: string[],
  depthCostPointType: string[],
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

    return `Swap ${action} to move the price ${price} until the depth cost point (${depthCostPointType[i]}) <extra></extra>`;
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
  depthCostPointType: string[],
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
      y,
      analysisSymbol,
      x,
      depthCostPointType,
    ),
  };
};

function calculateDepthCost(
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
        ? {
            amount: amm.tokenInForExactSpotPriceAfterSwap(
              newSpotPrice,
              tokenIn.symbol,
              tokenOut.symbol,
            ),
            type: "2% of price change",
          }
        : {
            amount: amm.tokenOutForExactSpotPriceAfterSwap(
              newSpotPrice,
              tokenIn.symbol,
              tokenOut.symbol,
            ),
            type: "2% of price change",
          };
    case PoolTypeEnum.GyroE: {
      // For CLP pools we'll assume depth cost as the pool depth == 99% of the liquidity or 2% of the current spot price (if possible)
      if (
        newSpotPrice < (data.poolParams?.alpha as number) ||
        newSpotPrice > (data.poolParams?.beta as number)
      ) {
        return poolSide === "in"
          ? {
              amount: amm.tokenInForExactTokenOut(
                tokenOut.balance * 0.99,
                tokenIn.symbol,
                tokenOut.symbol,
              ),
              type: "price limit",
            }
          : { amount: tokenOut.balance * 0.99, type: "price limit" };
      }
      return poolSide === "in"
        ? {
            amount: amm.tokenInForExactSpotPriceAfterSwap(
              newSpotPrice,
              tokenIn.symbol,
              tokenOut.symbol,
            ),
            type: "2% of price change",
          }
        : {
            amount: amm.tokenOutForExactSpotPriceAfterSwap(
              newSpotPrice,
              tokenIn.symbol,
              tokenOut.symbol,
            ),
            type: "2% of price change",
          };
    }
    default:
      return { amount: 0, type: "" };
  }
}
