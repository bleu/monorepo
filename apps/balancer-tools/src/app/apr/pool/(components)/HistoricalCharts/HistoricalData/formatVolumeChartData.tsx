import { blueDarkA } from "@radix-ui/colors";
import { PlotType } from "plotly.js";

import { PoolStatsResults } from "#/app/apr/(utils)/fetchDataTypes";

import { generateAprCords } from "..";

export default function formatVolumeChartData(
  results: PoolStatsResults,
  yaxis: string,
): Plotly.Data {
  const HOVERTEMPLATE = "$%{y:.2f}";

  const volumeData = generateAprCords(
    results.perDay,
    (result) => result.volume,
  );

  return {
    name: "Volume",
    yaxis: yaxis,
    hovertemplate: HOVERTEMPLATE,
    x: volumeData.x,
    y: volumeData.y,
    marker: {
      color: blueDarkA.blueA9,
      opacity: 0.8,
    },
    line: { shape: "spline" } as const,
    type: "bar" as PlotType,
    // @ts-ignore: 2322
    offsetgroup: 3,
  };
}
