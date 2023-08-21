import { blueDark } from "@radix-ui/colors";
import { PlotType } from "plotly.js";

import { calculatePoolStats } from "#/app/apr/(utils)/calculatePoolStats";
import { Round } from "#/app/apr/(utils)/rounds";
import { trimTrailingValues } from "#/lib/utils";

import HistoricalAPRPlot from "./HistoricalAPRPlot";

export default async function HistoricalAPRChart({
  roundId,
  poolId,
}: {
  roundId: string;
  poolId: string;
}) {
  const HOVERTEMPLATE = "%{x}<br />%{y:.2f}% APR<extra></extra>";
  const LAST_ROUND_ID = parseInt(Round.getAllRounds()[0].value);
  const APRPerRoundCords: { x: string[]; y: number[] } = { x: [], y: [] };
  for (let index = 1; index < LAST_ROUND_ID; index++) {
    const { apr } = await calculatePoolStats({
      poolId,
      roundId: String(index),
    });
    APRPerRoundCords.y.push(apr);
    APRPerRoundCords.x.push(`Round ${index}`);
  }
  const trimmedArray = trimTrailingValues(
    APRPerRoundCords.x.reverse(),
    APRPerRoundCords.y.reverse(),
    0,
  );
  const APRPerRoundData = {
    name: "APR %",
    hovertemplate: HOVERTEMPLATE,
    x: trimmedArray.trimmedIn,
    y: trimmedArray.trimmedOut,
    line: { shape: "spline" } as const,
    type: "scatter" as PlotType,
  };

  const chosenRoundMarkerIDX = APRPerRoundData.x.findIndex(
    (item) => item === `Round ${roundId}`,
  );
  const chosenRoundData = {
    hovertemplate: HOVERTEMPLATE,
    x: [APRPerRoundData.x[chosenRoundMarkerIDX]],
    y: [APRPerRoundData.y[chosenRoundMarkerIDX]],
    mode: "markers",
    name: "Selected Round",
    marker: {
      color: blueDark.blue7,
      size: 15,
      line: {
        color: "white",
        width: 2,
      },
    },
  };

  return <HistoricalAPRPlot data={[APRPerRoundData, chosenRoundData]} />;
}
