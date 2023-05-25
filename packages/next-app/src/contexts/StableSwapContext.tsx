"use client";

import { PoolQuery } from "@balancer-pool-metadata/gql/src/balancer-pools/__generated__/Ethereum";
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
  rate: number;
}

export interface AnalysisData {
  tokens: TokensData[];
  ampFactor?: number;
  swapFee?: number;
}

interface StableSwapContextType {
  baselineData: AnalysisData;
  variantData: AnalysisData;
  indexAnalysisToken: number;
  indexCurrentTabToken: number;
  setIndexAnalysisToken: (index: number) => void;
  setIndexCurrentTabToken: (index: number) => void;
  setBaselineData: (data: AnalysisData) => void;
  setVariantData: (data: AnalysisData) => void;
  handleImportPoolParametersById: (data: PoolAttribute) => void;
  newPoolImportedFlag: boolean;
}

export const StableSwapContext = createContext({} as StableSwapContextType);

export function StableSwapProvider({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const { push } = useRouter();
  const defaultBaselineData: AnalysisData = {
    ampFactor: undefined,
    swapFee: undefined,
    tokens: [],
  };
  const [baselineData, setBaselineData] =
    useState<AnalysisData>(defaultBaselineData);
  const [variantData, setVariantData] =
    useState<AnalysisData>(defaultBaselineData);
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
    setBaselineData(convertGqlToAnalysisData(poolData));
    setVariantData(convertGqlToAnalysisData(poolData));
  }

  useEffect(() => {
    if (pathname === "/stableswapsimulator") {
      setBaselineData(defaultBaselineData);
      setVariantData(defaultBaselineData);
    }
    if (!baselineData.swapFee) {
      push("/stableswapsimulator");
    }
  }, [pathname]);

  return (
    <StableSwapContext.Provider
      value={{
        baselineData,
        setBaselineData,
        variantData,
        setVariantData,
        indexAnalysisToken,
        setIndexAnalysisToken,
        indexCurrentTabToken,
        setIndexCurrentTabToken,
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
