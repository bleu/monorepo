"use client";

import { amberDarkA } from "@radix-ui/colors";

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
            title: "Round Number",
          },
          yaxis: {
            title: "APR %",
          },
          colorway: [amberDarkA.amberA11],
        }}
      />
    </div>
  );
}
