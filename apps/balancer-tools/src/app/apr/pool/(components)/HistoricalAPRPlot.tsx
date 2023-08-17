"use client";

import React from "react";

import Plot from "#/components/Plot";

export default function HistoricalAPRPlot({ data }: { data: Plotly.Data[] }) {
  return (
    <div className="flex justify-between border border-blue6 bg-blue3 rounded p-4 cursor-pointer">
      <Plot
        title={`Historical APR`}
        data={data}
        layout={{
          autosize: true,
          xaxis: {
            autorange: "reversed",
            title: "Round Number",
          },
          yaxis: {
            title: "APR %",
          },
        }}
      />
    </div>
  );
}
