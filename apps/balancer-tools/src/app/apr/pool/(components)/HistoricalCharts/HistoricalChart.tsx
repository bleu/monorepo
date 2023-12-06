"use client";

import { formatDate } from "@bleu-fi/utils";
import { blueDark } from "@radix-ui/colors";
import { Data } from "plotly.js";
import { useState } from "react";

import { PoolStatsResults } from "#/app/apr/(utils)/fetchDataTypes";
import Plot from "#/components/Plot";

import FilterTabs from "./FilterTabs";
import formatAPRChartData from "./HistoricalData/formatAPRChartData";
import formatSwapFeeChartData from "./HistoricalData/formatSwapFeeChartData";
import formatTvlChartData from "./HistoricalData/formatTvlChartData";
import formatVolumeChartData from "./HistoricalData/formatVolumeChartData";

function getActiveData(
  enabledIndices: number[],
  ...arrays: (Data[] | Data)[]
): Data[] {
  const activeVars: Data[] = [];

  for (const idx of enabledIndices) {
    if (Array.isArray(arrays[idx])) {
      activeVars.push(...(arrays[idx] as Data[]));
    } else {
      activeVars.push(arrays[idx] as Data);
    }
  }

  return activeVars;
}

export default function HistoricalChartWrapper({
  results,
}: {
  results: PoolStatsResults;
}) {
  const charts = ["APR", "Weekly Swap Fees", "TVL", "Volume"];
  const [selectedTabs, setselectedTabs] = useState([0]);

  const feeChartData = formatSwapFeeChartData(results, "y2");
  const tvlChartData = formatTvlChartData(results, "y3");
  const volumeChartData = formatVolumeChartData(results, "y4");
  const aprChartData = formatAPRChartData(results, "y5");
  const activeCharts = getActiveData(
    selectedTabs,
    aprChartData,
    feeChartData,
    tvlChartData,
    volumeChartData,
  );

  const createdAt = Object.values(results.perDay[0])[0].externalCreatedAt;

  // This is needed to enable an axis that isn't meant to be shown
  // If the anchor axis isn't enabled the other it'll only show one trace at a time
  activeCharts.push({
    name: " ",
    yaxis: "y",
    x: [],
    y: [],
  });

  return (
    <div className="border border-blue6 bg-blue3 rounded p-4 w-full">
      <div className="flex justify-between flex-col sm:flex-row gap-2 sm:gap-0">
        <span className="text-2xl">Historical Data</span>
        <FilterTabs
          tabs={charts}
          selectedTabs={selectedTabs}
          setSelectedTabs={setselectedTabs}
        />
      </div>
      <Plot
        data={activeCharts}
        config={{ displayModeBar: false }}
        layout={{
          plot_bgcolor: blueDark.blue3,
          margin: { t: 30, r: 20, l: 20, b: 30 },
          autosize: true,
          legend: { orientation: "h", y: -0.2, xanchor: "center", x: 0.5 },
          hovermode: "x unified",
          hoverlabel: {
            bordercolor: blueDark.blue9,
            bgcolor: blueDark.blue6,
          },
          xaxis: {
            dtick: 1,
            title: "Date",
            gridcolor: blueDark.blue6,
            linecolor: blueDark.blue6,
            mirror: true,
          },
          yaxis: {
            // This is a dull axis, not meant to be shown
            // It's needed since all other axis are anchored on this one
            // If this axis isn't enabled the others it'll only show one at a time
            visible: false,
            position: 0.5,
          },
          yaxis2: {
            gridcolor: blueDark.blue6,
            linecolor: blueDark.blue6,
            mirror: true,
            fixedrange: true,
            title: "Swap Fee",
            overlaying: "y",
            side: "right",
            anchor: "free",
            // @ts-ignore: 2322
            autoshift: true,
          },
          yaxis3: {
            gridcolor: blueDark.blue6,
            linecolor: blueDark.blue6,
            mirror: true,
            fixedrange: true,
            title: "TVL",
            overlaying: "y",
            side: "right",
            anchor: "free",
            // @ts-ignore: 2322
            autoshift: true,
          },
          yaxis4: {
            gridcolor: blueDark.blue6,
            linecolor: blueDark.blue6,
            mirror: true,
            fixedrange: true,
            title: "Volume",
            overlaying: "y",
            side: "right",
            anchor: "free",
            // @ts-ignore: 2322
            autoshift: true,
          },
          yaxis5: {
            gridcolor: blueDark.blue6,
            linecolor: blueDark.blue6,
            mirror: true,
            fixedrange: true,
            title: "APR %",
            overlaying: "y",
            anchor: "free",
            // @ts-ignore: 2322
            autoshift: true,
          },
        }}
      />
      <div className="text-center text-gray-400 text-sm">
        Historical data is only available since pool creation date{" "}
        {formatDate(createdAt)}
      </div>
    </div>
  );
}
