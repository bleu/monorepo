import { bnum, OldBigNumber } from "@balancer-labs/sor";
import { BigNumber, parseFixed } from "@ethersproject/bignumber";

export function numberToBigNumber({
  number,
  decimals = 18,
}: {
  number: number;
  decimals?: number;
}) {
  const numberAsString = number.toString();
  if (numberAsString.includes(".")) {
    const [integerAsString, floatAsString] = numberAsString.split(".");
    const floatAsStringTrimmed = floatAsString.slice(0, decimals);
    const numberStringTrimmed = `${integerAsString}.${floatAsStringTrimmed}`;
    return parseFixed(numberStringTrimmed, decimals);
  }
  return parseFixed(numberAsString, decimals);
}

export function bigNumberToOldBigNumber(
  bn: BigNumber,
  decimals: number,
): OldBigNumber {
  return bnum(bn.toString()).div(bnum(10).pow(decimals));
}
