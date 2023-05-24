"use client";

import { useEffect } from "react";

import { useStableSwap } from "#/contexts/StableSwapContext";

import ParametersNotSet from "./(components)/ParametersNotSet";

export default function Page() {
  const { setBaselineData, defaultInitialData } = useStableSwap();
  useEffect(() => {
    setBaselineData(defaultInitialData);
  }, []);
  return <ParametersNotSet />;
}
