"use client";

import { useRouter } from "next/navigation";

import { useStableSwap } from "#/contexts/StableSwapContext";

import { GraphView } from "../(components)/GraphView";

export default function Page() {
  const { push } = useRouter();
  const { baselineData } = useStableSwap();

  if (!baselineData) {
    push("/stableswapsimulator");
  }
  return <GraphView />;
}
