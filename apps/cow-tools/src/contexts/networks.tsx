"use client";

import { Network, networkFor } from "@bleu/utils";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

export function getNetwork(chainName?: string) {
  if (!chainName) return Network.Ethereum;
  const network =
    chainName?.toLowerCase() === "arbitrum one"
      ? "arbitrum"
      : chainName?.toLowerCase() === "polygon zkevm"
        ? "polygon-zkevm"
        : chainName?.toLowerCase() === "op mainnet"
          ? "optimism"
          : chainName?.toLowerCase();
  return network as Network;
}

interface NetworksContextI {
  urlPathNetwork?: number;
  setUrlPathNetwork: React.Dispatch<React.SetStateAction<number | undefined>>;
  networkConnectedToWallet?: number;
  setSelectedNetwork: React.Dispatch<React.SetStateAction<number | undefined>>;
  mismatchedNetworks: boolean;
}

export const NetworksContext = React.createContext<NetworksContextI>(
  {} as NetworksContextI
);

export const NetworksContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [urlPathNetwork, setUrlPathNetwork] = React.useState<number>();
  const [networkConnectedToWallet, setSelectedNetwork] =
    React.useState<number>();

  const {
    safe: { chainId },
  } = useSafeAppsSDK();
  const { push } = useRouter();
  const pathname = usePathname();
  const appName = pathname.split("/")[1];
  useEffect(() => {
    if (!chainId) setSelectedNetwork(undefined);
    setSelectedNetwork(chainId);
    if (
      chainId &&
      networkConnectedToWallet !== undefined &&
      networkConnectedToWallet !== chainId
    ) {
      push(`/${appName}/${networkFor(chainId).toLowerCase()}`);
    }
  }, [chainId]);

  const mismatchedNetworks =
    networkConnectedToWallet !== undefined &&
    urlPathNetwork != undefined &&
    networkConnectedToWallet !== urlPathNetwork;

  return (
    <NetworksContext.Provider
      value={{
        mismatchedNetworks,
        urlPathNetwork,
        setUrlPathNetwork,
        networkConnectedToWallet,
        setSelectedNetwork,
      }}
    >
      {children}
    </NetworksContext.Provider>
  );
};

export const useNetworks = () => React.useContext(NetworksContext);
