"use client";

import { useEffect } from "react";

import { useStableSwap } from "#/contexts/StableSwapContext";

import ParametersNotSet from "./(components)/ParametersNotSet";

export default function Page() {
  const { setInitialData, defaultInitialData } = useStableSwap();
  useEffect(() => {
    setInitialData(defaultInitialData);
  }, []);
  return <ParametersNotSet />;
}
