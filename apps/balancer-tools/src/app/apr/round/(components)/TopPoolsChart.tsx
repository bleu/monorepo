"use client";

import {
  amberDark,
  blueDark,
  crimsonDark,
  greenDark,
  violetDark,
} from "@radix-ui/colors";
import { PlotType } from "plotly.js";

import Plot from "#/components/Plot";

export default function TopPoolsChart({ roundId }: { roundId: string }) {
  const colors = [
    greenDark.green9,
    violetDark.violet9,
    crimsonDark.crimson8,
    blueDark.blue9,
    amberDark.amber9,
  ];
  const bars = [
    { x: "0.00", y: "sNOTE-BPT" },
    { x: "0.01", y: "B-50USDC-50WETH" },
    { x: "0.35", y: "B-stETH-STABLE" },
    { x: "0.50", y: "B-50VITA-50WETH" },
    { x: "0.99", y: "80D2D-20USDC" },
    { x: "1.10", y: "B-80GNO-20WETH" },
    { x: "1.92", y: "50WETH-50AURA" },
    { x: "3.48", y: "20WBTC-80BADGER" },
    { x: "3.53", y: "50COW-50GNO" },
    { x: "5.60", y: "50COW-50WETH" },
    { x: "9.60", y: "VBPT" },
    { x: "18.19", y: "20WETH-80WNCG" },
    { x: "18.62", y: "B-sdBAL-STABLE" },
    { x: "26.18", y: "50DFX-50WETH" },
    { x: "39.03", y: "USDC-PAL" },
  ];
  const colorArray = Array.from(
    { length: bars.length },
    (_, index) => colors[index % colors.length],
  );

  const data = {
    hovertemplate: "%{x:.2f}% APR<extra></extra>",
    marker: {
      color: colorArray,
    },
    orientation: "h" as const,
    type: "bar" as PlotType,
    x: bars.map((bar) => bar.x),
    y: bars.map((bar) => bar.y),
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
