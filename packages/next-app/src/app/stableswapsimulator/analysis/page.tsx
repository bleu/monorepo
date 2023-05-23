"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useStableSwap } from "#/contexts/StableSwapContext";

import StableCurve from "../(components)/StableCurve";

export default function Page() {
  const { push } = useRouter();
  const { initialData, setAreParamsLoading } = useStableSwap();
  useEffect(() => {
    setAreParamsLoading(false);
  }, []);
  if (!initialData) {
    push("/stableswapsimulator");
  }
  return <StableCurve />;
}
