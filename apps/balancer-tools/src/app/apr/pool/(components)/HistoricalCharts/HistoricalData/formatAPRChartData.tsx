import {
  blueDarkA,
  greenDarkA,
  violetDarkA,
  whiteA,
  yellowDarkA,
} from "@radix-ui/colors";
import { PlotType } from "plotly.js";

import { PoolStatsResults } from "#/app/apr/(utils)/fetchDataTypes";

import { generateAprCords } from "..";

const isAllZeroYValues = (data: { y: number[] }) =>
  data.y.every((value) => value === 0);

export default function formatAPRChartData(
  results: PoolStatsResults,
  yaxis: string,
): Plotly.Data[] {
  const HOVERTEMPLATE = "%{y:.2f}%";

  const vebalAprData = generateAprCords(
    results.perDay,
    (result) => result.apr.breakdown.veBAL,
  );

  const feeAprData = generateAprCords(
    results.perDay,
    (result) => result.apr.breakdown.swapFee,
  );

  const tokenTotalAprData = generateAprCords(
    results.perDay,
    (result) => result.apr.breakdown.tokens.total,
  );

  const rewardsTotalAprData = generateAprCords(
    results.perDay,
    (result) => result.apr.breakdown.rewards.total,
  );

  const totalAprData = generateAprCords(
    results.perDay,
    (result) => result.apr.total,
  );

  const vebalAprPerRoundData = {
    name: "veBAL APR %",
    yaxis: yaxis,
    hovertemplate: HOVERTEMPLATE,
    x: vebalAprData.x,
    y: vebalAprData.y,
    visible: isAllZeroYValues(vebalAprData) ? ("legendonly" as const) : true,
    line: { shape: "linear", color: blueDarkA.blueA9 } as const,
    type: "scatter" as PlotType,
  };

  const feeAprPerRoundData = {
    name: "Fee APR %",
    yaxis: yaxis,
    hovertemplate: HOVERTEMPLATE,
    x: feeAprData.x,
    y: feeAprData.y,
    visible: isAllZeroYValues(feeAprData) ? ("legendonly" as const) : true,
    line: { shape: "linear", color: greenDarkA.greenA9 } as const,
    type: "scatter" as PlotType,
  };

  const aprTokensTotalData = {
    name: `Tokens Yield APR %`,
    yaxis: yaxis,
    hovertemplate: HOVERTEMPLATE,
    x: tokenTotalAprData.x,
    y: tokenTotalAprData.y,
    visible: isAllZeroYValues(tokenTotalAprData)
      ? ("legendonly" as const)
      : true,
    line: { shape: "linear", color: violetDarkA.violetA9 } as const,
    type: "scatter" as PlotType,
  };

  const aprRewardsTotalData = {
    name: `Rewards APR %`,
    yaxis: yaxis,
    hovertemplate: HOVERTEMPLATE,
    x: rewardsTotalAprData.x,
    y: rewardsTotalAprData.y,
    visible: isAllZeroYValues(rewardsTotalAprData)
      ? ("legendonly" as const)
      : true,
    line: { shape: "linear", color: yellowDarkA.yellowA9 } as const,
    type: "scatter" as PlotType,
  };

  const totalAprPerRoundData = {
    name: "Total APR %",
    yaxis: yaxis,
    hovertemplate: HOVERTEMPLATE,
    x: totalAprData.x,
    y: totalAprData.y,
    visible: isAllZeroYValues(totalAprData) ? ("legendonly" as const) : true,
    line: { shape: "linear", color: whiteA.whiteA9 } as const,
    type: "scatter" as PlotType,
  };

  const aprTokensData = Object.values(
    results.perDay[0],
  )[0].apr.breakdown.tokens.breakdown.map(({ symbol }, idx) => {
    const trimmedTokenAprData = generateAprCords(
      results.perDay,
      (result) => result.apr.breakdown.tokens.breakdown[idx]?.yield,
    );
    return {
      name: `${symbol} APR %`,
      yaxis: yaxis,
      showlegend: false,
      hovertemplate: HOVERTEMPLATE,
      x: trimmedTokenAprData.x,
      y: trimmedTokenAprData.y,
      visible: isAllZeroYValues(trimmedTokenAprData)
        ? ("legendonly" as const)
        : true,
      line: { shape: "linear", color: "rgba(0,0,0,0);" } as const,
      type: "scatter" as PlotType,
    };
  });

  const aprRewardsData = Object.values(
    results.perDay[0],
  )[0].apr.breakdown.rewards.breakdown.map(({ symbol }, idx) => {
    const trimmedTokenAprData = generateAprCords(
      results.perDay,
      (result) => result.apr.breakdown.rewards.breakdown[idx]?.value,
    );
    return {
      name: `${symbol} APR %`,
      yaxis: yaxis,
      showlegend: false,
      hovertemplate: HOVERTEMPLATE,
      x: trimmedTokenAprData.x,
      y: trimmedTokenAprData.y,
      visible: isAllZeroYValues(trimmedTokenAprData)
        ? ("legendonly" as const)
        : true,
      line: { shape: "linear", color: "rgba(0,0,0,0);" } as const,
      type: "scatter" as PlotType,
    };
  });

  return [
    totalAprPerRoundData,
    vebalAprPerRoundData,
    feeAprPerRoundData,
    aprTokensTotalData,
    ...aprTokensData,
    aprRewardsTotalData,
    ...aprRewardsData,
  ];
}
