// Place holder about how to add a new pool type
import { MetaStablePool, SubgraphToken } from "@balancer-labs/sor";

import { ExtendedMetaStableMath } from "../metastable";

type MetaStablePoolToken = Pick<
  SubgraphToken,
  "address" | "balance" | "decimals" | "priceRate"
>;

export type MockMetaStablePoolPairData = ReturnType<
  typeof MetaStablePool.prototype.parsePoolPairData
>;

export interface IMetaStableMath_2 {
  amp: string;
  swapFee: string;
  totalShares: string;
  tokens: MetaStablePoolToken[];
  tokensList: string[];
  alpha: string;
  beta: string;
  lambda: string;
  c: string;
  s: string;
}

export class ExtendedMetaStableMath_2 extends ExtendedMetaStableMath {
  alpha: string;
  beta: string;
  lambda: string;
  c: string;
  s: string;

  constructor(poolParams: IMetaStableMath_2) {
    super({
      amp: poolParams.amp,
      swapFee: poolParams.swapFee,
      totalShares: poolParams.totalShares,
      tokens: poolParams.tokens,
      tokensList: poolParams.tokensList,
    });
    this.alpha = poolParams.alpha;
    this.beta = poolParams.beta;
    this.lambda = poolParams.lambda;
    this.c = poolParams.c;
    this.s = poolParams.s;
  }
}
