"use client";

import { PoolQuery } from "@bleu-balancer-tools/gql/src/balancer/__generated__/Ethereum";
import { AMM } from "@bleu-balancer-tools/math-poolsimulator/src";
import { ExtendedGyroEV2 } from "@bleu-balancer-tools/math-poolsimulator/src/gyroE";
import {
  ExtendedMetaStableMath,
  MetaStablePoolPairData,
} from "@bleu-balancer-tools/math-poolsimulator/src/metastable";
import { NetworkChainId } from "@bleu-balancer-tools/utils";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

import { PoolAttribute } from "#/components/SearchPoolForm";
import { pools } from "#/lib/gql";

export interface TokensData {
  symbol: string;
  balance: number;
  decimal: number;
  rate?: number;
  weight?: number;
}

export interface MetaStableParams {
  ampFactor?: number;
  swapFee?: number;
}

export interface GyroEParams {
  alpha?: number;
  beta?: number;
  lambda?: number;
  c?: number;
  s?: number;
  swapFee?: number;
  tauAlphaX?: number;
  tauAlphaY?: number;
  tauBetaX?: number;
  tauBetaY?: number;
  u?: number;
  v?: number;
  w?: number;
  z?: number;
  dSq?: number;
}

export enum PoolTypeEnum {
  MetaStable = "MetaStable",
  GyroE = "GyroE",
}

export type PoolParams = MetaStableParams & GyroEParams;
export type PoolType = PoolTypeEnum;
export const POOL_TYPES: PoolType[] = [
  PoolTypeEnum.MetaStable,
  PoolTypeEnum.GyroE,
];
export interface AnalysisData {
  tokens: TokensData[];
  poolType?: PoolType;
  poolParams?: PoolParams;
}

interface PoolSimulatorContextType {
  initialData: AnalysisData;
  customData: AnalysisData;
  analysisToken: TokensData;
  currentTabToken: TokensData;
  setAnalysisTokenBySymbol: (symbol: string) => void;
  setCurrentTabTokenBySymbol: (symbol: string) => void;
  setAnalysisTokenByIndex: (index: number) => void;
  setCurrentTabTokenByIndex: (index: number) => void;
  setInitialData: (data: AnalysisData) => void;
  setCustomData: (data: AnalysisData) => void;
  handleImportPoolParametersById: (data: PoolAttribute) => void;
  newPoolImportedFlag: boolean;
  isGraphLoading: boolean;
  setIsGraphLoading: (value: boolean) => void;
  generateURL: () => string;
  poolType: PoolType;
  setPoolType: (value: PoolType) => void;
  initialAMM?: AMM<MetaStablePoolPairData>;
  customAMM?: AMM<MetaStablePoolPairData>;
}

const defaultPool = {
  //wstETH - WETH on Mainnet/Ethereum
  id: "0x32296969ef14eb0c6d29669c550d4a0449130230000200000000000000000080",
  network: NetworkChainId.ETHEREUM.toString(),
};

function convertAnalysisDataToAMM(data: AnalysisData) {
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

export const PoolSimulatorContext = createContext(
  {} as PoolSimulatorContextType
);

export function PoolSimulatorProvider({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const { push } = useRouter();
  const defaultAnalysisData: AnalysisData = {
    poolParams: undefined,
    tokens: [],
  };

  const defaultTokensData: TokensData = {
    symbol: "",
    balance: 0,
    rate: 0,
    decimal: 0,
  };

  const [initialData, setInitialData] =
    useState<AnalysisData>(defaultAnalysisData);
  const [customData, setCustomData] =
    useState<AnalysisData>(defaultAnalysisData);
  const [initialAMM, setInitialAMM] = useState<AMM<MetaStablePoolPairData>>();
  const [customAMM, setCustomAMM] = useState<AMM<MetaStablePoolPairData>>();
  const [analysisToken, setAnalysisToken] =
    useState<TokensData>(defaultTokensData);
  const [currentTabToken, setCurrentTabToken] =
    useState<TokensData>(defaultTokensData);
  const [newPoolImportedFlag, setNewPoolImportedFlag] =
    useState<boolean>(false);
  const [poolType, setPoolType] = useState<PoolType>(PoolTypeEnum.MetaStable);

  const [isGraphLoading, setIsGraphLoading] = useState<boolean>(false);

  function setAnalysisTokenBySymbol(symbol: string) {
    const token = initialData.tokens.find((token) => token.symbol === symbol);
    if (token) setAnalysisToken(token);
  }

  function setCurrentTabTokenBySymbol(symbol: string) {
    const token = initialData.tokens.find((token) => token.symbol === symbol);
    if (token) setCurrentTabToken(token);
  }

  function setAnalysisTokenByIndex(index: number) {
    const token = initialData.tokens[index];
    if (token) setAnalysisToken(token);
  }

  function setCurrentTabTokenByIndex(index: number) {
    const token = initialData.tokens[index];
    if (token) setCurrentTabToken(token);
  }

  function generateURL() {
    const jsonState = JSON.stringify({ initialData, customData });
    const encodedState = encodeURIComponent(jsonState);
    return `${window.location.origin}${window.location.pathname}#${encodedState}`;
  }

  useEffect(() => {
    if (pathname === "/poolsimulator/analysis") push(generateURL());
  }, [initialData, customData]);

  useEffect(() => {
    if (initialData.poolParams === undefined) return;
    if (
      initialData.tokens.length < 2 &&
      !initialData.poolType &&
      !initialData.poolParams?.swapFee // all pool type have swapFee
    )
      return;
    setInitialAMM(convertAnalysisDataToAMM(initialData));
  }, [initialData]);

  useEffect(() => {
    if (
      customData.tokens.length < 2 &&
      !customData.poolType &&
      !customData.poolParams?.swapFee // all pool type have swapFee
    )
      return;
    setCustomAMM(convertAnalysisDataToAMM(customData));
  }, [customData]);

  useEffect(() => {
    if (window.location.hash) {
      const encodedState = window.location.hash.substring(1);
      const decodedState = decodeURIComponent(encodedState);
      try {
        const state = JSON.parse(decodedState);
        setInitialData(state.initialData);
        setCustomData(state.customData);
      } catch (error) {
        throw new Error("Invalid state");
      }
    }
  }, []);

  function convertGqlToAnalysisData(poolData: PoolQuery): AnalysisData {
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
            tauAlphaX: Number(poolData?.pool?.tauAlphaX),
            tauAlphaY: Number(poolData?.pool?.tauAlphaY),
            tauBetaX: Number(poolData?.pool?.tauBetaX),
            tauBetaY: Number(poolData?.pool?.tauBetaY),
            u: Number(poolData?.pool?.u),
            v: Number(poolData?.pool?.v),
            w: Number(poolData?.pool?.w),
            z: Number(poolData?.pool?.z),
            dSq: Number(poolData?.pool?.dSq),
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

  async function handleImportPoolParametersById(formData: PoolAttribute) {
    const poolData = await pools.gql(formData.network || "1").Pool({
      poolId: formData.poolId,
    });
    if (!poolData) return;
    setNewPoolImportedFlag(!newPoolImportedFlag);
    setInitialData(convertGqlToAnalysisData(poolData));
    setCustomData(convertGqlToAnalysisData(poolData));
  }

  useEffect(() => {
    if (pathname === "/poolsimulator") {
      setIsGraphLoading(false);
      handleImportPoolParametersById({
        poolId: defaultPool.id,
        network: defaultPool.network,
      });
    }
    if (pathname === "/poolsimulator/analysis") {
      setIsGraphLoading(false);
    }
  }, [pathname]);

  return (
    <PoolSimulatorContext.Provider
      value={{
        initialData,
        setInitialData,
        customData,
        setCustomData,
        analysisToken,
        setAnalysisTokenBySymbol,
        setAnalysisTokenByIndex,
        currentTabToken,
        setCurrentTabTokenBySymbol,
        setCurrentTabTokenByIndex,
        handleImportPoolParametersById,
        newPoolImportedFlag,
        isGraphLoading,
        setIsGraphLoading,
        generateURL,
        initialAMM,
        customAMM,
        poolType,
        setPoolType,
      }}
    >
      {children}
    </PoolSimulatorContext.Provider>
  );
}

export function usePoolSimulator() {
  const context = useContext(PoolSimulatorContext);
  return context;
}
