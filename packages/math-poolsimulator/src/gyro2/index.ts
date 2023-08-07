/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Gyro2Pool,
  PoolPairBase,
  SubgraphPoolBase,
  SubgraphToken,
} from "@balancer-labs/sor";
import { BigNumber } from "@ethersproject/bignumber";
import { IAMMFunctionality } from "types";

type Gyro2PoolToken = Pick<SubgraphToken, "address" | "balance" | "decimals">;

export type Gyro2PoolPairData = ReturnType<
  typeof Gyro2Pool.prototype.parsePoolPairData
>;

export interface IGyro2Maths {
  swapFee: string;
  totalShares: string;
  tokens: Gyro2PoolToken[];
  tokensList: string[];
  sqrtAlpha: string;
  sqrtBeta: string;
}

// export class ExtendedGyro2
//   extends Gyro2Pool
//   implements IAMMFunctionality<Gyro2PoolPairData>
// {
//   constructor(poolParams: IGyro2Maths) {
//     super(
//       "0x",
//       "0x",
//       poolParams.swapFee,
//       poolParams.totalShares,
//       poolParams.tokens,
//       poolParams.tokensList,
//       poolParams.sqrtAlpha,
//       poolParams.sqrtBeta
//     );
//   }

//   static fromPool(pool: SubgraphPoolBase): ExtendedGyro2 {
//     if (!pool.sqrtAlpha || !pool.sqrtBeta)
//       throw new Error("Gyro2Pool missing sqrtAlpha or sqrtBeta");
//     return new ExtendedGyro2({
//       swapFee: pool.swapFee,
//       totalShares: pool.totalShares,
//       tokens: pool.tokens,
//       tokensList: pool.tokensList,
//       sqrtAlpha: pool.sqrtAlpha,
//       sqrtBeta: pool.sqrtBeta,
//     });
//   }
// }
