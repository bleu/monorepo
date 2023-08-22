"use client";

import { PlotType } from "plotly.js";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import Plot from "#/components/Plot";
import { Spinner } from "#/components/Spinner";
import { usePoolSimulator } from "#/contexts/PoolSimulatorContext";
import { formatNumber } from "#/utils/formatNumber";

import { PoolTypeEnum } from "../../(types)";
import { findTokenBySymbol, POOL_TYPES_TO_ADD_LIMIT } from "../../(utils)";
import {
  SwapCurveWorkerInputData,
  SwapCurveWorkerOutputData,
} from "../../(workers)/swap-curve-calculation";
import getBetaLimitIndexes from "./getBetaLimits";

interface AmountsData {
  analysisTokenIn: number[];
  analysisTokenOut: number[];
  tabTokenIn: number[];
  tabTokenOut: number[];
}

const createAndPostSwapWorker = (
  messageData: SwapCurveWorkerInputData,
  setInitialAmounts: Dispatch<SetStateAction<AmountsData>>,
  setCustomAmounts: Dispatch<SetStateAction<AmountsData>>,
) => {
  const worker = new Worker(
    new URL("../../(workers)/swap-curve-calculation.ts", import.meta.url),
  );

  worker.onmessage = (event: MessageEvent<SwapCurveWorkerOutputData>) => {
    const result = event.data.result;
    const type = event.data.type;

    if (!result) return;

    const setter = type === "initial" ? setInitialAmounts : setCustomAmounts;

    setter(result);
  };

  worker.postMessage(messageData);
};

export function SwapCurve() {
  const { analysisToken, currentTabToken, initialData, customData } =
    usePoolSimulator();

  if (!initialData || !customData) return <Spinner />;

  const [initialAmounts, setInitialAmounts] = useState<AmountsData>(
    {} as AmountsData,
  );
  const [customAmounts, setCustomAmounts] = useState<AmountsData>(
    {} as AmountsData,
  );

  useEffect(() => {
    const messages: SwapCurveWorkerInputData[] = [
      {
        analysisToken,
        currentTabToken,
        data: initialData,
        type: "initial",
      },
      {
        analysisToken,
        currentTabToken,
        data: customData,
        type: "custom",
      },
    ];

    messages.forEach((message) =>
      createAndPostSwapWorker(message, setInitialAmounts, setCustomAmounts),
    );
  }, [initialData, customData, analysisToken, currentTabToken]);

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

  if (
    !initialAmounts.analysisTokenIn ||
    !initialAmounts.analysisTokenOut ||
    !initialAmounts.tabTokenIn ||
    !initialAmounts.tabTokenOut ||
    !customAmounts.analysisTokenIn ||
    !customAmounts.analysisTokenOut ||
    !customAmounts.tabTokenIn ||
    !customAmounts.tabTokenOut
  )
    return <Spinner />;

  const data = [
    createDataObject(
      initialAmounts.analysisTokenIn,
      initialAmounts.tabTokenOut,
      "Initial",
      true,
      initialAmounts.analysisTokenIn.map((amount, index) =>
        formatSwap(
          amount,
          analysisToken.symbol,
          -initialAmounts.tabTokenOut[index],
          currentTabToken.symbol,
        ),
      ),
    ),
    createDataObject(
      customAmounts.analysisTokenIn,
      customAmounts.tabTokenOut,
      "Custom",
      true,
      customAmounts.analysisTokenIn.map((amount, index) =>
        formatSwap(
          amount,
          analysisToken.symbol,
          -customAmounts.tabTokenOut[index],
          currentTabToken.symbol,
        ),
      ),
    ),
    createDataObject(
      initialAmounts.analysisTokenOut,
      initialAmounts.tabTokenIn,
      "Initial",
      false,
      initialAmounts.analysisTokenOut.map((amount, index) =>
        formatSwap(
          initialAmounts.tabTokenIn[index],
          currentTabToken.symbol,
          -amount,
          analysisToken.symbol,
        ),
      ),
    ),
    createDataObject(
      customAmounts.analysisTokenOut,
      customAmounts.tabTokenIn,
      "Custom",
      false,
      customAmounts.analysisTokenOut.map((amount, index) =>
        formatSwap(
          customAmounts.tabTokenIn[index],
          currentTabToken.symbol,
          -amount,
          analysisToken.symbol,
        ),
      ),
    ),
  ];

  if (POOL_TYPES_TO_ADD_LIMIT.includes(initialData.poolType)) {
    data.push(
      createLimitPointDataObject(
        [
          initialAmounts.analysisTokenOut.slice(-1)[0],
          initialAmounts.analysisTokenIn.slice(-1)[0],
        ],
        [
          initialAmounts.tabTokenIn.slice(-1)[0],
          initialAmounts.tabTokenOut.slice(-1)[0],
        ],
        "Initial",
      ),
    );
  }
  if (POOL_TYPES_TO_ADD_LIMIT.includes(customData.poolType)) {
    data.push(
      createLimitPointDataObject(
        [
          customAmounts.analysisTokenOut.slice(-1)[0],
          customAmounts.analysisTokenIn.slice(-1)[0],
        ],
        [
          customAmounts.tabTokenIn.slice(-1)[0],
          customAmounts.tabTokenOut.slice(-1)[0],
        ],
        "Custom",
      ),
    );
  }
  const poolData = [initialData, customData];
  const amounts = [initialAmounts, customAmounts];
  const legends = ["Initial", "Custom"];

  poolData.forEach((pool, index) => {
    if (pool.poolType == PoolTypeEnum.Fx && pool.poolParams?.beta) {
      const analysisData = findTokenBySymbol(pool.tokens, analysisToken.symbol);
      const tabData = findTokenBySymbol(pool.tokens, currentTabToken.symbol);
      const betaLimits = getBetaLimitIndexes({
        ...amounts[index],
        analysisTokenInitialBalance: analysisData?.balance || 0,
        tabTokenInitialBalance: tabData?.balance || 0,
        tokenInRate: analysisData?.rate || 0,
        tokenOutRate: tabData?.rate || 0,
        beta: pool.poolParams.beta,
      });
      data.push(
        createBetaRegionDataObject(
          betaLimits[0],
          betaLimits[1],
          legends[index],
        ),
      );
    }
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
          title: `Amount of ${analysisToken.symbol}`,
          range: getGraphScale({
            axisBalanceSymbol: analysisToken.symbol,
            oppositeAxisBalanceSymbol: currentTabToken.symbol,
          }),
        },
        yaxis: {
          title: `Amount of ${currentTabToken.symbol}`,
          range: getGraphScale({
            axisBalanceSymbol: currentTabToken.symbol,
            oppositeAxisBalanceSymbol: analysisToken.symbol,
          }),
        },
      }}
      className="h-1/2 w-full"
    />
  );
}
