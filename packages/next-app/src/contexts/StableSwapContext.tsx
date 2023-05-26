"use client";

import { bnum, StablePool } from "@balancer-labs/sor";
import { PoolQuery } from "@balancer-pool-metadata/gql/src/balancer-pools/__generated__/Ethereum";
import { parseFixed } from "@ethersproject/bignumber";
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

type StablePoolPairData = ReturnType<
  typeof StablePool.prototype.parsePoolPairData
>;

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
  isGraphLoading: boolean;
  setIsGraphLoading: (value: boolean) => void;
  preparePoolPairData: ({
    indexIn,
    indexOut,
    swapFee,
    allBalances,
    amp,
  }: {
    indexIn: number;
    indexOut: number;
    swapFee: number;
    allBalances: number[];
    amp: number;
  }) => StablePoolPairData;
  numberToOldBigNumber: (number: number, decimals?: number) => typeof bnum;
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

  const [isGraphLoading, setIsGraphLoading] = useState<boolean>(false);

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

  function numberToBigNumber(number: number, decimals = 18) {
    return parseFixed(number.toString(), decimals);
  }

  function numberToOldBigNumber(number: number, decimals = 18) {
    return bnum(number.toFixed(decimals));
  }

  function preparePoolPairData({
    indexIn,
    indexOut,
    swapFee,
    allBalances,
    amp,
  }: {
    indexIn: number;
    indexOut: number;
    swapFee: number;
    allBalances: number[];
    amp: number;
  }) {
    const allBalancesOldBn = allBalances.map((balance) =>
      numberToOldBigNumber(balance)
    );
    const allBalancesBn = allBalances.map((balance) =>
      numberToBigNumber(balance)
    );
    return {
      id: "0x",
      address: "0x",
      poolType: 1,
      tokenIn: "0x",
      tokenOut: "0x",
      balanceIn: numberToBigNumber(allBalances[indexIn]),
      balanceOut: numberToBigNumber(allBalances[indexOut]),
      swapFee: numberToBigNumber(swapFee, 18),
      allBalances: allBalancesOldBn,
      allBalancesScaled: allBalancesBn,
      amp: numberToBigNumber(amp, 3),
      tokenIndexIn: indexIn,
      tokenIndexOut: indexOut,
      decimalsIn: 6,
      decimalsOut: 18,
    } as StablePoolPairData;
  }

  useEffect(() => {
    if (!baselineData.swapFee) {
      push("/stableswapsimulator");
    }
    if (pathname === "/stableswapsimulator") {
      setIsGraphLoading(false);
      setBaselineData(defaultBaselineData);
      setVariantData(defaultBaselineData);
    }
  }, [pathname]);

  useEffect(() => {
    if (baselineData.ampFactor) {
      push("/stableswapsimulator/analysis");
    }
  }, [baselineData]);

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
        isGraphLoading,
        setIsGraphLoading,
        preparePoolPairData,
        numberToOldBigNumber,
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
