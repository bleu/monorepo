import { amberDarkA, blueDarkA } from "@radix-ui/colors";
import { PlotType } from "plotly.js";

import { BASE_URL, PoolStatsResults } from "#/app/apr/api/route";
import { fetcher } from "#/utils/fetcher";

import { generateAndTrimAprCords, getRoundName } from "..";
import HistoricalVolumePlot from "./HistoricalVolumePlot";

export default async function HistoricalVolumeChart({
  roundId,
  poolId,
}: {
  roundId?: string;
  poolId: string;
}) {
  const HOVERTEMPLATE = "%{x}<br />%{y:.2f} Volume<extra></extra>";

  const results: PoolStatsResults = await fetcher(
    `${BASE_URL}/apr/api/?poolId=${poolId}&sort=roundId`,
  );

  const trimmedTotalAprData = generateAndTrimAprCords(
    results.perRound,
    (result) => result.volume,
    0,
  );

  const totalVolumePerRoundData = {
    name: "Volume",
    hovertemplate: HOVERTEMPLATE,
    x: trimmedTotalAprData.x,
    y: trimmedTotalAprData.y,
    line: { shape: "spline", color: blueDarkA.blueA9 } as const,
    type: "scatter" as PlotType,
  };

  const aprPerRoundData = [totalVolumePerRoundData];

  const chosenRoundMarkerIDX = totalVolumePerRoundData.x.findIndex(
    (item) => item === getRoundName(roundId),
  );
  const chosenRoundData = roundId
    ? {
        hovertemplate: HOVERTEMPLATE,
        x: [totalVolumePerRoundData.x[chosenRoundMarkerIDX]],
        y: [totalVolumePerRoundData.y[chosenRoundMarkerIDX]],
        mode: "markers",
        name: "Selected Round",
        marker: {
          color: amberDarkA.amberA9,
          size: 15,
          line: {
            color: "white",
            width: 2,
          },
        },
      }
    : {};

  return <HistoricalVolumePlot data={[...aprPerRoundData, chosenRoundData]} />;
}
