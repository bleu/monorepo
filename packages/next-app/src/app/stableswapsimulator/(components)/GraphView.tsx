import dynamic from "next/dynamic";

import { Spinner } from "#/components/Spinner";

const StableCurve = dynamic(() => import("./StableCurve"), {
  ssr: false,
  loading: () => <Spinner />,
});

export function GraphView() {
  return <StableCurve />;
}
