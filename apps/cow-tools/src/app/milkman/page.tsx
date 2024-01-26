"use client";

import { NetworkChainId, NetworkFromNetworkChainId } from "@bleu-fi/utils";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { redirect } from "next/navigation";
import { goerli, mainnet } from "viem/chains";

export default function Page() {
  const {
    safe: { chainId },
  } = useSafeAppsSDK();

  if (chainId == goerli.id || chainId == mainnet.id) {
    redirect(
      `/milkman/${NetworkFromNetworkChainId[chainId as NetworkChainId]}`,
    );
  } else redirect("/milkman/mainnet");
}
