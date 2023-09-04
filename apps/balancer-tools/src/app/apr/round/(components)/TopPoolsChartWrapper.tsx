import { greenDarkA } from "@radix-ui/colors";
import { Data, PlotType } from "plotly.js";

import { fetcher } from "#/utils/fetcher";

import { PoolStatsResults } from "../../api/route";
import TopPoolsChart from "./TopPoolsChart";

export default async function TopPoolsChartWrapper({
  roundId,
  filteredApiUrl,
}: {
  roundId: string;
  filteredApiUrl: string;
}) {
  const shades = Object.values(greenDarkA).map((color) => color.toString());
  const colors = [...shades.slice(4, 10).reverse(), ...shades.slice(4, 10)];

  const topAprApi = await fetcher<PoolStatsResults>(filteredApiUrl);

  const chartData: Data = {
    hoverinfo: "none",
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
    y: topAprApi.perRound.map(
      (result) =>
        `${result.tokens
          .map(
            (t) =>
              `${t.symbol}${t.weight ? `-${parseFloat(t.weight) * 100}%` : ""}`,
          )
          .join(" ")}: ${result.apr.breakdown.veBAL.toFixed(2)}% APR`,
    ),
  };

  return (
    <TopPoolsChart
      roundId={roundId}
      chartData={[chartData]}
      ApiResult={topAprApi}
    />
  );
}
