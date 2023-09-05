import { amberDarkA, blueDarkA, greenDarkA } from "@radix-ui/colors";
import { PlotType } from "plotly.js";

import { BASE_URL, PoolStatsResults } from "#/app/apr/api/route";
import { fetcher } from "#/utils/fetcher";

import { generateAndTrimAprCords, getRoundName } from "..";
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
    `${BASE_URL}/apr/api/?poolId=${poolId}&sort=roundId`,
  );

  const trimmedVebalAprData = generateAndTrimAprCords(
    results.perRound,
    (result) => result.apr.breakdown.veBAL,
    0,
  );

  const trimmedFeeAprData = generateAndTrimAprCords(
    results.perRound,
    (result) => result.apr.breakdown.swapFee,
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

  const feeAprPerRoundData = {
    name: "Fee APR %",
    hovertemplate: HOVERTEMPLATE,
    x: trimmedFeeAprData.x,
    y: trimmedFeeAprData.y,
    line: { shape: "spline", color: greenDarkA.greenA9 } as const,
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

  const aprPerRoundData = [
    totalAprPerRoundData,
    vebalAprPerRoundData,
    feeAprPerRoundData,
  ];

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
