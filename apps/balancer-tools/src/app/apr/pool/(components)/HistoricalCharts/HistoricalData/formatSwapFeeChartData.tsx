import { amberDarkA, plumDarkA } from "@radix-ui/colors";
import { PlotType } from "plotly.js";

import { PoolStatsResults } from "#/app/apr/api/route";

import { generateAndTrimAprCords, getRoundName } from "..";

export default function HistoricalSwapFeeChartData(
  apiResult: PoolStatsResults,
  roundId?: string,
  yaxis: string = "y",
): Plotly.Data {
  const normalBarColor = plumDarkA.plumA9;
  const highlightedBarColor = amberDarkA.amberA9;

  const trimmedCollectedSwapFeeData = generateAndTrimAprCords(
    apiResult.perRound,
    (result) => result.collectedFeesUSD,
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
    },
    line: { shape: "spline" } as const,
    type: "bar" as PlotType,
  };

  const chosenRoundMarkerIdx = colletedSwapFeePerRoundData.x.findIndex(
    (item) => item === getRoundName(roundId),
  );

  if (chosenRoundMarkerIdx !== -1) {
    trimmedCollectedSwapFeeData.x[chosenRoundMarkerIdx] = highlightedBarColor;
  }

  return colletedSwapFeePerRoundData;
}
