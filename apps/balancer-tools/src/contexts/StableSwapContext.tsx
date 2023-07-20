"use client";

import { PoolQuery } from "@bleu-balancer-tools/gql/src/balancer-pools/__generated__/Ethereum";
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
  generateURL: () => string;
}

const defaultPool = {
  //wstETH - WETH on Mainnet/Ethereum
  id: "0x32296969ef14eb0c6d29669c550d4a0449130230000200000000000000000080",
  network: NetworkChainId.ETHEREUM.toString(),
};

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

  function generateURL() {
    const jsonState = JSON.stringify({ initialData, customData });
    const encodedState = encodeURIComponent(jsonState);
    return `${window.location.origin}${window.location.pathname}#${encodedState}`;
  }

  useEffect(() => {
    if (pathname === "/stableswapsimulator/analysis") push(generateURL());
  }, [initialData, customData]);

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
    if (pathname === "/stableswapsimulator") {
      setIsGraphLoading(false);
      handleImportPoolParametersById({
        poolId: defaultPool.id,
        network: defaultPool.network,
      });
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
        generateURL,
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
