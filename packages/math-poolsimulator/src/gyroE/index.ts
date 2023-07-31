import {
  balancesFromTokenInOut,
  bnum,
  DerivedGyroEParams,
  GyroEMathFunctions,
  GyroEMaths,
  GyroEParams,
  GyroEV2Pool,
  GyroHelpers,
  GyroHelpersSignedFixedPoint,
  OldBigNumber,
  safeParseFixed,
  SubgraphPoolBase,
  SubgraphToken,
  Vector2,
} from "@balancer-labs/sor";
import { BigNumber, formatFixed } from "@ethersproject/bignumber";
import { WeiPerEther as EONE } from "@ethersproject/constants";

import { bigNumberToOldBigNumber } from "../conversions";
import { IAMMFunctionality } from "../types";

type GyroEPoolToken = Pick<SubgraphToken, "address" | "balance" | "decimals">;
export type GyroEPoolPairData = ReturnType<
  typeof GyroEV2Pool.prototype.parsePoolPairData
>;
export type GyroEParamsFromSubgraph = {
  alpha: string;
  beta: string;
  c: string;
  s: string;
  lambda: string;
};
export type DerivedGyroEParamsFromSubgraph = {
  tauAlphaX: string;
  tauAlphaY: string;
  tauBetaX: string;
  tauBetaY: string;
  u: string;
  v: string;
  w: string;
  z: string;
  dSq: string;
};
export interface IGyroEMaths {
  swapFee: string;
  totalShares: string;
  tokens: GyroEPoolToken[];
  tokensList: string[];
  gyroEParams: GyroEParamsFromSubgraph;
  derivedGyroEParams: DerivedGyroEParamsFromSubgraph;
  tokenRates: string[];
}
export class ExtendedGyroEV2
  extends GyroEV2Pool
  implements IAMMFunctionality<GyroEPoolPairData>
{
  constructor(poolParams: IGyroEMaths) {
    super(
      "0x",
      "0x",
      poolParams.swapFee,
      poolParams.totalShares,
      poolParams.tokens,
      poolParams.tokensList,
      poolParams.gyroEParams,
      poolParams.derivedGyroEParams,
      poolParams.tokenRates
    );
  }

  static fromPool(pool: SubgraphPoolBase): ExtendedGyroEV2 {
    const {
      alpha,
      beta,
      c,
      s,
      lambda,
      tauAlphaX,
      tauAlphaY,
      tauBetaX,
      tauBetaY,
      u,
      v,
      w,
      z,
      dSq,
      tokenRates,
    } = pool;

    const gyroEParams = {
      alpha,
      beta,
      c,
      s,
      lambda,
    };

    const derivedGyroEParams = {
      tauAlphaX,
      tauAlphaY,
      tauBetaX,
      tauBetaY,
      u,
      v,
      w,
      z,
      dSq,
    };

    if (
      !Object.values(gyroEParams).every((el) => el) ||
      !Object.values(derivedGyroEParams).every((el) => el)
    )
      throw new Error("Pool missing GyroE params and/or GyroE derived params");

    if (!tokenRates) throw new Error("GyroEV2 Pool missing tokenRates");

    return new ExtendedGyroEV2({
      swapFee: pool.swapFee,
      totalShares: pool.totalShares,
      tokens: pool.tokens as GyroEPoolToken[],
      tokensList: pool.tokensList,
      gyroEParams: gyroEParams as GyroEParamsFromSubgraph,
      derivedGyroEParams: derivedGyroEParams as DerivedGyroEParamsFromSubgraph,
      tokenRates: pool.tokenRates as string[],
    });
  }

  parsePoolPairData(tokenIn: string, tokenOut: string): GyroEPoolPairData {
    // This function was developed based on @balancer/sor package, but for work as a symbol instead of address
    const tokenIndexIn = this.tokens.findIndex((t) => t.address === tokenIn);
    if (tokenIndexIn < 0) throw "Pool does not contain tokenIn";
    const tI = this.tokens[tokenIndexIn];
    const balanceIn = tI.balance;
    const decimalsIn = tI.decimals;

    const tokenIndexOut = this.tokens.findIndex((t) => t.address === tokenOut);
    if (tokenIndexOut < 0) throw "Pool does not contain tokenOut";
    const tO = this.tokens[tokenIndexOut];
    const balanceOut = tO.balance;
    const decimalsOut = tO.decimals;

    const tokenInIsToken0 = tokenIndexIn === 0;

    const poolPairData: GyroEPoolPairData = {
      id: this.id,
      address: this.address,
      poolType: this.poolType,
      tokenIn: tokenIn,
      tokenOut: tokenOut,
      decimalsIn: Number(decimalsIn),
      decimalsOut: Number(decimalsOut),
      balanceIn: safeParseFixed(balanceIn, decimalsIn),
      balanceOut: safeParseFixed(balanceOut, decimalsOut),
      swapFee: this.swapFee,
      tokenInIsToken0,
    };

    return poolPairData;
  }
  calcSpotPriceWithoutSwap(
    balances: BigNumber[],
    tokenInIsToken0: boolean,
    params: GyroEParams,
    derived: DerivedGyroEParams,
    invariant: Vector2,
    swapFee: BigNumber
  ): BigNumber {
    const calcSpotPriceGiven = tokenInIsToken0
      ? GyroEMathFunctions.calcSpotPriceYGivenX
      : GyroEMathFunctions.calcSpotPriceXGivenY;

    const newSpotPriceFactor = calcSpotPriceGiven(
      balances[Number(!tokenInIsToken0)],
      params,
      derived,
      invariant
    );
    return GyroHelpersSignedFixedPoint.divDown(
      EONE,
      GyroHelpersSignedFixedPoint.mulDown(newSpotPriceFactor, EONE.sub(swapFee))
    );
  }
  _spotPrice(poolPairData: GyroEPoolPairData): OldBigNumber {
    const normalizedBalances = GyroHelpers._normalizeBalances(
      [poolPairData.balanceIn, poolPairData.balanceOut],
      [poolPairData.decimalsIn, poolPairData.decimalsOut]
    );
    const orderedNormalizedBalances = balancesFromTokenInOut(
      normalizedBalances[0],
      normalizedBalances[1],
      poolPairData.tokenInIsToken0
    );
    const [currentInvariant, invErr] = GyroEMaths.calculateInvariantWithError(
      orderedNormalizedBalances,
      this.gyroEParams,
      this.derivedGyroEParams
    );
    const invariant: Vector2 = {
      x: currentInvariant.add(invErr.mul(2)),
      y: currentInvariant,
    };
    const newSpotPrice = this.calcSpotPriceWithoutSwap(
      orderedNormalizedBalances,
      poolPairData.tokenInIsToken0,
      this.gyroEParams,
      this.derivedGyroEParams,
      invariant,
      poolPairData.swapFee
    );
    return bnum(formatFixed(newSpotPrice, 18));
  }

  _firstGuessOfTokenInForExactSpotPriceAfterSwap(
    poolPairData: GyroEPoolPairData
  ): OldBigNumber {
    return bigNumberToOldBigNumber(
      poolPairData.balanceIn,
      poolPairData.decimalsIn
    ).times(bnum(0.01));
  }
}
