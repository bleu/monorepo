"use client";

import { useRouter } from "next/navigation";

import { useStableSwap } from "#/contexts/StableSwapContext";

import StableCurve from "./StableCurve";

export function GraphView() {
  const { baselineData } = useStableSwap();
  const { push } = useRouter();

  if (!baselineData.swapFee) {
    push("/stableswapsimulator");
  }

  return <StableCurve />;
}
