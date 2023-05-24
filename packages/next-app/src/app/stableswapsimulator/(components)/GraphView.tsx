"use client";

import { useRouter } from "next/navigation";

import { useStableSwap } from "#/contexts/StableSwapContext";

import StableCurve from "./StableCurve";

export function GraphView() {
  const { initialData } = useStableSwap();
  const { push } = useRouter();

  if (!initialData.swapFee) {
    push("/stableswapsimulator");
  }

  return <StableCurve />;
}
