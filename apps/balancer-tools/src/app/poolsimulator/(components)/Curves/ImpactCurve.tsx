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
  ImpactWorkerInputData,
  ImpactWorkerOutputData,
} from "../../(workers)/impact-curve-calculation";
import { getBetaLimitsIndexes } from "./getBetaLimits";

interface Amounts {
  analysisTokenIn?: {
    amounts: number[];
    priceImpact: number[];
    amountsOut: number[];
  };
  tabTokenIn?: {
    amounts: number[];
    priceImpact: number[];
    amountsOut: number[];
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
  const { analysisToken, currentTabToken, initialData, customData } =
    usePoolSimulator();

  const [initialAmounts, setInitialAmounts] = useState<Amounts>({});
  const [customAmounts, setCustomAmounts] = useState<Amounts>({});

  if (!initialData || !customData) return <Spinner />;

  useEffect(() => {
    const messages: ImpactWorkerInputData[] = [
      {
        tokenIn: analysisToken,
        tokenOut: currentTabToken,
        data: initialData,
        poolType: initialData.poolType,
        swapDirection: "in",
        type: "initial",
      },
      {
        tokenIn: analysisToken,
        tokenOut: currentTabToken,
        data: initialData,
        poolType: initialData.poolType,
        swapDirection: "out",
        type: "initial",
      },
      {
        tokenIn: analysisToken,
        tokenOut: currentTabToken,
        data: customData,
        poolType: customData.poolType,
        swapDirection: "in",
        type: "custom",
      },
      {
        tokenIn: analysisToken,
        tokenOut: currentTabToken,
        data: customData,
        poolType: customData.poolType,
        swapDirection: "out",
        type: "custom",
      },
    ];

    messages.forEach((message) =>
      createAndPostWorker(message, setInitialAmounts, setCustomAmounts),
    );
  }, [initialData, customData, analysisToken, currentTabToken]);

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
        direction === "in" ? analysisToken.symbol : currentTabToken.symbol;
      const swapToSymbol =
        direction === "in" ? currentTabToken.symbol : analysisToken.symbol;

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
      analysisToken.symbol,
      true,
      "in",
    ),
    createDataObject(
      customAmounts.analysisTokenIn.amounts,
      customAmounts.analysisTokenIn.priceImpact,
      "Custom",
      analysisToken.symbol,
      true,
      "in",
    ),
    createDataObject(
      initialAmounts.tabTokenIn.amounts,
      initialAmounts.tabTokenIn.priceImpact,
      "Initial",
      currentTabToken.symbol,
      true,
      "out",
      "dashdot",
    ),
    createDataObject(
      customAmounts.tabTokenIn.amounts,
      customAmounts.tabTokenIn.priceImpact,
      "Custom",
      currentTabToken.symbol,
      true,
      "out",
      "dashdot",
    ),
  ];

  if (POOL_TYPES_TO_ADD_LIMIT.includes(initialData.poolType)) {
    data.push(
      createLimitPointDataObject(
        [
          initialAmounts.analysisTokenIn.amounts.slice(-1)[0],
          initialAmounts.tabTokenIn.amounts.slice(-1)[0],
        ],
        [
          initialAmounts.analysisTokenIn.priceImpact.slice(-1)[0],
          initialAmounts.tabTokenIn.priceImpact.slice(-1)[0],
        ],
        "Initial",
      ),
    );
  }
  if (POOL_TYPES_TO_ADD_LIMIT.includes(customData.poolType)) {
    data.push(
      createLimitPointDataObject(
        [
          customAmounts.analysisTokenIn.amounts.slice(-1)[0],
          customAmounts.tabTokenIn.amounts.slice(-1)[0],
        ],
        [
          customAmounts.analysisTokenIn.priceImpact.slice(-1)[0],
          customAmounts.tabTokenIn.priceImpact.slice(-1)[0],
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
      const amountsList = [
        amounts[index].analysisTokenIn,
        amounts[index].tabTokenIn,
      ];
      const analysisTokenData = findTokenBySymbol(
        pool.tokens,
        analysisToken.symbol,
      );
      const currentTabTokenData = findTokenBySymbol(
        pool.tokens,
        currentTabToken.symbol,
      );
      const tokensList = [
        { in: analysisTokenData, out: currentTabTokenData },
        { in: currentTabTokenData, out: analysisTokenData },
      ];
      const amountLimits = [] as number[];
      const priceImpactLimits = [] as number[];
      amountsList.forEach((amount, index) => {
        const betaLimitsIndexes = getBetaLimitsIndexes({
          amountsA: amount?.amounts || [],
          amountsB: amount?.amountsOut || [],
          rateA: tokensList[index].in?.rate || 1,
          rateB: tokensList[index].out?.rate || 1,
          initialBalanceA: tokensList[index].in?.balance || 0,
          initialBalanceB: tokensList[index].out?.balance || 0,
          beta: pool.poolParams?.beta || 0,
        });
        betaLimitsIndexes.forEach((i) => {
          amountLimits.push(amount?.amounts[i] || 0);
          priceImpactLimits.push(amount?.priceImpact[i] || 0);
        });
      });
      data.push(
        createBetaLimitsDataObject(
          amountLimits,
          priceImpactLimits,
          legends[index],
        ),
      );
    }
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
          range: [, ylimit],
        },
      }}
      className="h-1/2 w-full"
    />
  );
}
