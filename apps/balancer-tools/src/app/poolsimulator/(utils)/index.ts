import { PoolQuery } from "@bleu-balancer-tools/gql/src/balancer/__generated__/Ethereum";
import { AMM } from "@bleu-balancer-tools/math-poolsimulator/src";
import { ExtendedGyro2 } from "@bleu-balancer-tools/math-poolsimulator/src/gyro2";
import { ExtendedGyroEV2 } from "@bleu-balancer-tools/math-poolsimulator/src/gyroE";
import { ExtendedMetaStableMath } from "@bleu-balancer-tools/math-poolsimulator/src/metastable";

import { AnalysisData } from "#/contexts/PoolSimulatorContext";
import { fetchECLPDerivativeParams } from "#/lib/eclp-derivative";

import { PoolTypeEnum } from "../(types)";

export async function convertAnalysisDataToAMM(data: AnalysisData) {
  if (!data.poolType || !data.poolParams?.swapFee) return;

  const tokensData = data.tokens.map((token) => ({
    address: token.symbol, // math use address as key, but we will use symbol because custom token will not have address
    balance: String(token.balance),
    decimals: token.decimal,
    priceRate: String(token.rate),
  }));

  switch (data.poolType) {
    case PoolTypeEnum.MetaStable: {
      return new AMM(
        new ExtendedMetaStableMath({
          amp: String(data.poolParams?.ampFactor),
          swapFee: String(data.poolParams?.swapFee),
          totalShares: String(
            data.tokens.reduce((acc, token) => acc + token.balance, 0),
          ),
          tokens: tokensData,
          tokensList: data.tokens.map((token) => String(token.symbol)),
        }),
      );
    }
    case PoolTypeEnum.GyroE: {
      const derivedParams = await fetchECLPDerivativeParams(data);
      return new AMM(
        new ExtendedGyroEV2({
          swapFee: String(data.poolParams?.swapFee),
          totalShares: String(
            data.tokens.reduce((acc, token) => acc + token.balance, 0),
          ),
          tokens: tokensData,
          tokensList: data.tokens.map((token) => String(token.symbol)),

          gyroEParams: {
            alpha: String(data.poolParams?.alpha),
            beta: String(data.poolParams?.beta),
            lambda: String(data.poolParams?.lambda),
            c: String(data.poolParams?.c),
            s: String(data.poolParams?.s),
          },
          derivedGyroEParams: derivedParams,
          tokenRates: data.tokens.map((token) => String(token.rate)),
        }),
      );
    }
    case PoolTypeEnum.Gyro2: {
      return new AMM(
        new ExtendedGyro2({
          swapFee: String(data.poolParams?.swapFee),
          totalShares: String(
            data.tokens.reduce((acc, token) => acc + token.balance, 0),
          ),
          tokens: tokensData,
          tokensList: data.tokens.map((token) => String(token.symbol)),
          sqrtAlpha: String(data.poolParams?.sqrtAlpha),
          sqrtBeta: String(data.poolParams?.sqrtBeta),
        }),
      );
    }
    // case PoolTypeEnum.Gyro3: {
    //   console.log({
    //     swapFee: String(data.poolParams?.swapFee),
    //     totalShares: String(
    //       data.tokens.reduce((acc, token) => acc + token.balance, 0)
    //     ),
    //     tokens: data.tokens.map((token) => ({
    //       address: String(token.symbol), // math use address as key, but we will use symbol because custom token will not have address
    //       balance: String(token.balance),
    //       decimals: token.decimal,
    //       priceRate: String(token.rate),
    //     })),
    //     tokensList: data.tokens.map((token) => String(token.symbol)),
    //     root3Alpha: String(data.poolParams?.root3Alpha),
    //   });
    // }
    default:
      return;
  }
}

export function convertGqlToAnalysisData(poolData: PoolQuery): AnalysisData {
  const tokensData =
    poolData?.pool?.tokens
      ?.filter((token) => token.address !== poolData?.pool?.address) // filter out BPT
      .map((token) => ({
        symbol: token?.symbol,
        balance: Number(token?.balance),
        rate: Number(token?.priceRate),
        decimal: Number(token?.decimals),
      })) || [];
  switch (poolData.pool?.poolType) {
    case PoolTypeEnum.GyroE:
      return {
        poolType: PoolTypeEnum.GyroE,
        poolParams: {
          alpha: Number(poolData?.pool?.alpha),
          beta: Number(poolData?.pool?.beta),
          lambda: Number(poolData?.pool?.lambda),
          c: Number(poolData?.pool?.c),
          s: Number(poolData?.pool?.s),
          swapFee: Number(poolData?.pool?.swapFee),
        },
        tokens: tokensData,
      };
    case PoolTypeEnum.MetaStable:
      return {
        poolType: PoolTypeEnum.MetaStable,
        poolParams: {
          swapFee: Number(poolData?.pool?.swapFee),
          ampFactor: Number(poolData?.pool?.amp),
        },
        tokens: tokensData,
      };
    case PoolTypeEnum.Gyro2:
      return {
        poolType: PoolTypeEnum.Gyro2,
        poolParams: {
          swapFee: Number(poolData?.pool?.swapFee),
          sqrtAlpha: Number(poolData?.pool?.sqrtAlpha),
          sqrtBeta: Number(poolData?.pool?.sqrtBeta),
        },
        tokens: tokensData,
      };
    case PoolTypeEnum.Gyro3:
      return {
        poolType: PoolTypeEnum.Gyro3,
        poolParams: {
          swapFee: Number(poolData?.pool?.swapFee),
          root3Alpha: Number(poolData?.pool?.root3Alpha),
        },
        tokens: tokensData,
      };
    default:
      return {
        poolType: PoolTypeEnum.MetaStable,
        poolParams: {
          swapFee: Number(poolData?.pool?.swapFee),
          ampFactor: Number(poolData?.pool?.amp),
        },
        tokens:
          poolData?.pool?.tokens
            ?.filter((token) => token.address !== poolData?.pool?.address) // filter out BPT
            .map((token) => ({
              symbol: token?.symbol,
              balance: Number(token?.balance),
              rate: Number(token?.priceRate),
              decimal: Number(token?.decimals),
            })) || [],
      };
  }
}

export function calculateCurvePoints({
  balance,
  start = 0,
}: {
  balance?: number;
  start?: number;
}) {
  if (!balance || start === undefined) return [];
  const numberOfPoints = 100;
  const initialValue = balance * 0.001;
  const stepRatio = Math.pow(balance / initialValue, 1 / (numberOfPoints - 1));

  return [
    start,
    ...Array.from(
      { length: numberOfPoints + 20 },
      (_, index) => initialValue * stepRatio ** index,
    ),
  ];
}

export function trimTrailingValues(
  amountsIn: number[],
  amountsOut: number[],
  valueToTrim: number = 100,
): { trimmedIn: number[]; trimmedOut: number[] } {
  const lastIndexNonValue = amountsOut
    .slice()
    .reverse()
    .findIndex((value) => value !== valueToTrim);

  const cutIndex =
    lastIndexNonValue !== -1
      ? amountsOut.length - lastIndexNonValue
      : amountsOut.length;

  const trimmedIn = amountsIn.slice(0, cutIndex);
  const trimmedOut = amountsOut.slice(0, cutIndex);

  return { trimmedIn, trimmedOut };
}
