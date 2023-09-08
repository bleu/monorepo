"use client";

import { blueDark } from "@radix-ui/colors";
import { Data } from "plotly.js";
import { useState } from "react";

import { PoolStatsResults } from "#/app/apr/api/route";
import Plot from "#/components/Plot";

import FilterTabs from "./FilterTabs";
import HistoricalAPRChartData from "./HistoricalData/HistoricalAPRChart";
import HistoricalSwapFeeChartData from "./HistoricalData/HistoricalSwapFeeChart";
import HistoricalTvlChartData from "./HistoricalData/HistoricalTvlChart";
import HistoricalVolumeChartData from "./HistoricalData/HistoricalVolumeChart";

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
  apiResult,
  roundId,
}: {
  apiResult: PoolStatsResults;
  roundId?: string;
}) {
  const charts = ["APR", "Weekly Swap Fees (USD)", "TVL", "Volume"];
  const [selectedTabs, setselectedTabs] = useState([0]);

  const aprChartData = HistoricalAPRChartData(apiResult);
  const tvlChartData = HistoricalTvlChartData(apiResult);
  const volumeChartData = HistoricalVolumeChartData(apiResult);
  const feeChartData = HistoricalSwapFeeChartData(apiResult, roundId);
  const activeCharts = getActiveData(
    selectedTabs,
    aprChartData,
    feeChartData,
    tvlChartData,
    volumeChartData,
  );

  return (
    <div className="border border-blue6 bg-blue3 rounded p-4 w-full">
      <div className="flex justify-between flex-col sm:flex-row gap-2 sm:gap-0">
        <span className="text-2xl	">Historical Data </span>
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
            title: "Round Number",
          },
          yaxis: {
            fixedrange: true,
            // title: "APR %",
          },
        }}
      />
    </div>
  );
}
