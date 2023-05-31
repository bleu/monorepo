import { amberDarkA, blueDarkA, grayDarkA, slateDarkA } from "@radix-ui/colors";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { merge } from "lodash";
import dynamic from "next/dynamic";
import { PlotParams } from "react-plotly.js";

import { Spinner } from "#/components/Spinner";

import { Tooltip } from "./Tooltip";

interface PlotProps extends PlotParams {
  title: string;
  toolTip: string;
}

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

export default function Plot(props: PlotProps) {
  const defaultPlotPropsDeepCopy = JSON.parse(JSON.stringify(defaultPlotProps));
  const plotProps = merge(defaultPlotPropsDeepCopy, props); // deep copy is needed because merge mutates the first argument
  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-center items-center gap-x-2">
        <h2 className="text-lg font-semibold text-white">{props.title}</h2>
        <Tooltip content={props.toolTip}>
          <InfoCircledIcon color={slateDarkA.slateA11} />
        </Tooltip>
      </div>
      <PlotRoot {...plotProps} />
    </div>
  );
}
