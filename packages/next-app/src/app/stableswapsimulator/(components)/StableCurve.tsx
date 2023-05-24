"use client";

import { StableMath } from "@balancer-pool-metadata/math/src";
import Plot from "react-plotly.js";

import { Spinner } from "#/components/Spinner";
import { useStableSwap } from "#/contexts/StableSwapContext";

export default function StableCurve() {
  const {
    baselineData,
    indexAnalysisToken,
    indexCurrentTabToken,
    preparePoolPairData,
    numberToOldBigNumber,
  } = useStableSwap();

  if (
    !baselineData ||
    !baselineData.swapFee ||
    !baselineData.ampFactor ||
    !baselineData.tokens
  )
    return <Spinner />;

  const initialAmountsAnalysisToken = calculateAmounts({
    balance: baselineData?.tokens?.[indexAnalysisToken]?.balance,
  });

  const initialPoolPairData = preparePoolPairData({
    indexIn: indexAnalysisToken,
    indexOut: indexCurrentTabToken,
    swapFee: baselineData?.swapFee,
    allBalances: baselineData?.tokens?.map((token) => token.balance),
    amp: baselineData?.ampFactor,
  });

  const initialAmountTabToken = initialAmountsAnalysisToken.map((amount) => {
    return (
      StableMath._exactTokenInForTokenOut(
        numberToOldBigNumber(amount),
        initialPoolPairData
      ).toNumber() * -1
    );
  });

  return (
    <div className="text-white">
      <Plot
        data={[
          {
            x: initialAmountsAnalysisToken,
            y: initialAmountTabToken,
            type: "scatter",
            mode: "lines+markers",
            marker: { color: "red" },
          },
        ]}
        layout={{ width: 320, height: 240, title: "A Fancy Plot" }}
      />
    </div>
  );
}

function calculateAmounts({
  balance,
  start = 0,
}: {
  balance?: number;
  start?: number;
}) {
  if (!balance) return [];
  const numberOfPoints = 20;
  const step = (balance - start) / (numberOfPoints - 1);

  return Array.from(
    { length: (balance - start) / step + 1 },
    (value, index) => start + index * step
  );
}
