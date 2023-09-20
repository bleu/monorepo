export interface BetaLimits {
  analysis: number[];
  pair: number[];
  tabTokenIn: {
    tabAmount: number;
    analysisAmount: number;
  };
  analysisTokenIn: {
    tabAmount: number;
    analysisAmount: number;
  };
}

export const computeSwapAmounts = (tokenOut: number[], tokenIn: number[]) =>
  // Join token In and Out amounts and order then.
  // Token Out is negative and In is positive
  // Both are ordered from the smallest absolute value to the biggest
  [...tokenOut].reverse().concat(tokenIn);

export const isInBetaRegion = (
  balanceX: number,
  balanceY: number,
  beta: number,
) => Math.abs(balanceX - balanceY) / (balanceX + balanceY) < beta;

export const computeBalances = (
  swaps: number[],
  tokenRate: number,
  initialBalance: number,
) => swaps.map((swap) => (initialBalance + swap) * tokenRate);

export const findTransitions = (
  analysisAmounts: number[],
  tabAmounts: number[],
  beta: number,
) => {
  const inBetaRegion = analysisAmounts.map((analysisValue, idx) =>
    isInBetaRegion(analysisValue, tabAmounts[idx], beta),
  );
  return getTransitionIndices(inBetaRegion);
};

export function getTransitionIndices(booleans: boolean[]): number[] {
  const trueIndices = booleans
    .map((value, index) => (value ? index : -1))
    .filter((index) => index !== -1);

  if (trueIndices.length === 0) return [];

  const start = trueIndices[0];
  const end = trueIndices[trueIndices.length - 1] + 1;

  if (end - start !== trueIndices.length) {
    throw new Error("The true values are not continuous.");
  }

  return end === booleans.length ? [start, end - 1] : [start, end];
}

export function getBetaLimitsIndexes({
  amountsA,
  amountsB,
  rateA,
  rateB,
  initialBalanceA,
  initialBalanceB,
  beta,
}: {
  amountsA: number[];
  amountsB: number[];
  rateA: number;
  rateB: number;
  initialBalanceA: number;
  initialBalanceB: number;
  beta: number;
}) {
  const balancesA = computeBalances(amountsA, rateA, initialBalanceA);
  const balancesB = computeBalances(amountsB, rateB, initialBalanceB);

  const [start, end] = findTransitions(balancesA, balancesB, beta);
  return [start, end].filter((i) => i !== 0);
}

export function getBetaLimits({
  analysisTokenOut,
  analysisTokenIn,
  analysisTokenRate,
  tabTokenRate,
  pairTokenIn,
  pairTokenOut,
  analysisTokenInitialBalance,
  tabTokenInitialBalance,
  beta,
}: {
  analysisTokenOut: number[];
  analysisTokenIn: number[];
  pairTokenIn: number[];
  analysisTokenRate: number;
  tabTokenRate: number;
  pairTokenOut: number[];
  analysisTokenInitialBalance: number;
  tabTokenInitialBalance: number;
  beta: number;
}): BetaLimits {
  // https://docs.xave.co/product-overview-1/fxpools/amm-faqs
  const analysisAmounts = computeSwapAmounts(analysisTokenOut, analysisTokenIn);
  const tabAmounts = computeSwapAmounts(pairTokenIn, pairTokenOut);

  const [start, end] = getBetaLimitsIndexes({
    amountsA: analysisAmounts,
    amountsB: tabAmounts,
    rateA: analysisTokenRate,
    rateB: tabTokenRate,
    initialBalanceA: analysisTokenInitialBalance,
    initialBalanceB: tabTokenInitialBalance,
    beta,
  });

  return {
    analysis: [analysisAmounts[start], analysisAmounts[end]],
    pair: [tabAmounts[start], tabAmounts[end]],
    tabTokenIn: {
      tabAmount: tabAmounts[start],
      analysisAmount: analysisAmounts[start],
    },
    analysisTokenIn: {
      tabAmount: tabAmounts[end],
      analysisAmount: analysisAmounts[end],
    },
  };
}
