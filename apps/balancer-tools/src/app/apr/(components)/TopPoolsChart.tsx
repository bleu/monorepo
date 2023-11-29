"use client";

import { formatDate } from "@bleu-fi/utils";
import { greenDarkA } from "@radix-ui/colors";
import { useRouter } from "next/navigation";
import { Data, PlotMouseEvent, PlotType } from "plotly.js";

import Plot from "#/components/Plot";

import { PoolStats } from "../(utils)/fetchDataTypes";
import { generatePoolPageLink } from "../(utils)/getFilteredUrl";

export default function TopPoolsChart({
  startAt,
  endAt,
  poolsData,
}: {
  startAt: Date;
  endAt: Date;
  poolsData: PoolStats[];
}) {
  const shades = Object.values(greenDarkA).map((color) => color.toString());
  const colors = [...shades.slice(4, 10).reverse(), ...shades.slice(4, 10)];
  const yAxisLabels = poolsData
    .filter((pool) => pool.apr.total > 0)
    .map((result) => [
      result.tokens
        .map(
          (t) =>
            `${t.symbol}${t.weight ? `-${(t.weight! * 100).toFixed()}%` : ""}`,
        )
        .join(" "),
      `${result.apr.total.toFixed()}% APR`,
    ]);

  const longestyAxisLabelLength = Math.max(
    ...yAxisLabels.map(
      ([tokenNames, aprLabel]) => tokenNames.length + aprLabel.length,
    ),
  );

  const paddedYAxisLabels = yAxisLabels.map(([tokenNames, aprValue]) =>
    [
      tokenNames.padEnd(longestyAxisLabelLength - aprValue.length, " "),
      aprValue,
    ].join(" "),
  );

  const chartData: Data = {
    hoverinfo: "none",
    marker: {
      color: poolsData.map((_, index) => colors[index % colors.length]),
    },
    orientation: "h" as const,
    type: "bar" as PlotType,
    x: poolsData.map((result) => result.apr.total.toFixed(2)),
    y: paddedYAxisLabels,
  };

  const router = useRouter();
  function onClickHandler(event: PlotMouseEvent) {
    const clickedRoundData = poolsData[event.points[0].pointIndex];
    if (clickedRoundData.poolId === null) return;
    const poolRedirectURL = generatePoolPageLink(
      startAt,
      endAt,
      null,
      clickedRoundData.poolId,
    );
    router.push(poolRedirectURL);
  }

  return (
    <div className="flex justify-between border border-blue6 bg-blue3 rounded p-4 cursor-pointer">
      <Plot
        onClick={onClickHandler}
        title={`Top APR Pools from ${formatDate(startAt)} to ${formatDate(
          endAt,
        )}`}
        toolTip="Values are averaged for the given dates."
        data={[chartData]}
        hovermode={false}
        config={{ displayModeBar: false }}
        layout={{
          showlegend: false,
          barmode: "overlay",
          autosize: true,
          dragmode: false,
          margin: { t: 30, r: 20, l: 20, b: 30 },
          font: {
            family: "monospace",
          },
          xaxis: {
            title: `APR %`,
            fixedrange: true,
            type: "log",
          },
          yaxis: {
            fixedrange: true,
            autorange: "reversed",
            position: 0,
            side: "right",
            // @ts-ignore: 2322
            tickson: "boundaries",
          },
        }}
      />
    </div>
  );
}
