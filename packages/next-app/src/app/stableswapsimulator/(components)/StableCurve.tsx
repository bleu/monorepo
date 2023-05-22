"use client";

import { useStableSwap } from "#/contexts/StableSwapContext";

export default function StableCurve() {
  const { initialData, newData, indexAnalysisToken, indexCurrentTabToken } =
    useStableSwap();
  const amountsAnalysisToken = calculateAmounts(
    initialData?.tokens?.[indexAnalysisToken]?.balance
  );
  const amountsTabToken = calculateAmounts(
    newData?.tokens?.[indexAnalysisToken]?.balance
  );
  return (
    <>
      {amountsAnalysisToken} {amountsTabToken} {indexCurrentTabToken}
    </>
  );
}

function calculateAmounts(balance?: number) {
  if (!balance) return [];
  const numberOfPoints = 20;
  const step = balance / (numberOfPoints - 1);
  return Array.from({ length: numberOfPoints }, (_, i) => {
    i * step;
  });
}
