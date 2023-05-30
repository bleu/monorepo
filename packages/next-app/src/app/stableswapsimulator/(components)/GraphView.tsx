import dynamic from "next/dynamic";

import { Spinner } from "#/components/Spinner";

import DepthCost from "./DepthCost";

const StableCurve = dynamic(() => import("./StableCurve"), {
  ssr: false,
  loading: () => <Spinner />,
});

export function GraphView() {
  return (
    <div className="flex flex-col h-full w-full overflow-auto">
      <div className="basis-1/3">
        <div className="flex flex-row h-full w-full">
          <DepthCost />;
        </div>
      </div>
      <div className="basis-2/3">
        <StableCurve />;
      </div>
    </div>
  );
}
