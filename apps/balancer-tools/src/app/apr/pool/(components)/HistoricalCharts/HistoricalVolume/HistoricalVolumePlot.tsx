"use client";

import Plot from "#/components/Plot";

export default function HistoricalVolumePlot({
  data,
}: {
  data: Plotly.Data[];
}) {
  return (
    <Plot
      title={`Volume`}
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
          title: "Volume",
        },
      }}
    />
  );
}
