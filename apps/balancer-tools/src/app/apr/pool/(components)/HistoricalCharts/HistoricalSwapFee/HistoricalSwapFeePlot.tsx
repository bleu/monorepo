"use client";

import Plot from "#/components/Plot";

export default function HistoricalSwapFeePlot({
  data,
}: {
  data: Plotly.Data[];
}) {
  return (
    <Plot
      title={`Weekly Swap Fees (USD)`}
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
          title: "Swap Fee $",
        },
      }}
    />
  );
}
