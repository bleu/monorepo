import { amberDark } from "@radix-ui/colors";
import { PlotType } from "plotly.js";

import { PoolStatsResults } from "#/app/apr/(utils)/fetchDataTypes";

import { generateAprCords } from "..";

export default function formatTvlChartData(
  results: PoolStatsResults,
  yaxis: string,
): Plotly.Data {
  const tvlData = generateAprCords(results.perDay, (result) => result.tvl);

  return {
    name: "TVL",
    yaxis: yaxis,
    hovertemplate: "TVL (USD): %{y:$,.0f}<extra></extra>",
    x: tvlData.x,
    y: tvlData.y,
    marker: {
      color: amberDark.amber9,
      opacity: 0.8,
    },
    line: { shape: "linear" } as const,
    type: "bar" as PlotType,
    // @ts-ignore: 2322
    offsetgroup: 2,
  };
}
