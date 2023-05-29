import { amberDarkA, blueDarkA, grayDarkA } from "@radix-ui/colors";
import { merge } from "lodash";
import PlotRoot, { PlotParams } from "react-plotly.js";

export const defaultAxisLayout = {
  gridcolor: grayDarkA.grayA10,
  linecolor: grayDarkA.grayA12,
  linewidth: 0.5,
  automargin: true,
  zerolinecolor: grayDarkA.grayA10,
};

export const defaultPlotProps = {
  className: "w-full h-full",
  useResizeHandler: true,
  layout: {
    plot_bgcolor: blueDarkA.blueA1,
    paper_bgcolor: blueDarkA.blueA1,
    font: {
      color: grayDarkA.grayA12,
      family: "Inter",
    },
    xaxis: defaultAxisLayout,
    yaxis: defaultAxisLayout,
    modebar: {
      bgcolor: blueDarkA.blueA1,
      color: grayDarkA.grayA12,
      activecolor: grayDarkA.grayA12,
      orientation: "h",
    },
    colorway: [blueDarkA.blueA9, amberDarkA.amberA9],
  },
  config: {
    displaylogo: false,
    showAxisRangeEntryBoxes: false,
    showSendToCloud: false,
    showEditInChartStudio: false,
    showLink: false,
    watermark: false,
  },
  revision: 0,
};

export default function Plot(props: PlotParams) {
  const defaultPlotPropsDeepCopy = JSON.parse(JSON.stringify(defaultPlotProps));
  const plotProps = merge(defaultPlotPropsDeepCopy, props); // deep copy is needed because merge mutates the first argument
  return <PlotRoot {...plotProps} />;
}
