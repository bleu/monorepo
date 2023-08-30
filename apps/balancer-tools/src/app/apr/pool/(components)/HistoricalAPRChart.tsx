import { amberDarkA, blueDarkA } from "@radix-ui/colors";
import { PlotType } from "plotly.js";

import { trimTrailingValues } from "#/lib/utils";
import { fetcher } from "#/utils/fetcher";

import { PoolStatsData, PoolStatsResults } from "../../api/route";
import HistoricalAPRPlot from "./HistoricalAPRPlot";

function generateAndTrimAprCords(
  data: PoolStatsData[],
  getValue: (result: PoolStatsData) => number,
  valueToTrim: number,
): { x: (string | number)[]; y: (string | number)[] } {
  const cords = Object.entries(data).reduce(
    (cords, [_, result]) => {
      cords.x.push(getRoundName(result.roundId));
      cords.y.push(getValue(result));
      return cords;
    },
    { x: [], y: [] } as { x: string[]; y: number[] },
  );

  const trimmedData = trimTrailingValues(
    cords.x.reverse(),
    cords.y.reverse(),
    valueToTrim,
  );
  return {
    x: trimmedData.trimmedIn,
    y: trimmedData.trimmedOut,
  };
}

const getRoundName = (roundId?: string | number) =>
  roundId !== undefined ? `#${roundId}` : "#";

export default async function HistoricalAPRChart({
  roundId,
  poolId,
}: {
  roundId?: string;
  poolId: string;
}) {
  const HOVERTEMPLATE = "%{x}<br />%{y:.2f}% APR<extra></extra>";

  const results: PoolStatsResults = await fetcher(
    `${process.env.NEXT_PUBLIC_SITE_URL}/apr/api/?poolId=${poolId}&sort=roundId`,
  );

  const trimmedVebalAprData = generateAndTrimAprCords(
    results.perRound,
    (result) => result.apr.breakdown.veBAL,
    0,
  );

  const trimmedTotalAprData = generateAndTrimAprCords(
    results.perRound,
    (result) => result.apr.total,
    0,
  );
  const vebalAprPerRoundData = {
    name: "veBAL APR %",
    hovertemplate: HOVERTEMPLATE,
    x: trimmedVebalAprData.x,
    y: trimmedVebalAprData.y,
    line: { shape: "spline" } as const,
    type: "scatter" as PlotType,
  };

  const totalAprPerRoundData = {
    name: "Total APR %",
    hovertemplate: HOVERTEMPLATE,
    x: trimmedTotalAprData.x,
    y: trimmedTotalAprData.y,
    line: { shape: "spline", color: blueDarkA.blueA9 } as const,
    type: "scatter" as PlotType,
  };

  const aprPerRoundData = [totalAprPerRoundData, vebalAprPerRoundData];

  const chosenRoundMarkerIDX = vebalAprPerRoundData.x.findIndex(
    (item) => item === getRoundName(roundId),
  );
  const chosenRoundData = roundId
    ? {
        hovertemplate: HOVERTEMPLATE,
        x: [vebalAprPerRoundData.x[chosenRoundMarkerIDX]],
        y: [vebalAprPerRoundData.y[chosenRoundMarkerIDX]],
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

  return <HistoricalAPRPlot data={[...aprPerRoundData, chosenRoundData]} />;
}
