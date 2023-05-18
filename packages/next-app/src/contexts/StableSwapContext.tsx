"use client";

import { PoolQuery } from "@balancer-pool-metadata/gql/src/balancer-pools/__generated__/Mainnet";
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
  ampFactor: number;
  swapFee: number;
}

interface StableSwapContextType {
  initialData: AnalysisData | null;
  handleImportPoolParametersById: (data: PoolAttribute) => void;
}

export const StableSwapContext = createContext({} as StableSwapContextType);

export function StableSwapProvider({ children }: PropsWithChildren) {
  const [initialData, setInitialData] = useState<AnalysisData | null>(null);

  function convertGqlToAnalysisData(
    poolData: PoolQuery | undefined
  ): AnalysisData {
    return {
      swapFee: poolData?.pool?.swapFee,
      ampFactor: poolData?.pool?.amp,
      tokens:
        poolData?.pool?.tokens?.map((token) => ({
          symbol: token?.symbol,
          balance: token?.balance,
          rate: token?.priceRate,
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
