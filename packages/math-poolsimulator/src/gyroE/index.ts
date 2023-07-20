import {
  balancesFromTokenInOut,
  bnum,
  OldBigNumber,
  SubgraphToken,
  ZERO,
} from "@balancer-labs/sor";
import { BigNumber, formatFixed } from "@ethersproject/bignumber";
import { WeiPerEther as EONE } from "@ethersproject/constants";

import {
  DerivedGyroEParams,
  GyroEParams,
  GyroEV2Pool,
  Vector2,
} from "../../../../lib/bleu-balancer-sor/src/";
import { calculateInvariantWithError } from "../../../../lib/bleu-balancer-sor/src/pools/gyroEPool/gyroEMath/gyroEMath";
import {
  calcSpotPriceXGivenY,
  calcSpotPriceYGivenX,
} from "../../../../lib/bleu-balancer-sor/src/pools/gyroEPool/gyroEMath/gyroEMathFunctions";
import { normalizeBalances } from "../../../../lib/bleu-balancer-sor/src/pools/gyroEV2Pool/gyroEV2Math/gyroEV2MathHelpers";
import {
  divDown,
  mulDown,
} from "../../../../lib/bleu-balancer-sor/src/pools/gyroHelpers/gyroSignedFixedPoint";
import { safeParseFixed } from "../../../../lib/bleu-balancer-sor/src/utils";

type GyroEPoolToken = Pick<SubgraphToken, "address" | "balance" | "decimals">;
export type GyroEPoolPairData = ReturnType<
  typeof GyroEV2Pool.prototype.parsePoolPairData
>;
type GyroEParamsFromSubgraph = {
  alpha: string;
  beta: string;
  c: string;
  s: string;
  lambda: string;
};
type DerivedGyroEParamsFromSubgraph = {
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
  id: string;
  address: string;
  swapFee: string;
  totalShares: string;
  tokens: GyroEPoolToken[];
  tokensList: string[];
  gyroEParams: GyroEParamsFromSubgraph;
  derivedGyroEParams: DerivedGyroEParamsFromSubgraph;
  tokenRates: string[];
}
export class ExtendedGyroEV2 extends GyroEV2Pool {
  constructor(poolParams: IGyroEMaths) {
    super(
      poolParams.id,
      poolParams.address,
      poolParams.swapFee,
      poolParams.totalShares,
      poolParams.tokens,
      poolParams.tokensList,
      poolParams.gyroEParams,
      poolParams.derivedGyroEParams,
      poolParams.tokenRates
    );
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
      ? calcSpotPriceYGivenX
      : calcSpotPriceXGivenY;

    const newSpotPriceFactor = calcSpotPriceGiven(
      balances[Number(!tokenInIsToken0)],
      params,
      derived,
      invariant
    );
    return divDown(EONE, mulDown(newSpotPriceFactor, EONE.sub(swapFee)));
  }
  _spotPrice(poolPairData: GyroEPoolPairData): OldBigNumber {
    // Alias for code readability. Observe that `balancesFromTokenInOut()` is its own inverse.
    const valuesInOutFrom01 = balancesFromTokenInOut;
    try {
      const tokenRateInOut = valuesInOutFrom01(
        this.tokenRates[0],
        this.tokenRates[1],
        poolPairData.tokenInIsToken0
      );
      const normalizedBalances = normalizeBalances(
        [poolPairData.balanceIn, poolPairData.balanceOut],
        [poolPairData.decimalsIn, poolPairData.decimalsOut],
        tokenRateInOut
      );
      const orderedNormalizedBalances = balancesFromTokenInOut(
        normalizedBalances[0],
        normalizedBalances[1],
        poolPairData.tokenInIsToken0
      );
      const [currentInvariant, invErr] = calculateInvariantWithError(
        orderedNormalizedBalances,
        this.gyroEParams,
        this.derivedGyroEParams
      );
      const invariant: Vector2 = {
        x: currentInvariant.add(invErr.mul(2)),
        y: currentInvariant,
      };
      const newSpotPriceScaled = this.calcSpotPriceWithoutSwap(
        orderedNormalizedBalances,
        poolPairData.tokenInIsToken0,
        this.gyroEParams,
        this.derivedGyroEParams,
        invariant,
        poolPairData.swapFee
      );
      const newSpotPrice = divDown(
        mulDown(newSpotPriceScaled, tokenRateInOut[1]),
        tokenRateInOut[0]
      );
      return bnum(formatFixed(newSpotPrice, 18));
    } catch (err) {
      return ZERO;
    }
  }
}
