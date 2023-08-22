import {
  amberDark,
  blueDark,
  crimsonDark,
  greenDark,
  violetDark,
} from "@radix-ui/colors";
import { PlotType } from "plotly.js";

import { calculatePoolStats } from "#/app/apr/(utils)/calculatePoolStats";
import Plot from "#/components/Plot";
import votingGauges from "#/data/voting-gauges.json";
import sortDataByX from "#/app/apr/(utils)/sortChartData";


export default async function TopPoolsChart({ roundId }: { roundId: string }) {
  const POOL_QUANTITY_LIMIT = 16;
  const colors = [
    greenDark.green9,
    violetDark.violet9,
    crimsonDark.crimson8,
    blueDark.blue9,
    amberDark.amber9,
  ];

  const barCords: {
    x: string[];
    y: string[];
    colors: string[];
  } = { x: [], y: [], colors: [] };
  for (let index = 0; index < votingGauges.length; index++) {
    if (barCords.x.length >= POOL_QUANTITY_LIMIT) {
      break;
    }

    const gauge = votingGauges[index];
    const { apr } = await calculatePoolStats({
      roundId,
      poolId: gauge.pool.id,
    });

    if (apr && apr > 0.01) {
      barCords.x.push(apr.toFixed(2));
      barCords.y.push(gauge.pool.symbol);
      barCords.colors.push(colors[index % colors.length]);
    }
  }

  const [sortedX, sortedY] = sortDataByX(barCords);
  const chartData = {
    hovertemplate: "%{x:.2f}% APR<extra></extra>",
    marker: { color: barCords.colors },
    orientation: "h" as const,
    type: "bar" as PlotType,
    x: sortedX,
    y: sortedY,
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
          yaxis: { fixedrange: true },
        }}
      />
    </div>
  );
}
