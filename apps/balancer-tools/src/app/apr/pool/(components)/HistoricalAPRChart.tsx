import { blueDark } from "@radix-ui/colors";
import { PlotType } from "plotly.js";

import { trimTrailingValues } from "#/lib/utils";

import { generatePromisesForHistoricalPoolData } from "../../(utils)/getHistoricalDataForPool";
import HistoricalAPRPlot from "./HistoricalAPRPlot";

export default async function HistoricalAPRChart({
  roundId,
  poolId,
}: {
  roundId?: string;
  poolId: string;
}) {
  const HOVERTEMPLATE = "%{x}<br />%{y:.2f}% APR<extra></extra>";
  const APRPerRoundCords: { x: string[]; y: number[] } = { x: [], y: [] };

  const results = await generatePromisesForHistoricalPoolData(poolId);
  results.map((result) => {
    APRPerRoundCords.x.push(`Round ${result.roundId}`);
    APRPerRoundCords.y.push(result.apr);
  });

  const trimmedAPRData = trimTrailingValues(
    APRPerRoundCords.x.reverse(),
    APRPerRoundCords.y.reverse(),
    0,
  );

  const APRPerRoundData = {
    name: "APR %",
    hovertemplate: HOVERTEMPLATE,
    x: trimmedAPRData.trimmedIn,
    y: trimmedAPRData.trimmedOut,
    line: { shape: "spline" } as const,
    type: "scatter" as PlotType,
  };

  const chosenRoundMarkerIDX = APRPerRoundData.x.findIndex(
    (item) => item === `Round ${roundId}`,
  );
  const chosenRoundData = roundId
    ? {
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
      }
    : {};

  return <HistoricalAPRPlot data={[APRPerRoundData, chosenRoundData]} />;
}
