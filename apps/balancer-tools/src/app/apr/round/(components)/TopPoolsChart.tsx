import {
  amberDark,
  blueDark,
  crimsonDark,
  greenDark,
  violetDark,
} from "@radix-ui/colors";
import { PlotType } from "plotly.js";

import Plot from "#/components/Plot";
import votingGauges from "#/data/voting-gauges.json";

import sortDataByX from "../../(utils)/sortChartData";
import { generatePromisesForPoolList } from "../../(utils)/getHistoricalDataForPool";

export default async function TopPoolsChart({ roundId }: { roundId: string }) {
  const POOL_QUANTITY_LIMIT = 10;
  const colors = [
    greenDark.green9,
    violetDark.violet9,
    crimsonDark.crimson8,
    blueDark.blue9,
    amberDark.amber9,
  ];

  const poolList = votingGauges.map((gauge) => gauge.pool.id);
  const results = await generatePromisesForPoolList(poolList);
  const barCords: {
    x: string[];
    y: string[];
    colors: string[];
  } = {
    x: results.map((result) => result.apr.toFixed(2)),
    y: results.map((result) => result.symbol),
    colors: results.map((_, index) => colors[index % colors.length]),
  };

  const [sortedX, sortedY] = sortDataByX(barCords);
  const chartData = {
    hovertemplate: "%{x:.2f}% APR<extra></extra>",
    marker: { color: barCords.colors },
    orientation: "h" as const,
    type: "bar" as PlotType,
    x: sortedX.slice(0, POOL_QUANTITY_LIMIT),
    y: sortedY.slice(0, POOL_QUANTITY_LIMIT),
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
