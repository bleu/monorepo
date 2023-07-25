"use client";

import { PoolQuery } from "@bleu-balancer-tools/gql/src/balancer/__generated__/Ethereum";
import { AMM } from "@bleu-balancer-tools/math-poolsimulator/src";
import { ExtendedMetaStableMath } from "@bleu-balancer-tools/math-poolsimulator/src/metastable";
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
  initialAMM?: AMM<ExtendedMetaStableMath>;
  customAMM?: AMM<ExtendedMetaStableMath>;
}

const defaultPool = {
  //wstETH - WETH on Mainnet/Ethereum
  id: "0x32296969ef14eb0c6d29669c550d4a0449130230000200000000000000000080",
  network: NetworkChainId.ETHEREUM.toString(),
};

function convertAnalysisDataToAMM(data: AnalysisData) {
  return new AMM(new ExtendedMetaStableMath({
      amp: String(data.ampFactor),
      swapFee: String(data.swapFee),
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
  }));
}

export const StableSwapContext = createContext({} as StableSwapContextType);

export function StableSwapProvider({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const { push } = useRouter();
  const defaultAnalysisData: AnalysisData = {
    ampFactor: undefined,
    swapFee: undefined,
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
  const [initialAMM, setInitialAMM] = useState<AMM<ExtendedMetaStableMath>>();
  const [customAMM, setCustomAMM] = useState<AMM<ExtendedMetaStableMath>>();
  const [analysisToken, setAnalysisToken] =
    useState<TokensData>(defaultTokensData);
  const [currentTabToken, setCurrentTabToken] =
    useState<TokensData>(defaultTokensData);
  const [newPoolImportedFlag, setNewPoolImportedFlag] =
    useState<boolean>(false);

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
    if (
      initialData.tokens.length < 2 &&
      !initialData.ampFactor &&
      !initialData.swapFee
    )
      return;
    setInitialAMM(convertAnalysisDataToAMM(initialData));
  }, [initialData]);

  useEffect(() => {
    if (
      customData.tokens.length < 2 &&
      !customData.ampFactor &&
      !customData.swapFee
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
    <StableSwapContext.Provider
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
