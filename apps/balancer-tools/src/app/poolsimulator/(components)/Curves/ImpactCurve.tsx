"use client";

import { formatNumber } from "@bleu-balancer-tools/utils/formatNumber";
import { PlotType } from "plotly.js";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import Plot from "#/components/Plot";
import { Spinner } from "#/components/Spinner";
import { usePoolSimulator } from "#/contexts/PoolSimulatorContext";

import { PoolTypeEnum } from "../../(types)";
import { POOL_TYPES_TO_ADD_LIMIT } from "../../(utils)";
import {
  ImpactWorkerInputData,
  ImpactWorkerOutputData,
} from "../../(workers)/impact-curve-calculation";
import { INVISIBLE_TRACE } from "./SwapCurve";

interface Amounts {
  analysisTokenIn?: {
    amounts: number[];
    priceImpact: number[];
    amountsOut: number[];
    betaLimitIndex: number[];
  };
  tabTokenIn?: {
    amounts: number[];
    priceImpact: number[];
    amountsOut: number[];
    betaLimitIndex: number[];
  };
}

const createAndPostWorker = (
  messageData: ImpactWorkerInputData,
  setInitialAmounts: Dispatch<SetStateAction<Amounts>>,
  setCustomAmounts: Dispatch<SetStateAction<Amounts>>,
) => {
  const worker = new Worker(
    new URL("../../(workers)/impact-curve-calculation.ts", import.meta.url),
  );

  worker.onmessage = (event: MessageEvent<ImpactWorkerOutputData>) => {
    const { result, type, swapDirection } = event.data;
    const setter = type === "initial" ? setInitialAmounts : setCustomAmounts;

    const key = swapDirection === "in" ? "analysisTokenIn" : "tabTokenIn";

    setter((prev) => ({ ...prev, [key]: result }));

    worker.terminate();
  };

  worker.postMessage(messageData);
};

export function ImpactCurve() {
  const {
    initialAnalysisToken,
    customAnalysisToken,
    initialCurrentTabToken,
    customCurrentTabToken,
    initialData,
    customData,
  } = usePoolSimulator();

  const [initialAmounts, setInitialAmounts] = useState<Amounts>({});
  const [customAmounts, setCustomAmounts] = useState<Amounts>({});

  if (!initialData || !customData) return <Spinner />;

  useEffect(() => {
    const messages: ImpactWorkerInputData[] = [
      {
        tokenIn: initialAnalysisToken,
        tokenOut: initialCurrentTabToken,
        data: initialData,
        poolType: initialData.poolType,
        swapDirection: "in",
        type: "initial",
      },
      {
        tokenIn: initialAnalysisToken,
        tokenOut: initialCurrentTabToken,
        data: initialData,
        poolType: initialData.poolType,
        swapDirection: "out",
        type: "initial",
      },
      {
        tokenIn: customAnalysisToken,
        tokenOut: customCurrentTabToken,
        data: customData,
        poolType: customData.poolType,
        swapDirection: "in",
        type: "custom",
      },
      {
        tokenIn: customAnalysisToken,
        tokenOut: customCurrentTabToken,
        data: customData,
        poolType: customData.poolType,
        swapDirection: "out",
        type: "custom",
      },
    ];

    messages.forEach((message) =>
      createAndPostWorker(message, setInitialAmounts, setCustomAmounts),
    );
  }, [
    initialData,
    customData,
    initialAnalysisToken,
    customAnalysisToken,
    customCurrentTabToken,
    initialCurrentTabToken,
  ]);

  // Helper function to format the swap action string
  const formatAction = (
    direction: "in" | "out",
    amount: number,
    tokenFrom: string,
    tokenTo: string,
  ) => {
    const formattedAmount = formatNumber(amount, 2);
    return direction === "in"
      ? `${formattedAmount} ${tokenFrom} for ${tokenTo}`
      : `${tokenTo} for ${formattedAmount} ${tokenFrom}`;
  };

  const createHoverTemplate = (
    amounts: number[],
    direction: "in" | "out",
    impactData: number[],
  ): string[] => {
    return amounts.map((amount, i) => {
      const swapFromSymbol =
        direction === "in"
          ? initialAnalysisToken.symbol
          : initialCurrentTabToken.symbol;
      const swapToSymbol =
        direction === "in"
          ? initialCurrentTabToken.symbol
          : initialAnalysisToken.symbol;

      const swapAction = formatAction(
        direction,
        amount,
        swapFromSymbol,
        swapToSymbol,
      );

      const impact = formatNumber(impactData[i] / 100, 2, "percent");

      return `Swap ${swapAction} causes a Price Impact of ${impact} ${swapFromSymbol}/${swapToSymbol} <extra></extra>`;
    });
  };

  const createDataObject = (
    hovertemplateData: number[],
    impactData: number[],
    legendgroup: string,
    name: string,
    isLegendShown: boolean,
    direction: "in" | "out",
    lineStyle: "solid" | "dashdot" = "solid",
  ) => {
    const line =
      lineStyle === "dashdot"
        ? { dash: "dashdot" as const }
        : { dash: "solid" as const };

    return {
      x: hovertemplateData,
      y: impactData,
      type: "scatter" as PlotType,
      mode: "lines" as "lines" | "markers",
      legendgroup,
      legendgrouptitle: { text: legendgroup },
      name,
      showlegend: isLegendShown,
      hovertemplate: createHoverTemplate(
        hovertemplateData,
        direction,
        impactData,
      ),
      line,
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
      mode: "markers" as "lines" | "markers",
      legendgroup: legendGroup,
      legendgrouptitle: { text: legendGroup },
      name: "Liquidity limit",
      showlegend: true,
      hovertemplate: Array(x.length).fill(`Liquidity limit <extra></extra>`),
      line: { dash: "solid" as const },
    };
  };

  const createBetaLimitsDataObject = (
    x: number[],
    y: number[],
    legendGroup: string,
  ) => {
    return {
      x,
      y,
      type: "scatter" as PlotType,
      mode: "markers" as const,
      marker: { symbol: "x" as const, size: 10 },
      legendgroup: legendGroup,
      legendgrouptitle: { text: legendGroup },
      name: "Beta region limit",
      showlegend: true,
      hovertemplate: Array(x.length).fill(`Beta region <extra></extra>`),
      line: { dash: "solid" as const },
    };
  };

  if (
    !initialAmounts.analysisTokenIn ||
    !initialAmounts.tabTokenIn ||
    !customAmounts.analysisTokenIn ||
    !customAmounts.tabTokenIn
  )
    return <Spinner />;

  const data = [
    createDataObject(
      initialAmounts.analysisTokenIn.amounts,
      initialAmounts.analysisTokenIn.priceImpact,
      "Initial",
      initialAnalysisToken.symbol,
      true,
      "in",
    ),
    createDataObject(
      customAmounts.analysisTokenIn.amounts,
      customAmounts.analysisTokenIn.priceImpact,
      "Custom",
      customAnalysisToken.symbol,
      true,
      "in",
    ),
    createDataObject(
      initialAmounts.tabTokenIn.amounts,
      initialAmounts.tabTokenIn.priceImpact,
      "Initial",
      customCurrentTabToken.symbol,
      true,
      "out",
      "dashdot",
    ),
    createDataObject(
      customAmounts.tabTokenIn.amounts,
      customAmounts.tabTokenIn.priceImpact,
      "Custom",
      customCurrentTabToken.symbol,
      true,
      "out",
      "dashdot",
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
              amount.analysisTokenIn?.amounts.slice(-1)[0] || 0,
              amount.tabTokenIn?.amounts.slice(-1)[0] || 0,
            ],
            [
              amount.analysisTokenIn?.priceImpact.slice(-1)[0] || 0,
              amount.tabTokenIn?.priceImpact.slice(-1)[0] || 0,
            ],
            legends[index],
          )
        : INVISIBLE_TRACE,
    );
  });

  poolData.forEach((pool, index) => {
    const amountsList = [
      amounts[index].analysisTokenIn,
      amounts[index].tabTokenIn,
    ];
    const amountLimits = [] as number[];
    const priceImpactLimits = [] as number[];
    amountsList.forEach((amount) => {
      if (!amount) return;
      amount.betaLimitIndex.forEach((i) => {
        amountLimits.push(amount?.amounts[i]);
        priceImpactLimits.push(amount?.priceImpact[i]);
      });
    });
    data.push(
      pool.poolType == PoolTypeEnum.Fx && pool.poolParams?.beta
        ? createBetaLimitsDataObject(
            amountLimits,
            priceImpactLimits,
            legends[index],
          )
        : INVISIBLE_TRACE,
    );
  });

  const maxFromInitialAmounts = Math.max(
    ...initialAmounts.analysisTokenIn.amounts,
    ...initialAmounts.tabTokenIn.amounts,
  );
  const maxFromCustomAmounts = Math.max(
    ...customAmounts.analysisTokenIn.amounts,
    ...customAmounts.tabTokenIn.amounts,
  );
  const xlimit = Math.min(maxFromInitialAmounts, maxFromCustomAmounts);
  function indexOfXLimit(value: number, ...arrays: number[][]) {
    return arrays.map((arr) => arr.indexOf(value)).find((idx) => idx !== -1);
  }

  const arraysToSearch = [
    initialAmounts.analysisTokenIn.amounts,
    initialAmounts.tabTokenIn.amounts,
    customAmounts.analysisTokenIn.amounts,
    customAmounts.tabTokenIn.amounts,
  ];
  const xLimitIndex = maxFromInitialAmounts
    ? indexOfXLimit(xlimit, ...arraysToSearch)
    : undefined;

  const getImpactOnXLimit = (analysis: number[], tab: number[]) =>
    xLimitIndex ? Math.max(analysis[xLimitIndex], tab[xLimitIndex]) : 0;

  const ylimit = Math.max(
    getImpactOnXLimit(
      initialAmounts.analysisTokenIn.priceImpact,
      initialAmounts.tabTokenIn.priceImpact,
    ),
    getImpactOnXLimit(
      customAmounts.analysisTokenIn.priceImpact,
      customAmounts.tabTokenIn.priceImpact,
    ),
  );
  return (
    <Plot
      title="Price Impact Curve"
      toolTip="Indicates how much the swapping of a particular amount of token effects on the Price Impact (rate between the price of both tokens). The sign is based on the pool point of view."
      data={data}
      layout={{
        xaxis: {
          title: `Amount in`,
          range: [0, xlimit * 1.1],
        },
        yaxis: {
          title: `Price impact (%)`,
          range: [undefined, ylimit],
        },
      }}
      className="h-1/2 w-full"
    />
  );
}
