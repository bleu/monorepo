import { amberDarkA, blueDarkA } from "@radix-ui/colors";
import { PlotType } from "plotly.js";

import { BASE_URL, PoolStatsResults } from "#/app/apr/api/route";
import { fetcher } from "#/utils/fetcher";

import { generateAndTrimAprCords, getRoundName } from "..";
import HistoricalSwapFeePlot from "./HistoricalSwapFeePlot";

export default async function HistoricalSwapFeeChart({
  roundId,
  poolId,
}: {
  roundId?: string;
  poolId: string;
}) {
  const HOVERTEMPLATE = "%{x}<br />$%{y:.2f}<extra></extra>";

  const results: PoolStatsResults = await fetcher(
    `${BASE_URL}/apr/api/?poolId=${poolId}&sort=roundId`,
  );

  const trimmedCollectedSwapFeeData = generateAndTrimAprCords(
    results.perRound,
    (result) => result.collectedFeesUSD,
    0,
  );

  const normalBarColor = blueDarkA.blueA9;
  const highlightedBarColor = amberDarkA.amberA9;

  const barColors = new Array(trimmedCollectedSwapFeeData.x.length).fill(
    normalBarColor,
  );

  const colletedSwapFeePerRoundData = {
    name: "Collected SwapFee",
    hovertemplate: HOVERTEMPLATE,
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

  if (chosenRoundMarkerIDX !== -1) {
    barColors[chosenRoundMarkerIDX] = highlightedBarColor;
  }

  return <HistoricalSwapFeePlot data={[colletedSwapFeePerRoundData]} />;
}
