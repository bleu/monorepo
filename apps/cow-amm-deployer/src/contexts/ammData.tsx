"use client";

import React, { useEffect } from "react";
import useSWR from "swr";
import { Address } from "viem";

import { fetchAmmData, ICowAmm, IToken } from "#/lib/fetchAmmData";
import { fetchWalletTokenBalance } from "#/lib/tokenUtils";
import { ChainId } from "#/utils/chainsPublicClients";

interface IAmmDataContext {
  isAmmDataLoading: boolean;
  ammData: ICowAmm;
  walletBalanceToken0: string;
  walletBalanceToken1: string;
  mutateAmm: () => void;
}

export const AmmDataContext = React.createContext<IAmmDataContext>(
  {} as IAmmDataContext,
);

export const AmmDataContextProvider = ({
  ammId,
  children,
}: React.PropsWithChildren<{ ammId: string }>) => {
  const {
    data: ammData,
    mutate: mutateAmm,
    isLoading: isAmmDataLoading,
  } = useSWR<ICowAmm>(ammId, fetchAmmData);
  const { data: walletBalanceToken0, mutate: mutateBalanceToken0 } = useSWR(
    {
      token: ammData?.token0 as IToken,
      walletAddress: ammData?.user.address as Address,
      chainId: ammData?.order.chainId as ChainId,
    },
    fetchWalletTokenBalance,
  );

  const { data: walletBalanceToken1, mutate: mutateBalanceToken1 } = useSWR(
    {
      token: ammData?.token1 as IToken,
      walletAddress: ammData?.user.address as Address,
      chainId: ammData?.order.chainId as ChainId,
    },
    fetchWalletTokenBalance,
  );

  useEffect(() => {
    if (ammData) {
      mutateBalanceToken0();
      mutateBalanceToken1();
    }
  }, [ammData]);

  return (
    <AmmDataContext.Provider
      value={{
        ammData: ammData as ICowAmm,
        walletBalanceToken0: walletBalanceToken0 as string,
        walletBalanceToken1: walletBalanceToken1 as string,
        mutateAmm,
        isAmmDataLoading,
      }}
    >
      {children}
    </AmmDataContext.Provider>
  );
};

export const useAmmData = () => React.useContext(AmmDataContext);
