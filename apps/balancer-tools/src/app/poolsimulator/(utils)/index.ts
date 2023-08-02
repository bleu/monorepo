import { PoolQuery } from "@bleu-balancer-tools/gql/src/balancer/__generated__/Ethereum";
import { AMM } from "@bleu-balancer-tools/math-poolsimulator/src";
import {
  DerivedGyroEParamsFromSubgraph,
  ExtendedGyroEV2,
} from "@bleu-balancer-tools/math-poolsimulator/src/gyroE";
import { ExtendedMetaStableMath } from "@bleu-balancer-tools/math-poolsimulator/src/metastable";

import { AnalysisData } from "#/contexts/PoolSimulatorContext";

import { PoolTypeEnum } from "../(types)";

// const PROD = "https://gyro-eclp-api.fly.dev/"
const fetchECLPDerivativeParams = async (data: AnalysisData) => {
  return await fetch("https://gyro-eclp-api.fly.dev/calculate_derivative_parameters", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      alpha: String(data.poolParams?.alpha),
      beta: String(data.poolParams?.beta),
      l: String(data.poolParams?.lambda),
      c: String(data.poolParams?.c),
      s: String(data.poolParams?.s),
    }),
  })
    .then((res) => res.json())
    .then((res) => res as DerivedGyroEParamsFromSubgraph);
};

export async function convertAnalysisDataToAMM(data: AnalysisData) {
  if (!data.poolType || !data.poolParams?.swapFee) return;

  switch (data.poolType) {
    case PoolTypeEnum.MetaStable: {
      return new AMM(
        new ExtendedMetaStableMath({
          amp: String(data.poolParams?.ampFactor),
          swapFee: String(data.poolParams?.swapFee),
          totalShares: String(
            data.tokens.reduce((acc, token) => acc + token.balance, 0),
          ),
          tokens: data.tokens.map((token) => ({
            address: String(token.symbol), // math use address as key, but we will use symbol because custom token will not have address
            balance: String(token.balance),
            decimals: token.decimal,
            priceRate: String(token.rate),
          })),
          tokensList: data.tokens.map((token) => String(token.symbol)),
        }),
      );
    }
    case PoolTypeEnum.GyroE: {
      return fetchECLPDerivativeParams(data)
        .then((derivedParams) => {
          return new AMM(
            new ExtendedGyroEV2({
              swapFee: String(data.poolParams?.swapFee),
              totalShares: String(
                data.tokens.reduce((acc, token) => acc + token.balance, 0),
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
              derivedGyroEParams: derivedParams,
              tokenRates: data.tokens.map((token) => String(token.rate)),
            }),
          );
        })
        .catch((_err) => undefined);
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
          swapFee: Number(poolData?.pool?.swapFee),
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
