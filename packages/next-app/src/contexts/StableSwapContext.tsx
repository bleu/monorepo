"use client";

import { bnum, StablePool } from "@balancer-labs/sor";
import { PoolQuery } from "@balancer-pool-metadata/gql/src/balancer-pools/__generated__/Ethereum";
import { parseFixed } from "@ethersproject/bignumber";
import { createContext, PropsWithChildren, useContext, useState } from "react";

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
  tokens?: TokensData[];
  ampFactor?: number;
  swapFee?: number;
}

interface StableSwapContextType {
  initialData?: AnalysisData;
  newData?: AnalysisData;
  indexAnalysisToken: number;
  indexCurrentTabToken: number;
  setIndexAnalysisToken: (index: number) => void;
  setIndexCurrentTabToken: (index: number) => void;
  setInitialData: (data: AnalysisData) => void;
  handleImportPoolParametersById: (data: PoolAttribute) => void;
  newPoolImportedFlag: boolean;
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
  areParamsLoading: boolean;
  setAreParamsLoading: (value: boolean) => void;
}

export const StableSwapContext = createContext({} as StableSwapContextType);

export function StableSwapProvider({ children }: PropsWithChildren) {
  const [initialData, setInitialData] = useState<AnalysisData>();
  const [newData, setNewData] = useState<AnalysisData>();
  const [indexAnalysisToken, setIndexAnalysisToken] = useState<number>(0);
  const [indexCurrentTabToken, setIndexCurrentTabToken] = useState<number>(1);
  const [areParamsLoading, setAreParamsLoading] = useState<boolean>(false);

  const [newPoolImportedFlag, setNewPoolImportedFlag] =
    useState<boolean>(false);

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
    setNewPoolImportedFlag(!newPoolImportedFlag);
    setInitialData(convertGqlToAnalysisData(poolData));
    setNewData(convertGqlToAnalysisData(poolData));
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
        preparePoolPairData,
        numberToOldBigNumber,
        areParamsLoading,
        setAreParamsLoading,
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
