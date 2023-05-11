import { StableMath } from "@georgeroman/balancer-v2-pools";
import BigNumber, {
  bn,
} from "@georgeroman/balancer-v2-pools/dist/src/utils/big-number";
import * as fp from "@georgeroman/balancer-v2-pools/dist/src/utils/math/fixed-point";
// import * as math from "@georgeroman/balancer-v2-pools/dist/src/utils/math/math";
// import * as StableMath from "@balancer-labs/sor/dist/src/pools/stablePool/stableMath";

export const _bigNumberToNumber = (bn: BigNumber, decimals = 18): number => {
  return bn.toNumber() / 10 ** decimals;
};

export const adjustAmp = (amp: string) =>
  bn(amp).times(StableMath.AMP_PRECISION);

export const _calcOutGivenIn = (
  amplificationParameter: BigNumber,
  balances: BigNumber[],
  tokenIndexIn: number,
  tokenIndexOut: number,
  tokenAmountIn: BigNumber
): number => {
  const tokenAmountOut = StableMath._calcOutGivenIn(
    amplificationParameter,
    balances,
    tokenIndexIn,
    tokenIndexOut,
    tokenAmountIn
  );
  return _bigNumberToNumber(tokenAmountOut);
};

export const _calcEffectivePriceGivenIn = (
  amplificationParameter: BigNumber,
  balances: BigNumber[],
  tokenIndexIn: number,
  tokenIndexOut: number,
  tokenAmountIn: BigNumber
): number => {
  const tokenAmountOut = StableMath._calcOutGivenIn(
    amplificationParameter,
    balances,
    tokenIndexIn,
    tokenIndexOut,
    tokenAmountIn
  );
  const effectivePrice = fp.divDown(tokenAmountOut, tokenAmountIn);
  return _bigNumberToNumber(effectivePrice);
};
