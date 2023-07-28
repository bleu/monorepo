"use client";

import { AMM } from "@bleu-balancer-tools/math-poolsimulator/src";
import { MetaStablePoolPairData } from "@bleu-balancer-tools/math-poolsimulator/src/metastable";
import { NetworkChainId } from "@bleu-balancer-tools/utils";
import { usePathname } from "next/navigation";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  GyroEParams,
  MetaStableParams,
  PoolTypeEnum,
  TokensData,
} from "#/app/poolsimulator/(types)";
import { convertGqlToAnalysisData } from "#/app/poolsimulator/(utils)";
import { PoolAttribute } from "#/components/SearchPoolForm";
import { pools } from "#/lib/gql";

export type PoolParams = MetaStableParams & GyroEParams;
export type PoolType = PoolTypeEnum;
export const POOL_TYPES: PoolType[] = [
  PoolTypeEnum.MetaStable,
  PoolTypeEnum.GyroE,
];
export interface AnalysisData {
  tokens: TokensData[];
  poolType: PoolType;
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

export const PoolSimulatorContext = createContext(
  {} as PoolSimulatorContextType
);

export function PoolSimulatorProvider({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const defaultAnalysisData: AnalysisData = {
    poolParams: undefined,
    tokens: [],
    poolType: PoolTypeEnum.MetaStable,
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
  // TODO: BAL-539
  // const [initialAMM, setInitialAMM] = useState<AMM<MetaStablePoolPairData>>();
  // const [customAMM, setCustomAMM] = useState<AMM<MetaStablePoolPairData>>();
  const initialAMM = undefined;
  const customAMM = undefined;
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
