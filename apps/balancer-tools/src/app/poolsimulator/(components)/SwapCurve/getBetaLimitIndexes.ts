export const computeSwapAmounts = (
  tokenOut: number[],
  tokenIn: number[],
  initialBalance: number,
) =>
  [...tokenOut]
    .reverse()
    .concat(tokenIn)
    .map((amount) => amount + initialBalance);

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

  const analysisAmounts = computeSwapAmounts(
    analysisTokenOut,
    analysisTokenIn,
    analysisTokenInitialBalance,
  );
  const tabAmounts = computeSwapAmounts(
    tabTokenIn,
    tabTokenOut,
    tabTokenInitialBalance,
  );

  const [start, end] = findTransitions(analysisAmounts, tabAmounts, beta);

  return [
    [analysisAmounts[start], analysisAmounts[end]],
    [tabAmounts[start], tabAmounts[end]],
  ];
}
