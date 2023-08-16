"use client";

import { PlotType } from "plotly.js";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import Plot from "#/components/Plot";
import { Spinner } from "#/components/Spinner";
import { usePoolSimulator } from "#/contexts/PoolSimulatorContext";
import { formatNumber } from "#/utils/formatNumber";

import { PoolTypeEnum } from "../(types)";
import {
  SwapCurveWorkerInputData,
  SwapCurveWorkerOutputData,
} from "../(workers)/swap-curve-calculation";

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
    new URL("../(workers)/swap-curve-calculation.ts", import.meta.url),
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

  if (
    [PoolTypeEnum.Gyro2, PoolTypeEnum.Gyro3, PoolTypeEnum.GyroE].includes(
      initialData.poolType,
    )
  ) {
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
  if (
    [PoolTypeEnum.Gyro2, PoolTypeEnum.Gyro3, PoolTypeEnum.GyroE].includes(
      customData.poolType,
    )
  ) {
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

  function getGraphScale({
    initialAmountsIn,
    customAmountsIn,
    initialAmountsOut,
    customAmountsOut,
  }: {
    initialAmountsIn: number[];
    customAmountsIn: number[];
    initialAmountsOut: number[];
    customAmountsOut: number[];
  }) {
    const maxOfIn = {
      initial: Math.max(...initialAmountsIn),
      custom: Math.max(...customAmountsIn),
    };
    const minOfOut = {
      initial: Math.min(...initialAmountsOut),
      custom: Math.min(...customAmountsOut),
    };

    const limits = {
      lowerIn: Math.min(maxOfIn.initial, maxOfIn.custom),
      higherOut: Math.max(minOfOut.initial, minOfOut.custom),
    };

    if (maxOfIn.initial === maxOfIn.custom) {
      return [initialAmountsOut[100] * 1.1, initialAmountsIn[100] * 1.1];
    }

    if (maxOfIn.initial === limits.lowerIn) {
      const indexMax = initialAmountsIn.indexOf(limits.lowerIn);
      const indexMin = initialAmountsOut.indexOf(limits.higherOut);
      return [
        initialAmountsOut[indexMin] * 1.1,
        initialAmountsIn[indexMax] * 1.1,
      ];
    }
    if (maxOfIn.custom === limits.lowerIn) {
      const indexMax = customAmountsIn.indexOf(limits.lowerIn);
      const indexMin = customAmountsOut.indexOf(limits.higherOut);
      return [
        customAmountsOut[indexMin] * 1.1,
        customAmountsIn[indexMax] * 1.1,
      ];
    }
  }

  return (
    <div className="relative">
      <Plot
        title="Swap Curve"
        toolTip="It indicates the quantity of token that will be received when swapping a specific amount of another token. The amount sign is based on the pool point of view."
        data={data}
        layout={{
          xaxis: {
            title: `Amount of ${analysisToken.symbol}`,
            range: getGraphScale({
              initialAmountsOut: initialAmounts.analysisTokenOut,
              customAmountsOut: customAmounts.analysisTokenOut,
              initialAmountsIn: initialAmounts.analysisTokenIn,
              customAmountsIn: customAmounts.analysisTokenIn,
            }),
          },
          yaxis: {
            title: `Amount of ${currentTabToken.symbol}`,
            range: getGraphScale({
              initialAmountsOut: initialAmounts.tabTokenOut,
              customAmountsOut: customAmounts.tabTokenOut,
              initialAmountsIn: initialAmounts.tabTokenIn,
              customAmountsIn: customAmounts.tabTokenIn,
            }),
          },
        }}
        className="h-1/2 w-full"
      />
    </div>
  );
}
