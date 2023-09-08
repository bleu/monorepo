"use client";
import { amberDarkA, blueDarkA, grayDarkA, slateDarkA } from "@radix-ui/colors";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import cn from "clsx";
import { merge } from "lodash";
import dynamic from "next/dynamic";
import { PlotParams } from "react-plotly.js";

import { Spinner } from "#/components/Spinner";

import { TooltipMobile } from "./TooltipMobile";

interface PlotProps extends PlotParams {
  title?: string;
  toolTip?: string;
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
  responsive: true,
  layout: {
    margin: {
      b: 10,
      t: 30,
      r: 200,
    },
    plot_bgcolor: blueDarkA.blueA1,
    paper_bgcolor: blueDarkA.blueA1,
    font: {
      color: grayDarkA.grayA12,
      family: "var(--font-family-sans)",
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
    scrowZoom: true,
  },
  revision: 0,
};

export function PlotTitle({
  title,
  tooltip,
  justifyCenter = true,
  classNames,
}: {
  title: string;
  tooltip?: string;
  justifyCenter?: boolean;
  classNames?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-x-2",
        justifyCenter ? "justify-center" : "",
        classNames,
      )}
    >
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      {tooltip ? (
        <TooltipMobile content={tooltip}>
          <InfoCircledIcon color={slateDarkA.slateA11} />
        </TooltipMobile>
      ) : (
        <></>
      )}
    </div>
  );
}
export default function Plot(props: PlotProps) {
  const defaultPlotPropsDeepCopy = JSON.parse(JSON.stringify(defaultPlotProps));
  const plotProps = merge(defaultPlotPropsDeepCopy, props); // deep copy is needed because merge mutates the first argument
  return (
    <div className="flex w-full flex-col">
      {plotProps.title && (
        <PlotTitle title={plotProps.title} tooltip={plotProps.toolTip} />
      )}
      <PlotRoot {...plotProps} />
    </div>
  );
}
