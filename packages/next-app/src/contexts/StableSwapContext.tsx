"use client";

import { PoolQuery } from "@balancer-pool-metadata/gql/src/balancer-pools/__generated__/Ethereum";
import { createContext, PropsWithChildren, useContext, useState } from "react";

import { PoolAttribute } from "#/components/SearchPoolForm";
import { pools } from "#/lib/gql";

export interface TokensData {
  symbol: string;
  balance: number;
  rate: number;
}

export interface AnalysisData {
  tokens: TokensData[];
  ampFactor?: number;
  swapFee?: number;
}

interface StableSwapContextType {
  initialData: AnalysisData;
  newData?: AnalysisData;
  indexAnalysisToken: number;
  indexCurrentTabToken: number;
  setIndexAnalysisToken: (index: number) => void;
  setIndexCurrentTabToken: (index: number) => void;
  setInitialData: (data: AnalysisData) => void;
  handleImportPoolParametersById: (data: PoolAttribute) => void;
  newPoolImportedFlag: boolean;
  defaultInitialData: AnalysisData;
}

export const StableSwapContext = createContext({} as StableSwapContextType);

export function StableSwapProvider({ children }: PropsWithChildren) {
  const defaultInitialData: AnalysisData = {
    ampFactor: undefined,
    swapFee: undefined,
    tokens: [],
  };
  const [initialData, setInitialData] =
    useState<AnalysisData>(defaultInitialData);
  const [newData, setNewData] = useState<AnalysisData>();
  const [indexAnalysisToken, setIndexAnalysisToken] = useState<number>(0);
  const [indexCurrentTabToken, setIndexCurrentTabToken] = useState<number>(1);
  const [newPoolImportedFlag, setNewPoolImportedFlag] =
    useState<boolean>(false);

  function convertGqlToAnalysisData(poolData: PoolQuery): AnalysisData {
    return {
      swapFee: Number(poolData?.pool?.swapFee),
      ampFactor: Number(poolData?.pool?.amp),
      tokens:
        poolData?.pool?.tokens?.map((token) => ({
          symbol: token?.symbol,
          balance: Number(token?.balance),
          rate: Number(token?.priceRate),
        })) || [],
    };
  }

  async function handleImportPoolParametersById(formData: PoolAttribute) {
    const poolData = await pools.gql(formData.network || "1").Pool({
      poolId: formData.poolId,
    });
    if (!poolData) return;
    setNewPoolImportedFlag(!newPoolImportedFlag);
    setInitialData(convertGqlToAnalysisData(poolData));
    setNewData(convertGqlToAnalysisData(poolData));
  }

  return (
    <StableSwapContext.Provider
      value={{
        initialData,
        newData,
        indexAnalysisToken,
        setIndexAnalysisToken,
        indexCurrentTabToken,
        setIndexCurrentTabToken,
        setInitialData,
        handleImportPoolParametersById,
        newPoolImportedFlag,
        defaultInitialData,
      }}
    >
      {children}
    </StableSwapContext.Provider>
  );
}

export function useStableSwap() {
  const context = useContext(StableSwapContext);
  return context;
}
