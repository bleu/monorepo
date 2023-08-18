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

export default function getBetaLimitIndexes(params: {
  analysisTokenOut: number[];
  analysisTokenIn: number[];
  tabTokenIn: number[];
  tabTokenOut: number[];
  analysisTokenInitialBalance: number;
  tabTokenInitialBalance: number;
  beta: number;
}) {
  const {
    analysisTokenOut,
    analysisTokenIn,
    tabTokenIn,
    tabTokenOut,
    analysisTokenInitialBalance,
    tabTokenInitialBalance,
    beta,
  } = params;

  const analysisAmounts = computeSwapAmounts(analysisTokenOut, analysisTokenIn);
  const tabAmounts = computeSwapAmounts(tabTokenIn, tabTokenOut);

  const analysisBalances = computeBalances(
    analysisAmounts,
    analysisTokenInitialBalance,
  );
  const tabBalances = computeBalances(tabAmounts, tabTokenInitialBalance);

  const [start, end] = findTransitions(analysisBalances, tabBalances, beta);

  return [
    [analysisAmounts[start], analysisAmounts[end]],
    [tabAmounts[start], tabAmounts[end]],
  ];
}
