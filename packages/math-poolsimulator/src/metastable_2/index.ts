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
  newParam: string;
}

export class ExtendedMetaStableMath_2 extends ExtendedMetaStableMath {
  newParam: string;

  constructor(poolParams: IMetaStableMath_2) {
    super({
      amp: poolParams.amp,
      swapFee: poolParams.swapFee,
      totalShares: poolParams.totalShares,
      tokens: poolParams.tokens,
      tokensList: poolParams.tokensList,
    });
    this.newParam = poolParams.newParam;
  }
}
