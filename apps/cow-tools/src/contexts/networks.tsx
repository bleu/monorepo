"use client";

import { Network, networkFor } from "@bleu-balancer-tools/utils";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

import { useNetwork } from "#/wagmi";

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
  {} as NetworksContextI,
);

export const NetworksContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [urlPathNetwork, setUrlPathNetwork] = React.useState<number>();
  const [networkConnectedToWallet, setSelectedNetwork] =
    React.useState<number>();

  const network = useNetwork();
  const { push } = useRouter();
  const pathname = usePathname();
  const appName = pathname.split("/")[1];
  useEffect(() => {
    if (!network.chain?.id) setSelectedNetwork(undefined);
    setSelectedNetwork(network.chain?.id);
    if (
      network.chain?.id &&
      networkConnectedToWallet !== undefined &&
      networkConnectedToWallet !== network.chain?.id
    ) {
      push(`/${appName}/${networkFor(network.chain.id).toLowerCase()}`);
    }
  }, [network]);

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
