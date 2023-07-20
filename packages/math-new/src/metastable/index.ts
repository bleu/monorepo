import {
  bnum,
  MetaStablePool,
  OldBigNumber,
  StableMaths,
  SubgraphPoolBase,
  SubgraphToken,
  ZERO,
} from "@balancer-labs/sor";
import { BigNumber, formatFixed, parseFixed } from "@ethersproject/bignumber";
import { WeiPerEther as EONE } from "@ethersproject/constants";

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

export class ExtendedMetaStableMath extends MetaStablePool {
  constructor(poolParams: IMetaStableMath) {
    super(
      "0x",
      "0x",
      poolParams.amp,
      poolParams.swapFee,
      poolParams.totalShares,
      poolParams.tokens,
      poolParams.tokensList
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
      decimalsIn
    );

    const tokenIndexOut = this.tokens.findIndex((t) => t.address === tokenOut);
    if (tokenIndexOut < 0) throw "Pool does not contain tokenOut";
    const tO = this.tokens[tokenIndexOut];

    const decimalsOut = tO.decimals;
    const tokenOutPriceRate = parseFixed(tO.priceRate, 18);
    const balanceOut = formatFixed(
      parseFixed(tO.balance, decimalsOut).mul(tokenOutPriceRate).div(EONE),
      decimalsOut
    );

    // Get all token balances
    const allBalances = this.tokens.map(({ balance, priceRate }) =>
      bnum(balance).times(bnum(priceRate))
    );
    const allBalancesScaled = this.tokens.map(({ balance, priceRate }) =>
      parseFixed(balance, 18).mul(parseFixed(priceRate, 18)).div(EONE)
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

  _poolDerivatives(
    A: BigNumber,
    balances: OldBigNumber[],
    tokenIndexIn: number,
    tokenIndexOut: number,
    is_first_derivative: boolean,
    wrt_out: boolean
  ): OldBigNumber {
    // This function was copied from @balancer/sor package, since was not exported
    const totalCoins = balances.length;
    const D = StableMaths._invariant(A, balances);
    let S = ZERO;
    for (let i = 0; i < totalCoins; i++) {
      if (i != tokenIndexIn && i != tokenIndexOut) {
        S = S.plus(balances[i]);
      }
    }
    const x = balances[tokenIndexIn];
    const y = balances[tokenIndexOut];
    // A is passed as an ethers bignumber while maths uses bignumber.js
    const AAdjusted = bnum(formatFixed(A, 3));
    const a = AAdjusted.times(totalCoins ** totalCoins); // = ATimesNpowN
    const b = S.minus(D).times(a).plus(D);
    const twoaxy = bnum(2).times(a).times(x).times(y);
    const partial_x = twoaxy.plus(a.times(y).times(y)).plus(b.times(y));
    const partial_y = twoaxy.plus(a.times(x).times(x)).plus(b.times(x));
    let ans;
    if (is_first_derivative) {
      ans = partial_x.div(partial_y);
    } else {
      const partial_xx = bnum(2).times(a).times(y);
      const partial_yy = bnum(2).times(a).times(x);
      const partial_xy = partial_xx.plus(partial_yy).plus(b);
      const numerator = bnum(2)
        .times(partial_x)
        .times(partial_y)
        .times(partial_xy)
        .minus(partial_xx.times(partial_y.pow(2)))
        .minus(partial_yy.times(partial_x.pow(2)));
      const denominator = partial_x.pow(2).times(partial_y);
      ans = numerator.div(denominator);
      if (wrt_out) {
        ans = ans.times(partial_y).div(partial_x);
      }
    }
    return ans;
  }

  _spotPrice(poolPairData: MetaStablePoolPairData): OldBigNumber {
    // This function was developed based on @balancer/sor package
    const ONE = bnum(1);

    const { amp, allBalances, tokenIndexIn, tokenIndexOut, swapFee } =
      poolPairData;
    const n = allBalances.length;
    const A = amp.div(n ** (n - 1));
    const ans = this._poolDerivatives(
      A,
      allBalances,
      tokenIndexIn,
      tokenIndexOut,
      true,
      false
    );
    const spotPriceWithoutRates = ONE.div(
      ans.times(EONE.sub(swapFee).toString()).div(EONE.toString())
    );

    const priceRateIn = bnum(formatFixed(poolPairData.tokenInPriceRate, 18));
    const priceRateOut = bnum(formatFixed(poolPairData.tokenOutPriceRate, 18));
    return spotPriceWithoutRates.times(priceRateOut).div(priceRateIn);
  }
}
