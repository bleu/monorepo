"use client";

import { AMM } from "@bleu-balancer-tools/math-poolsimulator/src";
import { PoolPairData } from "@bleu-balancer-tools/math-poolsimulator/src/types";
import { PlotType } from "plotly.js";

import { AlertCard } from "#/components/AlertCard";
import Plot, { defaultAxisLayout, PlotTitle } from "#/components/Plot";
import { Spinner } from "#/components/Spinner";
import {
  AnalysisData,
  usePoolSimulator,
} from "#/contexts/PoolSimulatorContext";
import { formatNumber } from "#/utils/formatNumber";

import { PoolTypeEnum, TokensData } from "../(types)";
import { BetaLimits } from "../(utils)/getBetaLimits";

const PLOT_TITLE = "Depth cost";
const PLOT_TOOLTIP =
  "Indicates the amount of tokens needed on a swap to alter the spot price (rate between the price of both tokens) to the depth cost point. For stable pools, the depth cost point is 2% of the spot price. For concentrated liquidity pools is 99% of the liquidity range or 2% of the spot price, whichever is closer. For FX pools, the depth cost point it is the boundary of the beta region, where the price won't be constant anymore.";

export function DepthCost({
  initialBetaLimits,
  customBetaLimits,
}: {
  initialBetaLimits?: BetaLimits;
  customBetaLimits?: BetaLimits;
}) {
  const {
    customAnalysisToken,
    initialAnalysisToken,
    initialData,
    customData,
    initialAMM,
    customAMM,
  } = usePoolSimulator();

  if (!initialAMM || !customAMM || !initialAnalysisToken.balance)
    return <Spinner />;

  const pairTokensInitial = initialData?.tokens.filter(
    (token) => token.symbol !== initialAnalysisToken.symbol,
  );

  const pairTokenCustom = customData?.tokens.filter(
    (token) => token.symbol !== initialAnalysisToken.symbol,
  );

  try {
    const depthCostAmounts = {
      initial: {
        in: pairTokensInitial.map((pairToken) =>
          calculateDepthCost(
            pairToken,
            initialAnalysisToken,
            "in",
            initialData,
            initialAMM,
            initialData.poolType,
            initialBetaLimits,
          ),
        ),
        out: pairTokensInitial.map((pairToken) =>
          calculateDepthCost(
            pairToken,
            initialAnalysisToken,
            "out",
            initialData,
            initialAMM,
            initialData.poolType,
            initialBetaLimits,
          ),
        ),
      },
      custom: {
        in: pairTokenCustom.map((pairToken) =>
          calculateDepthCost(
            pairToken,
            customAnalysisToken,
            "in",
            customData,
            customAMM,
            customData.poolType,
            customBetaLimits,
          ),
        ),
        out: pairTokenCustom.map((pairToken) =>
          calculateDepthCost(
            pairToken,
            customAnalysisToken,
            "out",
            customData,
            customAMM,
            customData.poolType,
            customBetaLimits,
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

    if (maxDepthCostAmount == -1) return <Spinner />;

    const showWarning = [
      ...depthCostAmounts.initial.in.map(({ type }) => type),
      ...depthCostAmounts.initial.out.map(({ type }) => type),
      ...depthCostAmounts.custom.in.map(({ type }) => type),
      ...depthCostAmounts.custom.out.map(({ type }) => type),
    ].includes("already outside of beta region");

    const dataX = pairTokensInitial.map((token) => token.symbol);

    const data = [
      createDataObject(
        dataX,
        depthCostAmounts.initial.in.map(({ amount }) => amount),
        "Initial",
        "Initial",
        true,
        "in",
        initialAnalysisToken?.symbol,
        depthCostAmounts.initial.in.map(({ type }) => type),
      ),
      createDataObject(
        dataX,
        depthCostAmounts.custom.in.map(({ amount }) => amount),
        "Custom",
        "Custom",
        true,
        "in",
        initialAnalysisToken?.symbol,
        depthCostAmounts.custom.in.map(({ type }) => type),
      ),
      createDataObject(
        dataX,
        depthCostAmounts.initial.out.map(({ amount }) => amount),
        "Initial",
        "Initial",
        false,
        "out",
        initialAnalysisToken?.symbol,
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
        initialAnalysisToken?.symbol,
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
          ticktext: pairTokensInitial.map((token) => token.symbol),
        },
        xaxis2: {
          ...defaultAxisLayout,
          tickmode: "array" as const,
          tickvals: dataX,
          ticktext: pairTokensInitial.map((token) => token.symbol),
        },
        yaxis: {
          title: `${initialAnalysisToken?.symbol} in`,
          range: [0, maxDepthCostAmount],
        },
        yaxis2: {
          ...defaultAxisLayout,
          title: `${initialAnalysisToken?.symbol} out`,
          range: [0, maxDepthCostAmount],
        },
        grid: { columns: 2, rows: 1, pattern: "independent" as const },
      },
      config: { displayModeBar: false },
    };

    return (
      <div className="flex flex-col gap-y-3">
        <Plot {...props} />;
        {showWarning && (
          <AlertCard
            style="warning"
            title="Fx Pool outside of beta region"
            message="The depth cost equal to zero means that the pool is already outside of the beta region point"
          />
        )}
      </div>
    );
  } catch (e) {
    return (
      <div className="flex w-full flex-col">
        <PlotTitle title={PLOT_TITLE} tooltip={PLOT_TOOLTIP} />
        <AlertCard
          style="error"
          message="The depth cost chart runs using numerical calculus. Usually this happens because at least one pool parameter value is not defined properly, so the simulation does not converge. Please review the initial and custom pool parameters used."
          title="Depth Cost didn't converge"
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

export function calculateDepthCost(
  pairToken: TokensData,
  analysisToken: TokensData,
  poolSide: "in" | "out",
  data: AnalysisData,
  amm: AMM<PoolPairData>,
  poolType: PoolTypeEnum,
  betaLimits?: BetaLimits,
) {
  if (!analysisToken) throw new Error("Analysis token not found");
  const tokenIn = poolSide === "in" ? analysisToken : pairToken;
  const tokenOut = poolSide === "in" ? pairToken : analysisToken;
  const currentSpotPrice = amm.spotPrice(tokenIn.symbol, tokenOut.symbol);
  const newSpotPrice = currentSpotPrice * 1.02;
  const spotPricePrecision = currentSpotPrice * 0.0002;
  const amountCalculator = (price: number) =>
    poolSide === "in"
      ? amm.tokenInForExactSpotPriceAfterSwap(
          price,
          tokenIn.symbol,
          tokenOut.symbol,
          spotPricePrecision,
        )
      : amm.tokenOutForExactSpotPriceAfterSwap(
          price,
          tokenIn.symbol,
          tokenOut.symbol,
          spotPricePrecision,
        );

  const { alpha, beta } = computeAlphaBetaValues(poolType, data);

  switch (poolType) {
    // For metastable pools we'll assume depth cost as 2% of the current spot price
    case PoolTypeEnum.MetaStable:
      return {
        amount: amountCalculator(newSpotPrice),
        type: "2% of price change",
      };
    case PoolTypeEnum.Gyro3:
    case PoolTypeEnum.Gyro2:
    case PoolTypeEnum.GyroE:
      // For CLP pools we'll assume depth cost as the pool depth == 99% of the liquidity or 2% of the current spot price (if possible)
      // The Alpha and Beta values are considering token 0 in units of token 1.
      // This means that token 1 must be the the tokenIn
      // And token 0 must be the tokenOut
      const newSpotPriceOnAlphaAndBetaBase =
        tokenIn.symbol === data.tokens[1].symbol
          ? newSpotPrice
          : 1 / newSpotPrice;
      if (!alpha || !beta) throw new Error("Alpha or beta not defined");
      if (
        newSpotPriceOnAlphaAndBetaBase < alpha ||
        newSpotPriceOnAlphaAndBetaBase > beta
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
      return {
        amount: amountCalculator(newSpotPrice),
        type: "2% of price change",
      };
    case PoolTypeEnum.Fx:
      const betaLimitAmount =
        poolSide === "in"
          ? betaLimits?.analysisTokenIn.analysisAmount
          : (betaLimits?.tabTokenIn.analysisAmount as number) * -1; // the amount is negative because the tokenIn is the tabToken

      if (!betaLimitAmount || betaLimitAmount < 0) {
        return {
          amount: 0,
          type: "already outside of beta region",
        };
      }
      return {
        amount: betaLimitAmount,
        type: "beta region limit",
      };
    default:
      return { amount: -1, type: "" };
  }
}

function computeAlphaBetaValues(poolType: PoolTypeEnum, data: AnalysisData) {
  switch (poolType) {
    case PoolTypeEnum.GyroE:
      return {
        alpha: data.poolParams?.alpha,
        beta: data.poolParams?.beta,
      };
    case PoolTypeEnum.Gyro2:
      return {
        alpha: (data.poolParams?.sqrtAlpha as number) ** 2,
        beta: (data.poolParams?.sqrtBeta as number) ** 2,
      };
    case PoolTypeEnum.Gyro3:
      return {
        alpha: (data.poolParams?.root3Alpha as number) ** 3,
        beta: 1 / (data.poolParams?.root3Alpha as number) ** 3, //source: https://2063019688-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-MU527HCtxlYaQoNazhF%2Fuploads%2FZrQCiZDDe8xrof3ngRG2%2F3-CLP%20Technical%20Specification.pdf?alt=media&token=c4f3b8bd-57fb-48ab-815f-cfa29b748d91,
      };
    default:
      return {};
  }
}
