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
  decimal: number;
}

export interface AnalysisData {
  tokens: TokensData[];
  ampFactor?: number;
  swapFee?: number;
}

interface StableSwapContextType {
  initialData: AnalysisData;
  customData: AnalysisData;
  indexAnalysisToken: number;
  indexCurrentTabToken: number;
  setIndexAnalysisToken: (index: number) => void;
  setIndexCurrentTabToken: (index: number) => void;
  setInitialData: (data: AnalysisData) => void;
  setCustomData: (data: AnalysisData) => void;
  handleImportPoolParametersById: (data: PoolAttribute) => void;
  newPoolImportedFlag: boolean;
  isGraphLoading: boolean;
  setIsGraphLoading: (value: boolean) => void;
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
  const [initialData, setInitialData] =
    useState<AnalysisData>(defaultBaselineData);
  const [customData, setCustomData] =
    useState<AnalysisData>(defaultBaselineData);
  const [indexAnalysisToken, setIndexAnalysisToken] = useState<number>(0);
  const [indexCurrentTabToken, setIndexCurrentTabToken] = useState<number>(1);
  const [newPoolImportedFlag, setNewPoolImportedFlag] =
    useState<boolean>(false);

  const [isGraphLoading, setIsGraphLoading] = useState<boolean>(false);

  function convertGqlToAnalysisData(poolData: PoolQuery): AnalysisData {
    return {
      swapFee: Number(poolData?.pool?.swapFee),
      ampFactor: Number(poolData?.pool?.amp),
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
    if (!initialData.swapFee) {
      push("/stableswapsimulator");
    }
    if (pathname === "/stableswapsimulator") {
      setIsGraphLoading(false);
      setInitialData(defaultBaselineData);
      setCustomData(defaultBaselineData);
    }
    if (pathname === "/stableswapsimulator/analysis") {
      setIsGraphLoading(false);
    }
  }, [pathname]);

  return (
    <StableSwapContext.Provider
      value={{
        initialData,
        setInitialData,
        customData,
        setCustomData,
        indexAnalysisToken,
        setIndexAnalysisToken,
        indexCurrentTabToken,
        setIndexCurrentTabToken,
        handleImportPoolParametersById,
        newPoolImportedFlag,
        isGraphLoading,
        setIsGraphLoading,
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
