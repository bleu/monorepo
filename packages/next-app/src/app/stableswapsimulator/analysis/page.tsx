"use client";

import { useRouter } from "next/navigation";

import { useStableSwap } from "#/contexts/StableSwapContext";

import StableCurve from "../(components)/StableCurve";

export default function Page() {
  const { push } = useRouter();
  const { initialData } = useStableSwap();
  if (!initialData) {
    push("/stableswapsimulator");
  }
  return <StableCurve />;
}
