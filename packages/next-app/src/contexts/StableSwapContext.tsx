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
  setInitialData: (data: AnalysisData) => void;
  handleImportPoolParametersById: (data: PoolAttribute) => void;
  newPoolImportedFlag: boolean;
}

export const StableSwapContext = createContext({} as StableSwapContextType);

export function StableSwapProvider({ children }: PropsWithChildren) {
  const [initialData, setInitialData] = useState<AnalysisData>({
    ampFactor: undefined,
    swapFee: undefined,
    tokens: [],
  });
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
  }

  return (
    <StableSwapContext.Provider
      value={{
        initialData,
        setInitialData,
        handleImportPoolParametersById,
        newPoolImportedFlag,
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
