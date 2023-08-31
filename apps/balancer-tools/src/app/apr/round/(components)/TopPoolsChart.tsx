import { greenDarkA } from "@radix-ui/colors";
import { PlotType } from "plotly.js";

import Plot from "#/components/Plot";
import { fetcher } from "#/utils/fetcher";

import { PoolStatsResults } from "../../api/route";

export default async function TopPoolsChart({
  roundId,
  filteredApiUrl,
}: {
  roundId: string;
  filteredApiUrl: string;
}) {
  const shades = Object.values(greenDarkA).map((color) => color.toString());
  const colors = [...shades.slice(4, 10).reverse(), ...shades.slice(4, 10)];

  const topAprApi = await fetcher<PoolStatsResults>(filteredApiUrl);

  const chartData = {
    hovertemplate: "%{x:.2f}% APR<extra></extra>",
    marker: {
      color: topAprApi.perRound.map(
        (_, index) => colors[index % colors.length],
      ),
    },
    orientation: "h" as const,
    type: "bar" as PlotType,
    x: topAprApi.perRound.map((result) =>
      result.apr.breakdown.veBAL.toFixed(2),
    ),
    y: topAprApi.perRound.map((result) => result.symbol),
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
