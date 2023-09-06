"use client";

import { usePathname, useRouter } from "next/navigation";
import { PlotMouseEvent } from "plotly.js";

import Plot from "#/components/Plot";

export default function HistoricalAPRPlot({ data }: { data: Plotly.Data[] }) {
  const router = useRouter();
  const currentPathname = usePathname();
  function onClickHandler(event: PlotMouseEvent) {
    const newPath = currentPathname.replace(/\/round\/\d+$/, "");
    router.push(`${newPath}/round/${event.points[0].x}`);
  }

  return (
    <div className="flex justify-between border border-blue6 bg-blue3 rounded py-4 sm:p-4 cursor-pointer">
      <Plot
        onClick={onClickHandler}
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
