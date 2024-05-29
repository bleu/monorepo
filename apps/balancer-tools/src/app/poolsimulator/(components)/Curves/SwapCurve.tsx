"use client";

import { formatNumber } from "@bleu/utils/formatNumber";
import { PlotType } from "plotly.js";

import Plot from "#/components/Plot";
// import { Spinner } from "#/components/Spinner";
import { usePoolSimulator } from "#/contexts/PoolSimulatorContext";

import { findTokenBySymbol, POOL_TYPES_TO_ADD_LIMIT } from "../../(utils)";
import { AmountsData } from "../AnalysisPage";

export const INVISIBLE_TRACE = {
  // Used to not mixup the traces colors
  x: [],
  y: [],
  type: "scatter" as PlotType,
  mode: "lines" as const,
  line: { dash: "dashdot" } as const,
  legendgroup: "",
  legendgrouptitle: { text: "" },
  name: "",
  showlegend: false,
  hovertemplate: [""],
};

export function SwapCurve({
  initialAmounts,
  customAmounts,
}: {
  initialAmounts: AmountsData;
  customAmounts: AmountsData;
}) {
  const {
    initialAnalysisToken: { symbol: analysisTokenSymbol },
    initialCurrentTabToken: { symbol: currentTabTokenSymbol },
    initialData,
    customData,
  } = usePoolSimulator();

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
    showlegend = true,
    hovertemplate: string[],
  ) => {
    return {
      x,
      y,
      type: "scatter" as PlotType,
      legendgroup: legendGroup,
      legendgrouptitle: { text: legendGroup },
      name: "Swap",
      showlegend,
      hovertemplate,
    };
  };

  const createLimitPointDataObject = (
    x: number[],
    y: number[],
    legendGroup: string,
  ) => {
    return {
      x,
      y,
      type: "scatter" as PlotType,
      mode: "markers" as const,
      legendgroup: legendGroup,
      legendgrouptitle: { text: legendGroup },
      name: "Liquidity limit",
      showlegend: true,
      hovertemplate: Array(x.length).fill(`Liquidity limit <extra></extra>`),
    };
  };

  const createBetaRegionDataObject = (
    x_points: number[],
    y_points: number[],
    legendGroup: string,
  ) => {
    const x = [x_points[0], x_points[1], x_points[1], x_points[0], x_points[0]];
    const y = [y_points[0], y_points[0], y_points[1], y_points[1], y_points[0]];
    return {
      x,
      y,
      type: "scatter" as PlotType,
      mode: "lines" as const,
      line: { dash: "dashdot" } as const,
      legendgroup: legendGroup,
      legendgrouptitle: { text: legendGroup },
      name: "Beta region",
      showlegend: true,
      hovertemplate: Array(x.length).fill(`Beta region <extra></extra>`),
    };
  };

  const data = [
    createDataObject(
      initialAmounts.analysisTokenIn,
      initialAmounts.pairTokenOut,
      "Initial",
      true,
      initialAmounts.analysisTokenIn.map((amount, index) =>
        formatSwap(
          amount,
          analysisTokenSymbol,
          -initialAmounts.pairTokenOut[index],
          currentTabTokenSymbol,
        ),
      ),
    ),
    createDataObject(
      customAmounts.analysisTokenIn,
      customAmounts.pairTokenOut,
      "Custom",
      true,
      customAmounts.analysisTokenIn.map((amount, index) =>
        formatSwap(
          amount,
          analysisTokenSymbol,
          -customAmounts.pairTokenOut[index],
          currentTabTokenSymbol,
        ),
      ),
    ),
    createDataObject(
      initialAmounts.analysisTokenOut,
      initialAmounts.pairTokenIn,
      "Initial",
      false,
      initialAmounts.analysisTokenOut.map((amount, index) =>
        formatSwap(
          initialAmounts.pairTokenIn[index],
          currentTabTokenSymbol,
          -amount,
          analysisTokenSymbol,
        ),
      ),
    ),
    createDataObject(
      customAmounts.analysisTokenOut,
      customAmounts.pairTokenIn,
      "Custom",
      false,
      customAmounts.analysisTokenOut.map((amount, index) =>
        formatSwap(
          customAmounts.pairTokenIn[index],
          currentTabTokenSymbol,
          -amount,
          analysisTokenSymbol,
        ),
      ),
    ),
  ];

  const poolData = [initialData, customData];
  const amounts = [initialAmounts, customAmounts];
  const legends = ["Initial", "Custom"];
  amounts.forEach((amount, index) => {
    data.push(
      POOL_TYPES_TO_ADD_LIMIT.includes(poolData[index].poolType)
        ? createLimitPointDataObject(
            [
              amount.analysisTokenOut.slice(-1)[0],
              amount.analysisTokenIn.slice(-1)[0],
            ],
            [amount.pairTokenIn.slice(-1)[0], amount.pairTokenOut.slice(-1)[0]],
            legends[index],
          )
        : INVISIBLE_TRACE, // Used to not mixup the traces colors
    );
  });

  amounts.forEach((amount, index) => {
    data.push(
      amount.betaLimits
        ? createBetaRegionDataObject(
            amount.betaLimits.analysis,
            amount.betaLimits.pair,
            legends[index],
          )
        : INVISIBLE_TRACE, // Used to not mixup the traces colors
    );
  });

  function getGraphScale({
    axisBalanceSymbol,
    oppositeAxisBalanceSymbol,
  }: {
    axisBalanceSymbol?: string;
    oppositeAxisBalanceSymbol?: string;
  }) {
    const initialAxisToken = findTokenBySymbol(
      initialData.tokens,
      axisBalanceSymbol,
    );
    const customAxisToken = findTokenBySymbol(
      customData.tokens,
      axisBalanceSymbol,
    );
    const initialOppositeAxisToken = findTokenBySymbol(
      initialData.tokens,
      oppositeAxisBalanceSymbol,
    );
    const customOppositeAxisToken = findTokenBySymbol(
      customData.tokens,
      oppositeAxisBalanceSymbol,
    );
    const axisBalances = [
      initialAxisToken?.balance || 0,
      customAxisToken?.balance || 0,
    ];

    const convertBalanceScale = (
      balance?: number,
      balanceRate?: number,
      newRate?: number,
    ) => {
      if (!balance || !balanceRate || !newRate) return 0;
      return (balance * balanceRate) / newRate;
    };

    const oppositeAxisBalances = [
      convertBalanceScale(
        initialOppositeAxisToken?.balance,
        initialOppositeAxisToken?.rate,
        initialAxisToken?.rate,
      ),
      convertBalanceScale(
        customOppositeAxisToken?.balance,
        customOppositeAxisToken?.rate,
        customAxisToken?.rate,
      ),
    ];

    const maxOfAxisBalance = Math.max(...axisBalances);
    const maxOfOppositeAxisBalance = Math.max(...oppositeAxisBalances);

    return [-maxOfAxisBalance * 1.1, maxOfOppositeAxisBalance * 1.1];
  }

  return (
    <Plot
      title="Swap Curve"
      toolTip="It indicates the quantity of token that will be received when swapping a specific amount of another token. The amount sign is based on the pool point of view."
      data={data}
      layout={{
        xaxis: {
          title: `Amount of ${analysisTokenSymbol}`,
          range: getGraphScale({
            axisBalanceSymbol: analysisTokenSymbol,
            oppositeAxisBalanceSymbol: currentTabTokenSymbol,
          }),
        },
        yaxis: {
          title: `Amount of ${currentTabTokenSymbol}`,
          range: getGraphScale({
            axisBalanceSymbol: currentTabTokenSymbol,
            oppositeAxisBalanceSymbol: analysisTokenSymbol,
          }),
        },
      }}
      className="h-1/2 w-full"
    />
  );
}
