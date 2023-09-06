"use client";

import { AMM } from "@bleu-balancer-tools/math-poolsimulator/src";
import { PoolPairData } from "@bleu-balancer-tools/math-poolsimulator/src/types";
import { NetworkChainId } from "@bleu-balancer-tools/utils";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  CombinedParams,
  PoolTypeEnum,
  TokensData,
} from "#/app/poolsimulator/(types)";
import {
  convertAnalysisDataToAMM,
  convertGqlToAnalysisData,
} from "#/app/poolsimulator/(utils)";
import { PoolAttribute } from "#/components/SearchPoolForm";
import { pools } from "#/lib/gql";

export type PoolParams = CombinedParams;
export type PoolType = PoolTypeEnum;
export const POOL_TYPES: PoolType[] = [
  PoolTypeEnum.MetaStable,
  PoolTypeEnum.GyroE,
  PoolTypeEnum.Gyro2,
  PoolTypeEnum.Gyro3,
  PoolTypeEnum.Fx,
];
export interface AnalysisData {
  tokens: TokensData[];
  poolType: PoolType;
  poolParams?: PoolParams;
}

export enum DataType {
  initialData = "initialData",
  customData = "customData",
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
  handleImportPoolParametersById: (
    formData: PoolAttribute,
    setData: (data: AnalysisData) => void,
    changeTokens?: boolean,
    data?: AnalysisData,
  ) => void;
  isGraphLoading: boolean;
  setIsGraphLoading: (value: boolean) => void;
  initialAMM?: AMM<PoolPairData>;
  customAMM?: AMM<PoolPairData>;
  generateURL: () => string;
  isAnalysis: boolean;
  setIsAnalysis: (_: boolean) => void;
}

export const defaultPool = {
  //wstETH - WETH on Mainnet/Ethereum
  id: "0x32296969ef14eb0c6d29669c550d4a0449130230000200000000000000000080",
  network: NetworkChainId.ETHEREUM.toString(),
};

export const PoolSimulatorContext = createContext(
  {} as PoolSimulatorContextType,
);

export const defaultAnalysisData: AnalysisData = {
  poolParams: undefined,
  tokens: [],
  poolType: PoolTypeEnum.MetaStable,
};

export const defaultTokensData: TokensData = {
  symbol: "",
  balance: 0,
  rate: 0,
  decimal: 0,
};

export function PoolSimulatorProvider({ children }: PropsWithChildren) {
  const [isAnalysis, setIsAnalysis] = useState<boolean>(false);
  const [initialData, setInitialData] =
    useState<AnalysisData>(defaultAnalysisData);
  const [customData, setCustomData] =
    useState<AnalysisData>(defaultAnalysisData);
  const [initialAMM, setInitialAMM] = useState<AMM<PoolPairData>>();
  const [customAMM, setCustomAMM] = useState<AMM<PoolPairData>>();
  const [analysisToken, setAnalysisToken] =
    useState<TokensData>(defaultTokensData);
  const [currentTabToken, setCurrentTabToken] =
    useState<TokensData>(defaultTokensData);

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

  async function asyncSetAMM(
    data: AnalysisData,
    setAMM: (amm: AMM<PoolPairData>) => void,
  ) {
    const amm = await convertAnalysisDataToAMM(data);
    if (amm) setAMM(amm);
  }

  function generateURL() {
    const jsonState = JSON.stringify({ initialData, customData });

    const encodedState = encodeURIComponent(jsonState);
    return `${window.location.origin}${window.location.pathname}#${encodedState}`;
  }

  async function handleImportPoolParametersById(
    formData: PoolAttribute,
    setData: (data: AnalysisData) => void,
  ) {
    const poolData = await pools.gql(formData.network || "1").Pool({
      poolId: formData.poolId,
    });
    if (!poolData) return;
    const importedData = convertGqlToAnalysisData(poolData);

    setData(importedData);
  }

  useEffect(() => {
    if (window.location.hash) {
      const encodedState = window.location.hash.substring(1);
      const decodedState = decodeURIComponent(encodedState);
      try {
        const state = JSON.parse(decodedState);
        setInitialData(state.initialData);
        setCustomData(state.customData);
        setIsAnalysis(true);
        return;
      } catch (error) {
        throw new Error("Invalid state");
      }
    }
    handleImportPoolParametersById(
      {
        poolId: defaultPool.id,
        network: defaultPool.network,
      },
      setInitialData,
    );
  }, []);

  useEffect(() => {
    asyncSetAMM(initialData, setInitialAMM);
  }, [initialData]);

  useEffect(() => {
    asyncSetAMM(customData, setCustomAMM);
  }, [customData]);

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
        isGraphLoading,
        setIsGraphLoading,
        initialAMM,
        customAMM,
        generateURL,
        isAnalysis,
        setIsAnalysis,
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
