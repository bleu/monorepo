import { amberDarkA, blueDarkA } from "@radix-ui/colors";
import { PlotType } from "plotly.js";

import { PoolStatsResults } from "#/app/apr/api/route";

import { generateAndTrimAprCords, getRoundName } from "..";

export default function HistoricalSwapFeeChartData(
  apiResult: PoolStatsResults,
  roundId?: string,
  yaxis: string = 'y',
): Plotly.Data {
  const normalBarColor = blueDarkA.blueA9;
  const highlightedBarColor = amberDarkA.amberA9;

  const trimmedCollectedSwapFeeData = generateAndTrimAprCords(
    apiResult.perRound,
    (result) => result.collectedFeesUSD,
    0,
  );

  const barColors = new Array(trimmedCollectedSwapFeeData.x.length).fill(
    normalBarColor,
  );

  const colletedSwapFeePerRoundData = {
    name: "Collected SwapFee",
    yaxis: yaxis,
    hovertemplate: "Weekly Fees: $%{y:.2f}<extra></extra>",
    x: trimmedCollectedSwapFeeData.x,
    y: trimmedCollectedSwapFeeData.y,
    marker: {
      color: barColors,
    },
    line: { shape: "spline" } as const,
    type: "bar" as PlotType,
  };

  const chosenRoundMarkerIdx = colletedSwapFeePerRoundData.x.findIndex(
    (item) => item === getRoundName(roundId),
  );

  if (chosenRoundMarkerIdx !== -1) {
    barColors[chosenRoundMarkerIdx] = highlightedBarColor;
  }

  return colletedSwapFeePerRoundData;
}
