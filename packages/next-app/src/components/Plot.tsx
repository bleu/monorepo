import { amberDarkA, blueDarkA, grayDarkA } from "@radix-ui/colors";
import { merge } from "lodash";
import dynamic from "next/dynamic";
import { PlotParams } from "react-plotly.js";

import { Spinner } from "#/components/Spinner";

const PlotRoot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
  loading: () => <Spinner />,
});

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
    margin: {
      b: 10,
      t: 30,
    },
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
    colorway: [blueDarkA.blueA9, amberDarkA.amberA9], // this colors are intercalated, so the first trace will be blue, the second amber, the third blue, etc.
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
