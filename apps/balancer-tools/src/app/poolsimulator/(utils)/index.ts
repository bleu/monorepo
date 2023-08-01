import { PoolQuery } from "@bleu-balancer-tools/gql/src/balancer/__generated__/Ethereum";
import { AMM } from "@bleu-balancer-tools/math-poolsimulator/src";
import { ExtendedGyroEV2 } from "@bleu-balancer-tools/math-poolsimulator/src/gyroE";
import { ExtendedMetaStableMath } from "@bleu-balancer-tools/math-poolsimulator/src/metastable";

import { AnalysisData } from "#/contexts/PoolSimulatorContext";

import { PoolTypeEnum } from "../(types)";

export function convertAnalysisDataToAMM(data: AnalysisData) {
  if (!data.poolType) return;

  switch (data.poolType) {
    case PoolTypeEnum.MetaStable: {
      return new AMM(
        new ExtendedMetaStableMath({
          amp: String(data.poolParams?.ampFactor),
          swapFee: String(data.poolParams?.swapFee),
          totalShares: String(
            data.tokens.reduce((acc, token) => acc + token.balance, 0)
          ),
          tokens: data.tokens.map((token) => ({
            address: String(token.symbol), // math use address as key, but we will use symbol because custom token will not have address
            balance: String(token.balance),
            decimals: token.decimal,
            priceRate: String(token.rate),
          })),
          tokensList: data.tokens.map((token) => String(token.symbol)),
        })
      );
    }
    case PoolTypeEnum.GyroE: {
      return new AMM(
        new ExtendedGyroEV2({
          swapFee: String(data.poolParams?.swapFee),
          totalShares: String(
            data.tokens.reduce((acc, token) => acc + token.balance, 0)
          ),
          tokens: data.tokens.map((token) => ({
            address: String(token.symbol), // math use address as key, but we will use symbol because custom token will not have address
            balance: String(token.balance),
            decimals: token.decimal,
            priceRate: String(token.rate),
          })),
          tokensList: data.tokens.map((token) => String(token.symbol)),

          gyroEParams: {
            alpha: String(data.poolParams?.alpha),
            beta: String(data.poolParams?.beta),
            lambda: String(data.poolParams?.lambda),
            c: String(data.poolParams?.c),
            s: String(data.poolParams?.s),
          },
          derivedGyroEParams: {
            tauAlphaX: String(data.poolParams?.tauAlphaX),
            tauAlphaY: String(data.poolParams?.tauAlphaY),
            tauBetaX: String(data.poolParams?.tauBetaX),
            tauBetaY: String(data.poolParams?.tauBetaY),
            u: String(data.poolParams?.u),
            v: String(data.poolParams?.v),
            w: String(data.poolParams?.w),
            z: String(data.poolParams?.z),
            dSq: String(data.poolParams?.dSq),
          },
          tokenRates: data.tokens.map((token) => String(token.rate)),
        })
      );
    }
  }
}

export function convertGqlToAnalysisData(poolData: PoolQuery): AnalysisData {
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
          swapFee: poolData?.pool?.swapFee,
          tauAlphaX: poolData?.pool?.tauAlphaX,
          tauAlphaY: poolData?.pool?.tauAlphaY,
          tauBetaX: poolData?.pool?.tauBetaX,
          tauBetaY: poolData?.pool?.tauBetaY,
          u: poolData?.pool?.u,
          v: poolData?.pool?.v,
          w: poolData?.pool?.w,
          z: poolData?.pool?.z,
          dSq: poolData?.pool?.dSq,
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
    case PoolTypeEnum.MetaStable:
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
