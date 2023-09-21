import { redDarkA } from "@radix-ui/colors";
import { PlotType } from "plotly.js";

import { PoolStatsResults } from "#/app/apr/api/route";

import { generateAndTrimAprCords } from "..";

export default function formatVolumeChartData(
  apiResult: PoolStatsResults,
  yaxis: string,
): Plotly.Data {
  const HOVERTEMPLATE = "$%{y:.2f}";

  const trimmedTotalAprData = generateAndTrimAprCords(
    apiResult.perDay,
    (result) => result[0].volume,
    0,
  );

  return {
    name: "Volume",
    yaxis: yaxis,
    hovertemplate: HOVERTEMPLATE,
    x: trimmedTotalAprData.x,
    y: trimmedTotalAprData.y,
    line: { shape: "spline", color: redDarkA.redA9 } as const,
    type: "bar" as PlotType,
    // @ts-ignore: 2322
    offsetgroup: 3,
  };
}
