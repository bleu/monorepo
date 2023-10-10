import { amberDark } from "@radix-ui/colors";
import { PlotType } from "plotly.js";

import { PoolStatsResults } from "#/app/apr/api/route";

import { generateAndTrimAprCords } from "..";

export default function formatTvlChartData(
  apiResult: PoolStatsResults,
  yaxis: string,
): Plotly.Data {
  const trimmedTotalAprData = generateAndTrimAprCords(
    apiResult.perDay,
    (result) => result[0].tvl,
    0,
  );

  return {
    name: "TVL",
    yaxis: yaxis,
    hovertemplate: "%{y:$,.0f}",
    x: trimmedTotalAprData.x,
    y: trimmedTotalAprData.y,
    marker: {
      color: amberDark.amber9,
      opacity: 0.8,
    },
    line: { shape: "spline" } as const,
    type: "bar" as PlotType,
    // @ts-ignore: 2322
    offsetgroup: 2,
  };
}
