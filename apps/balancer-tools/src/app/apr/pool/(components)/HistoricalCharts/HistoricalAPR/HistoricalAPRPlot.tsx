"use client";

import Plot from "#/components/Plot";

export default function HistoricalAPRPlot({ data }: { data: Plotly.Data[] }) {
  return (
    <div className="flex justify-between bg-blue3 rounded p-4 cursor-pointer z-50">
      <Plot
        title={`Historical APR`}
        data={data}
        config={{ displayModeBar: false }}
        layout={{
          margin: { t: 30, r: 20, l: 20, b: 30 },
          autosize: true,
          legend: { orientation: "h", y: -0.2, xanchor: "center", x: 0.5 },
          xaxis: {
            dtick: 1,
            title: "Round Number",
          },
          yaxis: {
            fixedrange: true,
            title: "APR %",
          },
        }}
      />
    </div>
  );
}
