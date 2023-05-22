"use client";

import { useStableSwap } from "#/contexts/StableSwapContext";

import ParametersNotSet from "./(components)/ParametersNotSet";
import StableCurve from "./(components)/StableCurve";

export default function Page() {
  const { initialData } = useStableSwap();
  if (!!initialData) {
    return <StableCurve />;
  }
  return <ParametersNotSet />;
}
