"use client";

import { PlotType } from "plotly.js";

import Plot from "#/components/Plot";

export default function TopPoolsChart({ roundId }: { roundId: string }) {
  const data = {
    hovertemplate: "%{x:.2f}% APR<extra></extra>",
    marker: {
      color: [
        "rgba(227,176,10,1)",
        "rgba(234,157,219,1)",
        "rgba(26,51,112,1)",
        "rgba(220,118,103,1)",
        "rgba(138,42,4,1)",
        "rgba(170,93,232,1)",
        "rgba(248,224,240,1)",
        "rgba(50,220,250,1)",
        "rgba(46,68,220,1)",
        "rgba(46,68,220,1)",
        "rgba(252,101,62,1)",
        "rgba(141,115,128,1)",
        "rgba(202,164,107,1)",
        "rgba(202,164,107,1)",
        "rgba(179,162,239,1)",
        "rgba(183,43,247,1)",
        "rgba(140,38,142,1)",
      ],
    },
    orientation: "h" as const,
    type: "bar" as PlotType,
    x: [
      "0.00",
      "0.01",
      "0.35",
      "0.50",
      "0.99",
      "1.10",
      "1.92",
      "3.48",
      "3.48",
      "3.53",
      "5.60",
      "9.60",
      "18.19",
      "18.62",
      "26.18",
      "39.03",
      "39.03",
    ],
    y: [
      "sNOTE-BPT",
      "B-50USDC-50WETH",
      "B-stETH-STABLE",
      "B-50VITA-50WETH",
      "80D2D-20USDC",
      "B-80GNO-20WETH",
      "50WETH-50AURA",
      "20WBTC-80BADGER",
      "20WBTC-80BADGER",
      "50COW-50GNO",
      "50COW-50WETH",
      "VBPT",
      "20WETH-80WNCG",
      "B-sdBAL-STABLE",
      "50DFX-50WETH",
      "USDC-PAL",
      "USDC-PAL",
    ],
  };

  return (
    <div className="flex justify-between border border-gray-400 lg:border-gray-400 bg-blue3 rounded p-4 cursor-pointer">
      <Plot
        title={`Top APR Pools of Round ${roundId}`}
        toolTip="Top pools with highest APR."
        data={[data]}
        layout={{
          barmode: "overlay",
          autosize: true,
          dragmode: false,
          xaxis: {
            title: `APR %`,
            fixedrange: true,
          },
          yaxis: { fixedrange: true },
        }}
      />
    </div>
  );
}
