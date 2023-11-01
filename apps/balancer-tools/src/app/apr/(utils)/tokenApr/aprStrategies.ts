import { PoolSnapshotInRangeQuery } from "@bleu-balancer-tools/gql/src/balancer/__generated__/Ethereum";

import { GetDeepProp } from "#/utils/getTypes";

import { PoolTypeEnum } from "../types";

type Snapshot = GetDeepProp<PoolSnapshotInRangeQuery, "poolSnapshots">;
type Pool = Snapshot[number]["pool"];

interface AprStrategy {
  calculateApr(tokenYield: number, pool: Pool, tokenAddress: string): number;
}

class FeeExemptAprStrategy implements AprStrategy {
  calculateApr(tokenYield: number, _pool: Pool, _tokenAddress: string): number {
    return tokenYield;
  }
}

class PhantomOrWeightedAprStrategy implements AprStrategy {
  calculateApr(
    tokenYield: number,
    poolData: Pool,
    tokenAddress: string,
  ): number {
    const DEFAULT_PROTOCOL_YIELD_FEE = 0.5;
    const isExemptFromYieldProtocolFee = poolData.tokens?.find(
      ({ address }) => address === tokenAddress,
    )?.isExemptFromYieldProtocolFee;
    return isExemptFromYieldProtocolFee
      ? tokenYield
      : tokenYield *
          (1 - (poolData.protocolYieldFeeCache ?? DEFAULT_PROTOCOL_YIELD_FEE));
  }
}

class MetaOrGyroAprStrategy implements AprStrategy {
  calculateApr(tokenYield: number, pool: Pool, _tokenAddress: string): number {
    //source: https://github.com/balancer/balancer-sdk/blob/f4879f06289c6f5f9766ead1835f4f4b096ed7dd/balancer-js/src/modules/pools/apr/apr.ts#L124
    const DEFAULT_PROTOCOL_SWAP_FEE = 0.5;
    return (
      tokenYield * (pool.protocolYieldFeeCache ?? DEFAULT_PROTOCOL_SWAP_FEE)
    );
  }
}

export function createAprStrategy(
  poolData: Pool,
  tokenAddress: string,
): AprStrategy | null {
  const { tokens, poolType, poolTypeVersion } = poolData ?? {};

  if (
    //source: https://github.com/balancer/balancer-sdk/blob/f4879f06289c6f5f9766ead1835f4f4b096ed7dd/balancer-js/src/modules/pools/apr/apr.ts#L127
    poolType === PoolTypeEnum.COMPOSABLE_STABLE ||
    (poolType === PoolTypeEnum.WEIGHTED && (poolTypeVersion ?? 0) >= 2)
  ) {
    //source: https://github.com/balancer/balancer-sdk/blob/f4879f06289c6f5f9766ead1835f4f4b096ed7dd/balancer-js/src/modules/pools/apr/apr.ts#L134
    const isExemptFromYieldProtocolFee = tokens?.find(
      ({ address }) => address === tokenAddress,
    )?.isExemptFromYieldProtocolFee;
    if (isExemptFromYieldProtocolFee) {
      return new FeeExemptAprStrategy();
    } else {
      return new PhantomOrWeightedAprStrategy();
    }
  } else if (
    poolType === PoolTypeEnum.META_STABLE ||
    poolType?.includes("Gyro")
  ) {
    return new MetaOrGyroAprStrategy();
  } else {
    throw new Error(
      `Don't know how to calculate APR for the pool type ${poolType}`,
    );
  }
}
