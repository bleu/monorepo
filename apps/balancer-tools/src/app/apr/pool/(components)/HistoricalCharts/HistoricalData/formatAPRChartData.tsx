import {
  blueDarkA,
  greenDarkA,
  violetDarkA,
  whiteA,
  yellowDarkA,
} from "@radix-ui/colors";
import { PlotType } from "plotly.js";

import { PoolStatsResults } from "#/app/apr/api/route";

import { generateAprCords } from "..";

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
    line: { shape: "spline", color: blueDarkA.blueA9 } as const,
    type: "scatter" as PlotType,
  };

  const feeAprPerRoundData = {
    name: "Fee APR %",
    yaxis: yaxis,
    hovertemplate: HOVERTEMPLATE,
    x: feeAprData.x,
    y: feeAprData.y,
    line: { shape: "spline", color: greenDarkA.greenA9 } as const,
    type: "scatter" as PlotType,
  };

  const aprTokensTotalData = {
    name: `Tokens Yield APR %`,
    yaxis: yaxis,
    hovertemplate: HOVERTEMPLATE,
    x: tokenTotalAprData.x,
    y: tokenTotalAprData.y,
    line: { shape: "spline", color: violetDarkA.violetA9 } as const,
    type: "scatter" as PlotType,
  };

  const aprRewardsTotalData = {
    name: `Rewards APR %`,
    yaxis: yaxis,
    hovertemplate: HOVERTEMPLATE,
    x: rewardsTotalAprData.x,
    y: rewardsTotalAprData.y,
    line: { shape: "spline", color: yellowDarkA.yellowA9 } as const,
    type: "scatter" as PlotType,
  };

  const totalAprPerRoundData = {
    name: "Total APR %",
    yaxis: yaxis,
    hovertemplate: HOVERTEMPLATE,
    x: totalAprData.x,
    y: totalAprData.y,
    line: { shape: "spline", color: whiteA.whiteA9 } as const,
    type: "scatter" as PlotType,
  };

  // const firstDay = Object.keys(results.perDay)[0];
  // const aprTokensData = results.perDay[
  //   firstDay
  // ][0].apr.breakdown.tokens.breakdown.map(({ symbol }, idx) => {
  //   const trimmedTokenAprData = generateAprCords(
  //     results.perDay,
  //     (result) => result[0].apr.breakdown.tokens.breakdown[idx].yield,
  //   );
  //   return {
  //     name: `${symbol} APR %`,
  //     yaxis: yaxis,
  //     showlegend: false,
  //     hovertemplate: HOVERTEMPLATE,
  //     x: trimmedTokenAprData.x,
  //     y: trimmedTokenAprData.y,
  //     line: { shape: "spline", color: "rgba(0,0,0,0);" } as const,
  //     type: "scatter" as PlotType,
  //   };
  // });
  // const aprRewardsData = results.perDay[
  //   firstDay
  // ][0].apr.breakdown.rewards.breakdown.map(({ symbol }, idx) => {
  //   const aprRewardsData = generateAprCords(
  //     results.perDay,
  //     (result) => result[0].apr.breakdown.rewards.breakdown[idx].value,
  //     0
  //   );
  //   return {
  //     name: `${symbol} APR %`,
  //     yaxis: yaxis,
  //     showlegend: false,
  //     hovertemplate: HOVERTEMPLATE,
  //     x: aprRewardsData.x,
  //     y: aprRewardsData.y,
  //     line: { shape: "spline", color: "rgba(0,0,0,0);" } as const,
  //     type: "scatter" as PlotType,
  //   };
  // });

  return [
    totalAprPerRoundData,
    vebalAprPerRoundData,
    feeAprPerRoundData,
    aprTokensTotalData,
    // ...aprTokensData,
    aprRewardsTotalData,
    // ...aprRewardsData,
  ];
}
