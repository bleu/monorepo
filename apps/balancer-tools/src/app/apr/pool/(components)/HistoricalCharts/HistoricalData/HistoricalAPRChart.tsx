import { blueDarkA, greenDarkA } from "@radix-ui/colors";
import { PlotType } from "plotly.js";

import { PoolStatsResults } from "#/app/apr/api/route";

import { generateAndTrimAprCords } from "..";

export default function HistoricalAPRChartData(
  apiResult: PoolStatsResults,
  yaxis: string,
): Plotly.Data[] {
  const HOVERTEMPLATE = "%{y:.2f}%";
  const trimmedVebalAprData = generateAndTrimAprCords(
    apiResult.perRound,
    (result) => result.apr.breakdown.veBAL,
    0,
  );

  const trimmedFeeAprData = generateAndTrimAprCords(
    apiResult.perRound,
    (result) => result.apr.breakdown.swapFee,
    0,
  );

  const trimmedTotalAprData = generateAndTrimAprCords(
    apiResult.perRound,
    (result) => result.apr.total,
    0,
  );
  const vebalAprPerRoundData = {
    name: "veBAL APR %",
    yaxis: yaxis,
    hovertemplate: HOVERTEMPLATE,
    x: trimmedVebalAprData.x,
    y: trimmedVebalAprData.y,
    line: { shape: "spline" } as const,
    type: "scatter" as PlotType,
  };

  const feeAprPerRoundData = {
    name: "Fee APR %",
    yaxis: yaxis,
    hovertemplate: HOVERTEMPLATE,
    x: trimmedFeeAprData.x,
    y: trimmedFeeAprData.y,
    line: { shape: "spline", color: greenDarkA.greenA9 } as const,
    type: "scatter" as PlotType,
  };

  const totalAprPerRoundData = {
    name: "Total APR %",
    yaxis: yaxis,
    hovertemplate: HOVERTEMPLATE,
    x: trimmedTotalAprData.x,
    y: trimmedTotalAprData.y,
    line: { shape: "spline", color: blueDarkA.blueA9 } as const,
    type: "scatter" as PlotType,
  };

  return [totalAprPerRoundData, vebalAprPerRoundData, feeAprPerRoundData];
}
