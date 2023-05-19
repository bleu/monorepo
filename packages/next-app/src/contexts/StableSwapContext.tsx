"use client";

import { PoolQuery } from "@balancer-pool-metadata/gql/src/balancer-pools/__generated__/Ethereum";
import { createContext, PropsWithChildren, useContext, useState } from "react";

import { PoolAttribute } from "#/components/SearchPoolForm";
import { pools } from "#/lib/gql";

export interface TokensData {
  symbol: string | undefined;
  balance: number | undefined;
  rate: number | undefined;
}

export interface AnalysisData {
  tokens?: TokensData[] | undefined;
  ampFactor?: number | undefined;
  swapFee?: number | undefined;
}

interface StableSwapContextType {
  initialData: AnalysisData | null;
  setInitialData: (data: AnalysisData | null) => void;
  handleImportPoolParametersById: (data: PoolAttribute) => void;
}

export const StableSwapContext = createContext({} as StableSwapContextType);

export function StableSwapProvider({ children }: PropsWithChildren) {
  const [initialData, setInitialData] = useState<AnalysisData | null>(null);

  function convertGqlToAnalysisData(
    poolData: PoolQuery | undefined
  ): AnalysisData {
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
    setInitialData(convertGqlToAnalysisData(poolData));
  }

  return (
    <StableSwapContext.Provider
      value={{
        initialData,
        setInitialData,
        handleImportPoolParametersById,
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
