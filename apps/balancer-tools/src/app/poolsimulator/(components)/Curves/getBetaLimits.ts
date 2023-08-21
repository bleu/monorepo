export const computeSwapAmounts = (tokenOut: number[], tokenIn: number[]) =>
  // Join token In and Out amounts and order then.
  // Token Out is negative and In is positive
  // Both are ordered from the smallest absolute value to the biggest
  [...tokenOut].reverse().concat(tokenIn);

export const computeBalances = (swaps: number[], initialBalance: number) =>
  swaps.map((swap) => initialBalance + swap);

export const isInBetaRegion = (
  balanceX: number,
  balanceY: number,
  beta: number,
) => Math.abs(balanceX - balanceY) / (balanceX + balanceY) < beta;

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
  const end = trueIndices[trueIndices.length - 1];

  if (end - start + 1 !== trueIndices.length) {
    throw new Error("The true values are not continuous.");
  }

  return end === start ? [start] : [start, end];
}

export function getBetaLimitsIndexes({
  amountsA,
  amountsB,
  initialBalanceA,
  initialBalanceB,
  beta,
}: {
  amountsA: number[];
  amountsB: number[];
  initialBalanceA: number;
  initialBalanceB: number;
  beta: number;
}) {
  const balancesA = computeBalances(amountsA, initialBalanceA);
  const balancesB = computeBalances(amountsB, initialBalanceB);

  const [start, end] = findTransitions(balancesA, balancesB, beta);
  return [start, end].filter((i) => i !== 0);
}

export default function getBetaLimits({
  analysisTokenOut,
  analysisTokenIn,
  tabTokenIn,
  tabTokenOut,
  analysisTokenInitialBalance,
  tabTokenInitialBalance,
  beta,
}: {
  analysisTokenOut: number[];
  analysisTokenIn: number[];
  tabTokenIn: number[];
  tabTokenOut: number[];
  analysisTokenInitialBalance: number;
  tabTokenInitialBalance: number;
  beta: number;
}) {
  // https://docs.xave.co/product-overview-1/fxpools/amm-faqs
  const analysisAmounts = computeSwapAmounts(analysisTokenOut, analysisTokenIn);
  const tabAmounts = computeSwapAmounts(tabTokenIn, tabTokenOut);

  const [start, end] = getBetaLimitsIndexes({
    amountsA: analysisAmounts,
    amountsB: tabAmounts,
    initialBalanceA: analysisTokenInitialBalance,
    initialBalanceB: tabTokenInitialBalance,
    beta,
  });
  return [
    [analysisAmounts[start], analysisAmounts[end]],
    [tabAmounts[start], tabAmounts[end]],
  ];
}
