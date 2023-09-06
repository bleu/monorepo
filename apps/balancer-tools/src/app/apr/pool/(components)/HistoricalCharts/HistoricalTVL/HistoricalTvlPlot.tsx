"use client";

import Plot from "#/components/Plot";

export default function HistoricalTvlPlot({ data }: { data: Plotly.Data[] }) {
  return (
    <Plot
      title={`Total Value Locked (TVL)`}
      data={data}
      layout={{
        autosize: true,
        xaxis: {
          fixedrange: true,
          dtick: 1,
          title: "Round Number",
        },
        yaxis: {
          fixedrange: true,
          title: "TVL",
        },
      }}
    />
  );
}
