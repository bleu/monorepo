import { OldBigNumber } from "@balancer-labs/sor";

export function amountToStableMath(
  amount: OldBigNumber,
  rate: OldBigNumber,
): OldBigNumber {
  return amount.times(rate);
}

export function amountFromStableMath(
  amount: OldBigNumber,
  rate: OldBigNumber,
): OldBigNumber {
  return amount.div(rate);
}

export function balancesToStableMath(
  balances: OldBigNumber[],
  rates: OldBigNumber[],
): OldBigNumber[] {
  return balances.map((balance, i) => amountToStableMath(balance, rates[i]));
}

export function balancesFromStableMath(
  balances: OldBigNumber[],
  rates: OldBigNumber[],
): OldBigNumber[] {
  return balances.map((balance, i) => amountFromStableMath(balance, rates[i]));
}

export function priceToStableMath(
  price: OldBigNumber,
  rateIn: OldBigNumber,
  rateOut: OldBigNumber,
): OldBigNumber {
  return price.times(rateOut).div(rateIn);
}

export function priceFromStableMath(
  price: OldBigNumber,
  rateIn: OldBigNumber,
  rateOut: OldBigNumber,
): OldBigNumber {
  return price.times(rateIn).div(rateOut);
}
