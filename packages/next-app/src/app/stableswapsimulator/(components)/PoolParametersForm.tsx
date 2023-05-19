"use client";

import { useStableSwap } from "#/contexts/StableSwapContext";

export default function PoolParametersForm() {
  const { initialData } = useStableSwap();

  return (
    // Just to check if initial data is being updated
    // TODO: BAL-385
    <div className="text-white">{JSON.stringify(initialData)}</div>
  );
}
