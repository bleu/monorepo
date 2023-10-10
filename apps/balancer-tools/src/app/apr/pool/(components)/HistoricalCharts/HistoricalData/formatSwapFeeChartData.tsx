import { plumDarkA } from "@radix-ui/colors";
import { PlotType } from "plotly.js";

import { PoolStatsResults } from "#/app/apr/api/route";

import { generateAndTrimAprCords } from "..";

export default function HistoricalSwapFeeChartData(
  apiResult: PoolStatsResults,
  yaxis: string = "y",
): Plotly.Data {
  const normalBarColor = plumDarkA.plumA9;

  const trimmedCollectedSwapFeeData = generateAndTrimAprCords(
    apiResult.perDay,
    (result) => result[0].collectedFeesUSD,
    0,
  );

  const colletedSwapFeePerRoundData = {
    name: "Collected SwapFee",
    yaxis: yaxis,
    hovertemplate: "Weekly Fees: $%{y:.2f}<extra></extra>",
    x: trimmedCollectedSwapFeeData.x,
    y: trimmedCollectedSwapFeeData.y,
    marker: {
      color: normalBarColor,
      opacity: 1,
    },
    line: { shape: "spline" } as const,
    type: "bar" as PlotType,
    offsetgroup: 1,
  };
  return colletedSwapFeePerRoundData;
}
