export function calculatePriceImpact({
  balance0,
  balance1,
  amount0,
  amount1,
}: {
  balance0: number;
  balance1: number;
  amount0: number;
  amount1: number;
}) {
  const token0Ratio = amount0 / balance0;
  const token1Ratio = amount1 / balance1;
  const ratio0BiggerThan1 = token0Ratio > token1Ratio;

  const currentSpotPrice = ratio0BiggerThan1
    ? balance1 / balance0
    : balance0 / balance1;
  const newSpotPrice = ratio0BiggerThan1
    ? (balance1 + amount1) / (balance0 + amount0)
    : (balance0 + amount0) / (balance1 + amount1);

  return Math.abs(newSpotPrice - currentSpotPrice) / currentSpotPrice;
}
