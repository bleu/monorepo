"use client";

import { Spinner } from "#/components/Spinner";
import { useStableSwap } from "#/contexts/StableSwapContext";

import ParametersNotSet from "./(components)/ParametersNotSet";

export default function Page() {
  const { isGraphLoading } = useStableSwap();
  if (isGraphLoading) return <Spinner />;
  return <ParametersNotSet />;
}
