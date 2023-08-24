import {
  amberDark,
  blueDark,
  crimsonDark,
  greenDark,
  violetDark,
} from "@radix-ui/colors";
import { PlotType } from "plotly.js";

import Plot from "#/components/Plot";
import { fetcher } from "#/utils/fetcher";

import { PoolStatsData } from "../../api/route";

export default async function TopPoolsChart({ roundId }: { roundId: string }) {
  const colors = [
    greenDark.green9,
    violetDark.violet9,
    crimsonDark.crimson8,
    blueDark.blue9,
    amberDark.amber9,
  ];

  const topAprApi: PoolStatsData[] = Object.values(
    await fetcher(
      `${process.env.NEXT_PUBLIC_SITE_URL}/apr/api/?roundid=${roundId}&sort=apr&limit=10&order=desc`,
    ),
  );

  const chartData = {
    hovertemplate: "%{x:.2f}% APR<extra></extra>",
    marker: {
      color: topAprApi.map((_, index) => colors[index % colors.length]),
    },
    orientation: "h" as const,
    type: "bar" as PlotType,
    x: topAprApi.map((result) => result.apr.toFixed(2)),
    y: topAprApi.map((result) => result.symbol),
  };

  return (
    <div className="flex justify-between border border-blue6 bg-blue3 rounded p-4 cursor-pointer">
      <Plot
        title={`Top APR Pools of Round ${roundId}`}
        toolTip="Top pools with highest APR."
        data={[chartData]}
        layout={{
          barmode: "overlay",
          autosize: true,
          dragmode: false,
          xaxis: {
            title: `APR %`,
            fixedrange: true,
          },
          yaxis: { fixedrange: true, autorange: "reversed" },
        }}
      />
    </div>
  );
}
