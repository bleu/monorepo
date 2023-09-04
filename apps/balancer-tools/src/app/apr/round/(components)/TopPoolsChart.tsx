"use client";

import { networkFor } from "@bleu-balancer-tools/utils";
import { useRouter } from "next/navigation";
import { Data, PlotMouseEvent } from "plotly.js";

import Plot from "#/components/Plot";

import { PoolStatsResults } from "../../api/route";

export default function TopPoolsChart({
  roundId,
  chartData,
  ApiResult,
}: {
  roundId: string;
  chartData: Data[];
  ApiResult: PoolStatsResults;
}) {
  const router = useRouter();
  function onClickHandler(event: PlotMouseEvent) {
    const clickedRoundData = ApiResult.perRound[event.points[0].pointIndex];
    const poolRedirectURL = `/apr/pool/${networkFor(
      clickedRoundData.network,
    )}/${clickedRoundData.poolId}/round/${roundId}`;
    router.push(poolRedirectURL);
  }

  return (
    <div className="flex justify-between border border-blue6 bg-blue3 rounded p-4 cursor-pointer">
      <Plot
        onClick={onClickHandler}
        title={`Top APR Pools of Round ${roundId}`}
        toolTip="Top pools with highest APR."
        data={chartData}
        hovermode={false}
        config={{ displayModeBar: false }}
        layout={{
          showlegend: false,
          barmode: "overlay",
          autosize: true,
          dragmode: false,
          margin: { t: 30, r: 20, l: 20, b: 30 },
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
            tickfont_family: "Arial Black",
          },
        }}
      />
    </div>
  );
}
