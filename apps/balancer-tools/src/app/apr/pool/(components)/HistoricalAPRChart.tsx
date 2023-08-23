import { blueDark } from "@radix-ui/colors";
import { PlotType } from "plotly.js";

import { trimTrailingValues } from "#/lib/utils";
import { fetcher } from "#/utils/fetcher";

import { PoolStatsResults } from "../../api/route";
import HistoricalAPRPlot from "./HistoricalAPRPlot";

export default async function HistoricalAPRChart({
  roundId,
  poolId,
}: {
  roundId?: string;
  poolId: string;
}) {
  const HOVERTEMPLATE = "%{x}<br />%{y:.2f}% APR<extra></extra>";

  const results: PoolStatsResults = await fetcher(
    `${process.env.NEXT_PUBLIC_SITE_URL}/apr/api/?poolid=${poolId}`,
  );

  const APRPerRoundCords = Object.entries(results.perRound).reduce(
    (cords, [roundId, result]) => {
      cords.x.push(`Round ${roundId}`);
      cords.y.push(result.apr);
      return cords;
    },
    { x: [], y: [] } as { x: string[]; y: number[] }
  );
  

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
