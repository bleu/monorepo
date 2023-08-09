"use client";

import { useParams, useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import invariant from "tiny-invariant";

import { Round } from "#/app/apr/(utils)/rounds";

interface RoundContextProps {
  selectedRound: string | undefined;
  selectedPool: string | undefined;
  selectedNetwork: string;
  setSelectedPool: (poolId: string | undefined) => void;
  setSelectedRound: (roundId: string | undefined) => void;
  setNetworkId: (networkId: string) => void;
}

export const RoundContext = createContext<RoundContextProps>(
  {} as RoundContextProps,
);

interface RoundContextProviderProps {
  children: ReactNode;
}

export const SelectedPoolRoundContextProvider = ({
  children,
}: RoundContextProviderProps) => {
  const router = useRouter();
  const [selectedRound, setSelectedRound] = useState<string | undefined>();
  const [selectedPool, setSelectedPool] = useState<string | undefined>();
  const [selectedNetwork, setNetworkId] = useState<string>("1");

  const { networkId, roundId, poolId } = useParams();
  invariant(!Array.isArray(networkId), "networkId cannot be a list");
  invariant(!Array.isArray(roundId), "roundId cannot be a list");
  invariant(!Array.isArray(poolId), "poolId cannot be a list");

  useEffect(() => {
    const LAST_ROUND_VALUE = Round.getAllRounds()[0].value;

    if (!selectedRound && parseFloat(roundId)) {
      setSelectedRound(roundId);
    }

    if (roundId == "current") {
      setSelectedRound(LAST_ROUND_VALUE);
      router.push(`/apr/round/${LAST_ROUND_VALUE}`);
    }

    if (!roundId) {
      setSelectedRound(LAST_ROUND_VALUE);
      router.push(`round/${LAST_ROUND_VALUE}`);
    }
  }, [roundId, selectedRound]);

  useEffect(() => {
    if (networkId) {
      setNetworkId(networkId);
      setSelectedPool(undefined);
    }
  }, [networkId]);

  useEffect(() => {
    if (poolId) {
      setSelectedPool(poolId);
    }
    if (selectedPool) {
      router.push(
        `/apr/pool/${selectedNetwork}/${selectedPool}/round/${selectedRound}`,
      );
    }
  }, [poolId, selectedPool, selectedNetwork, selectedRound, router]);

  return (
    <RoundContext.Provider
      value={{
        selectedRound,
        selectedNetwork,
        selectedPool,
        setSelectedPool,
        setSelectedRound,
        setNetworkId,
      }}
    >
      {children}
    </RoundContext.Provider>
  );
};

export const useSelectedPoolRoundContext = () => useContext(RoundContext);
