import { yellowDarkA } from "@radix-ui/colors";
import { PlotType } from "plotly.js";

import { PoolStatsResults } from "#/app/apr/api/route";

import { generateAndTrimAprCords } from "..";

export default function formatTvlChartData(
  apiResult: PoolStatsResults,
  yaxis: string,
): Plotly.Data {
  const trimmedTotalAprData = generateAndTrimAprCords(
    apiResult.perRound,
    (result) => result.tvl,
    0,
  );

  return {
    name: "TVL",
    yaxis: yaxis,
    hovertemplate: "%{y:.2f}",
    x: trimmedTotalAprData.x,
    y: trimmedTotalAprData.y,
    line: { shape: "spline", color: yellowDarkA.yellowA9 } as const,
    type: "scatter" as PlotType,
  };
}
