import {
  bnum,
  MetaStablePool,
  OldBigNumber,
  SubgraphPoolBase,
  SubgraphToken,
  ZERO,
} from "@balancer-labs/sor";
import { formatFixed, parseFixed } from "@ethersproject/bignumber";
import { WeiPerEther as EONE } from "@ethersproject/constants";

import { IAMMFunctionality } from "../types";
import { scale } from "./utils/basicOperations";
import { _calcOutGivenIn } from "./utils/stableMathBigInt";

type MetaStablePoolToken = Pick<
  SubgraphToken,
  "address" | "balance" | "decimals" | "priceRate"
>;

export type MetaStablePoolPairData = ReturnType<
  typeof MetaStablePool.prototype.parsePoolPairData
>;

export interface IMetaStableMath {
  amp: string;
  swapFee: string;
  totalShares: string;
  tokens: MetaStablePoolToken[];
  tokensList: string[];
}

export class ExtendedMetaStableMath
  extends MetaStablePool
  implements IAMMFunctionality<MetaStablePoolPairData>
{
  constructor(poolParams: IMetaStableMath) {
    super(
      "0x",
      "0x",
      poolParams.amp,
      poolParams.swapFee,
      poolParams.totalShares,
      poolParams.tokens,
      poolParams.tokensList,
    );
  }

  static fromPool(pool: SubgraphPoolBase): ExtendedMetaStableMath {
    if (!pool.amp) throw new Error("MetaStablePool missing amp factor");
    return new ExtendedMetaStableMath({
      amp: pool.amp,
      swapFee: pool.swapFee,
      totalShares: pool.totalShares,
      tokens: pool.tokens,
      tokensList: pool.tokensList,
    });
  }

  parsePoolPairData(tokenIn: string, tokenOut: string): MetaStablePoolPairData {
    // This function was developed based on @balancer/sor package, but for work as a symbol instead of address
    const tokenIndexIn = this.tokens.findIndex((t) => t.address === tokenIn);
    if (tokenIndexIn < 0) throw "Pool does not contain tokenIn";
    const tI = this.tokens[tokenIndexIn];

    const decimalsIn = tI.decimals;
    const tokenInPriceRate = parseFixed(tI.priceRate, 18);
    const balanceIn = formatFixed(
      parseFixed(tI.balance, decimalsIn).mul(tokenInPriceRate).div(EONE),
      decimalsIn,
    );

    const tokenIndexOut = this.tokens.findIndex((t) => t.address === tokenOut);
    if (tokenIndexOut < 0) throw "Pool does not contain tokenOut";
    const tO = this.tokens[tokenIndexOut];

    const decimalsOut = tO.decimals;
    const tokenOutPriceRate = parseFixed(tO.priceRate, 18);
    const balanceOut = formatFixed(
      parseFixed(tO.balance, decimalsOut).mul(tokenOutPriceRate).div(EONE),
      decimalsOut,
    );

    // Get all token balances
    const allBalances = this.tokens.map(({ balance, priceRate }) =>
      bnum(balance).times(bnum(priceRate)),
    );
    const allBalancesScaled = this.tokens.map(({ balance, priceRate }) =>
      parseFixed(balance, 18).mul(parseFixed(priceRate, 18)).div(EONE),
    );

    const poolPairData: MetaStablePoolPairData = {
      id: this.id,
      address: this.address,
      poolType: this.poolType,
      tokenIn: tokenIn,
      tokenOut: tokenOut,
      balanceIn: parseFixed(balanceIn, decimalsIn),
      balanceOut: parseFixed(balanceOut, decimalsOut),
      swapFee: this.swapFee,
      allBalances,
      allBalancesScaled,
      amp: this.amp,
      tokenIndexIn: tokenIndexIn,
      tokenIndexOut: tokenIndexOut,
      decimalsIn: Number(decimalsIn),
      decimalsOut: Number(decimalsOut),
      tokenInPriceRate,
      tokenOutPriceRate,
    };

    return poolPairData;
  }

  //This is from balancer-sor - needed to calculate _exactTokenInForTokenOut
  _exactTokenInForTokenOut(
    poolPairData: MetaStablePoolPairData,
    amount: OldBigNumber,
  ): OldBigNumber {
    try {
      if (amount.isZero()) return ZERO;
      const amtWithFeeEvm = this.subtractSwapFeeAmount(
        parseFixed(
          amount.dp(poolPairData.decimalsIn).toString(),
          poolPairData.decimalsIn,
        ),
        poolPairData.swapFee,
      );
      // All values should use 1e18 fixed point
      // i.e. 1USDC => 1e18 not 1e6
      const amtScaled = amtWithFeeEvm.mul(10 ** (18 - poolPairData.decimalsIn));
      const amt = _calcOutGivenIn(
        this.amp.toBigInt(),
        poolPairData.allBalancesScaled.map((balance) => balance.toBigInt()),
        poolPairData.tokenIndexIn,
        poolPairData.tokenIndexOut,
        amtScaled.toBigInt(),
        BigInt(0),
      );
      // return normalised amount
      // Using BigNumber.js decimalPlaces (dp), allows us to consider token decimal accuracy correctly,
      // i.e. when using token with 2decimals 0.002 should be returned as 0
      // Uses ROUND_DOWN mode (1)
      return scale(bnum(amt.toString()), -18).dp(poolPairData.decimalsOut, 1);
    } catch (err) {
      // console.error(`_evmoutGivenIn: ${err.message}`);
      return ZERO;
    }
  }

  _spotPrice(poolPairData: MetaStablePoolPairData): OldBigNumber {
    return this._spotPriceAfterSwapExactTokenInForTokenOut(
      poolPairData,
      bnum(0),
    );
  }

  _firstGuessOfTokenInForExactSpotPriceAfterSwap(
    poolPairData: MetaStablePoolPairData,
  ): OldBigNumber {
    return poolPairData.allBalances[poolPairData.tokenIndexIn].times(
      bnum(0.01),
    );
  }

  _checkIfInIsOnLimit(
    _poolPairData: MetaStablePoolPairData,
    _amountIn: OldBigNumber,
  ): boolean {
    return true;
  }
}
